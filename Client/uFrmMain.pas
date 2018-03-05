unit uFrmMain;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.ExtCtrls, Vcl.ComCtrls, Vcl.StdCtrls
  , uData, qmsgpack, QWorker, HPSocketSDKUnit;

type
  TFrmMain = class(TForm)
    memLog: TMemo;
    StatusBar1: TStatusBar;
    Panel1: TPanel;
    btnServerConn: TButton;
    btnServerDisconn: TButton;
    btnConfig: TButton;
    btnTest: TButton;
    procedure btnTestClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure btnServerConnClick(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure btnConfigClick(Sender: TObject);
    procedure btnServerDisconnClick(Sender: TObject);
  private
    { Private declarations }
    procedure WmAddLog(var Msg: TMessage); message WM_ADD_LOG;
  public
    { Public declarations }
    procedure SetAppState(AState: EnAppState);
  end;

var
  FrmMain: TFrmMain;
  appState: EnAppState;
  pClient: Pointer;
  pListener: Pointer;

implementation

uses
   uSMS, uPublic, uFrmConfig;//, ufrmTest;

{$R *.dfm}

function fnSendData(AData: Pointer; ADataLen: integer): Boolean;
begin
  Result := False;
  try
    Result := HP_Client_Send(pClient, AData, ADataLen);
  except
    AddLogMsg('SendData fail[%s]...', [GetLastError()]);
  end;
end;

function fnRetResult(ACmd, APriorCmd: TCommType; AClientID: DWORD;  AContent: string): Boolean;
var
  vMsgPack: TQMsgPack;
  vBuf: TBytes;
begin
  vMsgPack := TQMsgPack.Create;
  try
    vMsgPack.Add('Cmd', Integer(ACmd));
    vMsgPack.Add('PriorCmd', Integer(APriorCmd));
    vMsgPack.Add('ClientId', AClientID);
    if AContent = 'OK' then
      vMsgPack.Add('Ret', Integer(rsSuccess))
    else
      vMsgPack.Add('Ret', Integer(rsFail));
    vMsgPack.Add('Content', AContent);
    vBuf := vMsgPack.Encode;
    fnSendData(vBuf, Length(vBuf));
  finally
    SetLength(vBuf, 0);
    FreeAndNil(vMsgPack);
  end;
end;

function SendGroupName(): Boolean;
var
  vMsgPack: TQMsgPack;
  vBuf: TBytes;
begin
  vMsgPack := TQMsgPack.Create;
  try
    vMsgPack.Add('Cmd', Integer(ctGroupName));
    vMsgPack.Add('GroupName', GConfig.GroupName);
    vBuf := vMsgPack.Encode;
    fnSendData(vBuf, Length(vBuf));
  finally
    SetLength(vBuf, 0);
    FreeAndNil(vMsgPack);
  end;
end;

function DoSendSms(AMsgPack: TQMsgPack): string;
var
  vCom: TModelCom;
begin
  Result := '发送短信时发生未知错误';
  if AMsgPack = nil then begin
    Result := '数据有问题';
    Exit;
  end;

  vCom := TModelCom.Create(AMsgPack.ItemByName('ComPort').AsString, AMsgPack.ItemByName('TargetPhone').AsString, GConfig.BaudRate);
  try
    Result := vCom.Open();
    if Result <> 'OK' then
    begin
      AddLogMsg(Result, []);
      Exit;
    end;
    Result := vCom.SendSms(AMsgPack.ItemByName('MsgContent').AsString);
    if Result <> 'OK' then
    begin
      AddLogMsg(Result, []);
      Exit;
    end;
  finally
    vCom.Close();
    FreeAndNil(vCom);
  end;
end;

function DoRecvSms(var AMsgPack: TQMsgPack): string;
begin
  Result := '接收短信时发生未知错误';
end;

procedure DoWork(AJob: PQJob);
var
  vCmdType: TCommType;
  vMsgPack: TQMsgPack;
  sRet: string;
begin
  vMsgPack := AJob.Data;
  try
    if vMsgPack = nil then begin
      AddLogMsg('数据解析失败', []);
      Exit;
    end;

    vCmdType := TCommType(vMsgPack.ItemByName('Cmd').AsInteger);
    case vCmdType of
      ctSendMsg: sRet := DoSendSms(vMsgPack);
      ctRecvMsg: sRet := DoRecvSms(vMsgPack);
    else
      sRet := Format('未知命令: %d', [Integer(vCmdType)]);
    end;
    fnRetResult(ctResult, vCmdType, vMsgPack.ItemByName('ClientId').AsInteger, sRet);
  finally
    FreeAndNil(vMsgPack);
  end;
end;

function DispatchData(const pData: Pointer; iLength: Integer): Boolean;

var
  vMsgPack: TQMsgPack;
  //vBuf: TBytes;
begin
  vMsgPack := TQMsgPack.Create;
  try
    //SetLength(vBuf, iLength);
    //CopyMemory(vBuf, pData, iLength);
    vMsgPack.Parse(pData, iLength);
    if vMsgPack.ItemByName('Cmd').IsNull then
    begin
      AddLogMsg('数据解析失败', []);
      Exit;
    end;
    QWorker.Workers.Post(DoWork, vMsgPack);
  except
    if vMsgPack <> nil then FreeAndNil(vMsgPack);
  end;
end;

function OnSend(dwConnID: DWORD; const pData: Pointer; iLength: Integer): En_HP_HandleResult; stdcall;
begin
  AddLogMsg('[%d,OnSend] -> (%d bytes)', [dwConnID, iLength], True);
  Result := HP_HR_OK;
end;

function OnReceive(dwConnID: DWORD; const pData: Pointer; iLength: Integer): En_HP_HandleResult; stdcall;
begin
  DispatchData(pData, iLength);
  AddLogMsg('[%d,OnReceive] -> (%d bytes)', [dwConnID, iLength], True);
  Result := HP_HR_OK;
end;

function OnConnect(dwConnID: DWORD): En_HP_HandleResult; stdcall;
begin
  if GConfig.SyncSocket then
      frmMain.SetAppState(ST_STARTED);
  AddLogMsg('[%d,OnConnect]', [dwConnID]);
  SendGroupName;
  Result := HP_HR_OK;
end;

function OnCloseConn(dwConnID: DWORD): En_HP_HandleResult; stdcall;
begin
  AddLogMsg('[%d,OnCloseConn]', [dwConnID]);
  FrmMain.SetAppState(ST_STOPED);
  Result := HP_HR_OK;
end;

function OnError(dwConnID: DWORD; enOperation: En_HP_SocketOperation; iErrorCode: Integer): En_HP_HandleResult; stdcall;
begin
  AddLogMsg('[%d,OnError] -> OP:%d,CODE:%d', [dwConnID, Integer(enOperation), iErrorCode]);
  frmMain.SetAppState(ST_STOPED);
  Result := HP_HR_OK;
end;

procedure TFrmMain.btnTestClick(Sender: TObject);
begin
  //fnOpenTest;
end;

procedure TFrmMain.btnServerConnClick(Sender: TObject);
begin
  // 写在这个位置是上面可能会异常
  SetAppState(ST_STARTING);

  if (HP_Client_Start(pClient, PWideChar(GConfig.Host), USHORT(GConfig.Port), GConfig.SyncSocket)) then
  begin
    if not GConfig.SyncSocket then
      SetAppState(ST_STARTED);
    AddLogMsg('$Client Starting ... -> (%s:%d)', [GConfig.Host, GConfig.Port]);
  end else
  begin
    SetAppState(ST_STOPED);
    AddLogMsg('$Client Start Error -> %s(%d)', [HP_Client_GetLastErrorDesc(pClient), Integer(HP_Client_GetLastError(pClient))]);
  end;
end;

procedure TFrmMain.btnServerDisconnClick(Sender: TObject);
begin
  if (HP_Client_Stop(pClient)) then
    AddLogMsg('Client Stop', [])
  else
  begin
    AddLogMsg('Client Stop Error -> %s(%d)', [HP_Client_GetLastErrorDesc(pClient),
              Integer(HP_Client_GetLastError(pClient))]);
    Exit;
  end;
  SetAppState(ST_STOPED);
end;

procedure TFrmMain.btnConfigClick(Sender: TObject);
begin
  if not uFrmConfig.fnOpenCfg then Exit;
  StatusBar1.Panels[0].Text := Format('  猫池组名称：%s', [GConfig.GroupName]);
end;

procedure TFrmMain.FormCreate(Sender: TObject);
begin
  memLog.Lines.Clear;
  uData.hLog := Self.Handle;
  StatusBar1.Panels[0].Text := Format('  猫池组名称：%s', [GConfig.GroupName]);
  pListener := Create_HP_TcpClientListener();
  // 创建 Socket 对象
  pClient := Create_HP_TcpClient(pListener);
  // 设置 Socket 监听器回调函数
  HP_Set_FN_Client_OnConnect(pListener, OnConnect);
  HP_Set_FN_Client_OnSend(pListener, OnSend);
  HP_Set_FN_Client_OnReceive(pListener, OnReceive);
  HP_Set_FN_Client_OnClose(pListener, OnCloseConn);
  HP_Set_FN_Client_OnError(pListener, OnError);
  SetAppState(EnAppState.ST_STOPED);
end;

procedure TFrmMain.FormDestroy(Sender: TObject);
begin
  // 销毁 Socket 对象
  Destroy_HP_TcpClient(pClient);
  // 销毁监听器对象
  Destroy_HP_TcpClientListener(pListener);
end;

procedure TFrmMain.SetAppState(AState: EnAppState);
begin
  appState := AState;
  btnConfig.Enabled := (appState = EnAppState.ST_STOPED);
  //btnTest.Enabled := (appState = EnAppState.ST_STOPED);
  btnServerConn.Enabled := (appState = EnAppState.ST_STOPED);
  btnServerDisconn.Enabled := (appState = EnAppState.ST_STARTED);
  case appState of
    EnAppState.ST_STARTING: StatusBar1.Panels[1].Text := '  状态：正在连接';
    EnAppState.ST_STARTED: StatusBar1.Panels[1].Text := '  状态：已连接';
    EnAppState.ST_STOPING: StatusBar1.Panels[1].Text := '  状态：正在断开连接';
    EnAppState.ST_STOPED: StatusBar1.Panels[1].Text := '  状态：未连接';
  end;
end;

procedure TFrmMain.WmAddLog(var Msg: TMessage);
var
  sMsg: string;
begin
  if memLog.Lines.Count > 1000 then
    memLog.Clear;
  sMsg := string(Msg.LParam);
  memLog.Lines.Add(sMsg);
end;

end.
