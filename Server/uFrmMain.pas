unit uFrmMain;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics,
  Controls, Forms, Dialogs, StdCtrls, HPSocketSDKUnit,
  uPublic, Vcl.ExtCtrls, Vcl.ComCtrls, Vcl.Samples.Spin,
  uServerPublic, uDataProcess, uFrmConfig;

type
  TFrmMain = class(TForm)
    Panel1: TPanel;
    btnStop: TButton;
    btnStart: TButton;
    btnDisConn: TButton;
    GroupBox1: TGroupBox;
    LstDevices: TListView;
    GroupBox2: TGroupBox;
    lstMsg: TListBox;
    btnConfig: TButton;
    procedure FormCreate(Sender: TObject);
    procedure btnStartClick(Sender: TObject);
    procedure btnStopClick(Sender: TObject);
    procedure btnDisConnClick(Sender: TObject);
    procedure lstMsgKeyPress(Sender: TObject; var Key: Char);
    procedure LstDevicesChange(Sender: TObject; Item: TListItem;
      Change: TItemChange);
    procedure btnConfigClick(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure FormCloseQuery(Sender: TObject; var CanClose: Boolean);
  private
    { Private declarations }
    procedure SetAppState(state: EnAppState);
    procedure WmAddLogMsg(var msg: TMessage); message WM_ADD_LOG;
    procedure WmAddDevice(var msg: TMessage); message WM_ADD_DEVICE;
    function GetLstDeviceInfoIndex(AConnID: DWORD): Integer;
    function SaveConfig: Boolean;
    function LoadConfig: Boolean;
  public
    { Public declarations }
    procedure OnRec(dwConnId: DWORD; const pData: Pointer; iLength: Integer);
    procedure OnClsConn(dwConnId: DWORD);
  end;

var
  FrmMain: TFrmMain;

implementation

uses System.IniFiles;

{$R *.dfm}

{$REGION 'Socket事件'}

function OnPrepareListen(soListen: Pointer): En_HP_HandleResult; stdcall;
begin
  Result := HP_HR_OK;
end;

function OnAccept(dwConnId: DWORD; pClient: Pointer)
  : En_HP_HandleResult; stdcall;
var
  ip: array [0 .. 40] of WideChar;
  ipLength: Integer;
  port: USHORT;
  vDeviceInfo: TDeviceInfo;
begin
  ipLength := 40;
  if HP_Server_GetRemoteAddress(GHPServer, dwConnId, ip, @ipLength, @port) then
  begin
    if not GDeviceInfos.ContainsKey(dwConnId) then
    begin
      // New(vDeviceInfo);
      vDeviceInfo.IsDevice := False;
      vDeviceInfo.ConnectID := dwConnId;
      vDeviceInfo.ip := string(ip);
      vDeviceInfo.port := Word(port);
      GDeviceInfos.Add(dwConnId, vDeviceInfo);
    end;

    AddLogMsg('[%d,OnAccept] -> PASS(%s:%d)', [dwConnId, string(ip), port]);
  end
  else
  begin
    AddLogMsg('[[%d,OnAccept] -> HP_Server_GetClientAddress() Error', [dwConnId]);
  end;

  Result := HP_HR_OK;
end;

function OnServerShutdown(): En_HP_HandleResult; stdcall;
begin
  AddLogMsg('[OnServerShutdown]', []);
  DisConnDataBase;
  Result := HP_HR_OK;
end;

function OnSend(dwConnId: DWORD; const pData: Pointer; iLength: Integer)
  : En_HP_HandleResult; stdcall;
begin
  AddLogMsg('[%d,OnSend] -> (%d bytes)', [dwConnId, iLength]);
  Result := HP_HR_OK;
end;

function OnReceive(dwConnId: DWORD; const pData: Pointer; iLength: Integer)
  : En_HP_HandleResult; stdcall;
begin
  AddLogMsg('[%d,OnReceive] -> (%d bytes)', [dwConnId, iLength]);
  FrmMain.OnRec(dwConnId, pData, iLength);
  Result := HP_HR_OK;
end;

function OnCloseConn(dwConnId: DWORD): En_HP_HandleResult; stdcall;
begin
  FrmMain.OnClsConn(dwConnId);
  AddLogMsg('[%d,OnCloseConn]', [dwConnId]);
  Result := HP_HR_OK;
end;

function OnError(dwConnId: DWORD; enOperation: En_HP_SocketOperation;
  iErrorCode: Integer): En_HP_HandleResult; stdcall;
begin
  AddLogMsg('[%d,OnError] -> OP:%d,CODE:%d', [dwConnId, Integer(enOperation), iErrorCode]);
  Result := HP_HR_OK;
end;

{$ENDREGION}

function TFrmMain.SaveConfig: Boolean;
var
  vIniFile: TIniFile;
begin
  vIniFile := TIniFile.Create(GConfigFileName);
  try
    vIniFile.WriteString('Server', 'IP', GConfigInfo.IP);
    vIniFile.WriteInteger('Server', 'Port', GConfigInfo.Port);
    vIniFile.WriteString('DataBase', 'Host', GConfigInfo.DB_Host);
    vIniFile.WriteString('DataBase', 'DBName', GConfigInfo.DB_Name);
    vIniFile.WriteString('DataBase', 'DBAccount', GConfigInfo.DB_Account);
    vIniFile.WriteString('DataBase', 'DBPassWord', GConfigInfo.DB_PassWord);
  finally
    FreeAndNil(vIniFile);
  end;
end;

function TFrmMain.LoadConfig: Boolean;
var
  vIniFile: TIniFile;
begin
  vIniFile := TIniFile.Create(GConfigFileName);
  try
    GConfigInfo.IP := vIniFile.ReadString('Server', 'IP', '');
    GConfigInfo.Port := vIniFile.ReadInteger('Server', 'Port', 0);
    GConfigInfo.DB_Host := vIniFile.ReadString('DataBase', 'Host', '');
    GConfigInfo.DB_Name := vIniFile.ReadString('DataBase', 'DBName', '');
    GConfigInfo.DB_Account := vIniFile.ReadString('DataBase', 'DBAccount', '');
    GConfigInfo.DB_PassWord := vIniFile.ReadString('DataBase', 'DBPassWord', '');
  finally
    FreeAndNil(vIniFile);
  end;
end;

procedure TFrmMain.SetAppState(state: EnAppState);
begin
  GAppState := state;
  btnStart.Enabled := (GAppState = EnAppState.ST_STOPED);
  btnStop.Enabled := (GAppState = EnAppState.ST_STARTED);
  btnConfig.Enabled := (GAppState = EnAppState.ST_STOPED);
  btnDisConn.Enabled := ((GAppState = EnAppState.ST_STARTED) and
    (LstDevices.Selected <> nil));
end;

procedure TFrmMain.WmAddDevice(var msg: TMessage);
var
  vConnID: DWORD;
  vIndex: Integer;
  vItem: TListItem;
begin
  vConnID := DWORD(msg.LParam);
  if not GDeviceInfos.ContainsKey(vConnID) then Exit;
  vIndex := GetLstDeviceInfoIndex(vConnID);
  if vIndex < 0 then begin
    // --没有找到，则添加，
    vItem := LstDevices.Items.Add;
    vItem.Caption := IntToStr(vConnID);
    vItem.SubItems.Add(string(GDeviceInfos[vConnID].GroupName));
    vItem.SubItems.Add(string(GDeviceInfos[vConnID].ip));
    vItem.SubItems.Add(IntToStr(GDeviceInfos[vConnID].port));
  end else begin
    // --找到则修改GroupName
    LstDevices.Items[vIndex].Caption := IntToStr(vConnID);
    LstDevices.Items[vIndex].SubItems.Strings[0] := string(GDeviceInfos[vConnID].GroupName);
    LstDevices.Items[vIndex].SubItems.Strings[1] := string(GDeviceInfos[vConnID].ip);
    LstDevices.Items[vIndex].SubItems.Strings[2] := IntToStr(GDeviceInfos[vConnID].port);
  end;
end;

procedure TFrmMain.WmAddLogMsg(var msg: TMessage);
var
  sText: string;
begin
  sText := Format('%s %s', [FormatDateTime('yyyy-MM-dd HH:mm:ss', Now()), string(msg.LParam)]);
  if lstMsg.Items.Count > 100 then
  begin
    lstMsg.Items.Clear;
  end;
  lstMsg.Items.Add(sText);
  lstMsg.ItemIndex := lstMsg.Items.Count - 1;
end;

procedure TFrmMain.btnConfigClick(Sender: TObject);
var
  F: TFrmConfig;
begin
  if GAppState <> ST_STOPED then Exit;
  F := TFrmConfig.Create(Self);
  try
    F.edtIpAddress.Text := Trim(GConfigInfo.IP);
    F.edtPort.Value := GConfigInfo.Port;
    F.edtDataBaseHost.Text := Trim(GConfigInfo.DB_Host);
    F.edtDataBaseName.Text := Trim(GConfigInfo.DB_Name);
    F.edtAccount.Text := Trim(GConfigInfo.DB_Account);
    F.edtPassWord.Text := Trim(GConfigInfo.DB_PassWord);
    if F.ShowModal = mrOk then begin
      GConfigInfo.IP := Trim(F.edtIpAddress.Text);
      GConfigInfo.Port := F.edtPort.Value;
      GConfigInfo.DB_Host := Trim(F.edtDataBaseHost.Text);
      GConfigInfo.DB_Name := Trim(F.edtDataBaseName.Text);
      GConfigInfo.DB_Account := Trim(F.edtAccount.Text);
      GConfigInfo.DB_PassWord := Trim(F.edtPassWord.Text);
      SaveConfig();
    end;
  finally
    FreeAndNil(F);
  end;
end;

procedure TFrmMain.btnDisConnClick(Sender: TObject);
var
  dwConnId: DWORD;
begin
  if LstDevices.Items.Count <= 0 then Exit;
  if LstDevices.Selected = nil then Exit;
  dwConnId := StrToIntDef(LstDevices.Selected.Caption, 0);
  if dwConnId = 0 then Exit;
  if HP_Server_Disconnect(GHPServer, dwConnId, 1) then
    AddLogMsg('(%d) Disconnect OK', [dwConnId])
  else
    AddLogMsg('(%d) Disconnect Error', [dwConnId]);
end;

procedure TFrmMain.btnStartClick(Sender: TObject);
var
  ip: PWideChar;
  port: USHORT;
  errorId: En_HP_SocketError;
  errorMsg: PWideChar;
begin
  SetAppState(ST_STARTING);
  if not ConnDataBase then Exit;
  if HP_Server_Start(GHPServer, PWideChar(GConfigInfo.IP), GConfigInfo.Port) then
  begin
    AddLogMsg('Server Start OK -> (%s:%d)', [ip, port]);
    SetAppState(ST_STARTED);
  end else begin
    errorId := HP_Server_GetLastError(GHPServer);
    errorMsg := HP_Server_GetLastErrorDesc(GHPServer);
    AddLogMsg('Server Start Error -> %s(%d)', [errorMsg, Integer(errorId)]);
    SetAppState(ST_STOPED);
  end;
end;

procedure TFrmMain.btnStopClick(Sender: TObject);
var
  errorId: En_HP_SocketError;
  errorMsg: PWideChar;
begin
  SetAppState(ST_STOPING);
  AddLogMsg('Server Stop', []);
  if HP_Server_Stop(GHPServer) then begin
    SetAppState(ST_STOPED);
  end else begin
    errorId := HP_Server_GetLastError(GHPServer);
    errorMsg := HP_Server_GetLastErrorDesc(GHPServer);
    AddLogMsg('Stop Error -> %s(%d)', [errorMsg, Integer(errorId)]);
  end;
end;

procedure TFrmMain.FormCloseQuery(Sender: TObject; var CanClose: Boolean);
begin
  if GAppState <> ST_STOPED then begin
    CanClose := False;
    Application.MessageBox('服务正在运行, 不能关闭!', '警告', MB_ICONWARNING);
  end;
end;

procedure TFrmMain.FormCreate(Sender: TObject);
begin
  GFrmMainHwnd := Self.Handle;
  // 创建监听器对象
  GHPListener := Create_HP_TcpServerListener();

  // 创建 Socket 对象
  GHPServer := Create_HP_TcpServer(GHPListener);

  // 设置 Socket 监听器回调函数
  HP_Set_FN_Server_OnPrepareListen(GHPListener, OnPrepareListen);
  HP_Set_FN_Server_OnAccept(GHPListener, OnAccept);
  HP_Set_FN_Server_OnSend(GHPListener, OnSend);
  HP_Set_FN_Server_OnReceive(GHPListener, OnReceive);
  HP_Set_FN_Server_OnClose(GHPListener, OnCloseConn);
  HP_Set_FN_Server_OnError(GHPListener, OnError);
  HP_Set_FN_Server_OnShutdown(GHPListener, OnServerShutdown);
  SetAppState(ST_STOPED);
  LoadConfig;
end;

procedure TFrmMain.FormDestroy(Sender: TObject);
begin
  // 销毁 Socket 对象
  Destroy_HP_TcpServer(GHPServer);
  // 销毁监听器对象
  Destroy_HP_TcpServerListener(GHPListener);
end;

function TFrmMain.GetLstDeviceInfoIndex(AConnID: DWORD): Integer;
var
  I: Integer;
begin
  Result := -1;
  for I := 0 to LstDevices.Items.Count - 1 do
  begin
    if LstDevices.Items[I].Caption = IntToStr(AConnID) then
    begin
      Result := I;
      Break;
    end;
  end;
end;

procedure TFrmMain.LstDevicesChange(Sender: TObject; Item: TListItem;
  Change: TItemChange);
begin
  btnDisConn.Enabled := ((GAppState = EnAppState.ST_STARTED) and (LstDevices.Selected <> nil));
end;

procedure TFrmMain.lstMsgKeyPress(Sender: TObject; var Key: Char);
begin
  if (Key = 'c') or (Key = 'C') then lstMsg.Items.Clear;
end;

procedure TFrmMain.OnRec(dwConnId: DWORD; const pData: Pointer; iLength: Integer);
//var
//  vDataProcess: TDataProcess;
begin
  TDataProcess.Create(dwConnId, pData, iLength);
  //vDataProcess := TDataProcess.Create(dwConnId, pData, iLength);
  // 拷贝至指针
  //CopyMemory(vDataProcess.Data, pData, iLength);
  //vDataProcess.DataLen := iLength;
  //vDataProcess.Resume;
end;

procedure TFrmMain.OnClsConn(dwConnId: DWORD);
var
  I: Integer;
begin
  // --关闭链接时， 删除信息
  if GDeviceInfos.ContainsKey(dwConnId) then
  begin
    GDeviceInfos.Remove(dwConnId);
  end;
  // --删除界面信息
  for I := 0 to LstDevices.Items.Count - 1 do
  begin
    if LstDevices.Items[I].Caption = IntToStr(dwConnId) then
    begin
      LstDevices.Items[I].Delete;
      Break;
    end;
  end;
end;


// procedure TDoSerRec.Execute;
// var
// SendMsg : PTMsg;
// begin
// inherited;
// try
// Move(pdata, RecMsg, ilen);
// try
// case RecMsg.nType of
// 1000 : begin
// //处理消息
// Synchronize(showmsg);
// New(SendMsg);
// try
// SendMsg.nType := 1001;
// SendMsg.nMsg := 'Do Rec; Ready do other thing?';
// HP_Server_Send(pServer, FId, SendMsg, SizeOf(ttmsg));
// finally
// Dispose(SendMsg);
// end;
// end;
// end;
// except
//
// end;
// finally
//
// end;
// end;

end.
