unit uSmsThread;

interface

uses
  Winapi.Windows, System.SysUtils, System.Classes, Winapi.ActiveX,
  IdHTTP, IdSSLOpenSSL, Winapi.WinInet, Winapi.ShellAPI,
  Winapi.Messages,
  IdGlobal,
  IdTCPClient,
  ManSoy.Base64,
  Vcl.Controls,
  vcl.forms,
  uData,
  Web.HTTPApp,
  uPublic,
  HPSocketSDKUnit,
  qmsgpack;

type

  TSmsThread = class(TThread)
  private
    FAccount          : string;
    FServerIp         : string;
    FServerPort       : WORD;
    FTokenServerIp        : string;
    FTokenServerPort      : WORD;
    FSmsServerIp      : string;
    FSmsServerPort    : WORD;
    FSmsContent: string;
    FTargetPhone: string;

    function QuitSafeBySms(): string;

    //-----------------------------------------------------------
    function ConnectServer(AIP: string; APort: Integer): Boolean;
    function DisconnectServer(): Boolean;
    function SendUnsafe(): Boolean;
    function SendData(pData: Pointer; ALen: Integer): Boolean;
    //-----------------------------------------------------------
  protected
    procedure Execute; override;
  public
    constructor Create(AAccount: string);
    destructor Destroy; override;
    property TokenServerIp  : string  read FTokenServerIp   write FTokenServerIp;
    property TokenServerPort: WORD    read FTokenServerPort write FTokenServerPort;
    property SmsServerIp  : string  read FSmsServerIp   write FSmsServerIp;
    property SmsServerPort: WORD    read FSmsServerPort write FSmsServerPort;
  end;

  TDoClientRec = class(TThread)
      pClient: Pointer;
      MsgPack: TQMsgPack;
    private
      procedure DealResultMsg();
      procedure DealSendMsg();
    protected
      procedure Execute;override;
    public
      constructor Create(AClient, AData: Pointer; ALen: Integer);
      destructor Destroy;override;
  end;

var
  pClient: Pointer;
  pListener: Pointer;

  GSmsEvent: THANDLE;
  GRetState: string;

implementation

//{$R qqlogin.RES}

uses System.IniFiles, System.StrUtils, Vcl.Imaging.GIFImg, Vcl.Imaging.JPEG,
     System.Variants, System.Win.ComObj, ManSoy.MsgBox, ManSoy.StrSub,ManSoy.Global,
     uFun, DmUtils;

function OnSend(dwConnID: DWORD; const pData: Pointer; iLength: Integer): En_HP_HandleResult; stdcall;
begin
  ManSoy.Global.DebugInf('MS - [%d,OnSend] -> (%d bytes)', [dwConnID, iLength]);
  Result := HP_HR_OK;
end;

function OnReceive(dwConnID: DWORD; const pData: Pointer; iLength: Integer): En_HP_HandleResult; stdcall;
var
  doRec: TDoClientRec;
begin
  //SetEvent(GSmsEvent);
  ManSoy.Global.DebugInf('MS - [%d,OnReceive] -> (%d bytes)', [dwConnID, iLength]);
  doRec := TDoClientRec.Create(pClient, pData, iLength);
  doRec.Resume;
  Result := HP_HR_OK;
end;

function OnConnect(dwConnID: DWORD): En_HP_HandleResult; stdcall;
begin
  ManSoy.Global.DebugInf('MS - [%d,OnConnect]', [dwConnID]);
  Result := HP_HR_OK;
end;

function OnCloseConn(dwConnID: DWORD): En_HP_HandleResult; stdcall;
begin
  ManSoy.Global.DebugInf('MS - [%d,OnCloseConn]', [dwConnID]);
  Result := HP_HR_OK;
end;

function OnError(dwConnID: DWORD; enOperation: En_HP_SocketOperation; iErrorCode: Integer): En_HP_HandleResult; stdcall;
begin
  ManSoy.Global.DebugInf('MS - [%d,OnError] -> OP:%d,CODE:%d', [dwConnID, Integer(enOperation), iErrorCode]);
  Result := HP_HR_OK;
end;


{ TDispatchThread }

constructor TSmsThread.Create(AAccount: string);
begin
  FAccount := AAccount;
  with TIniFile.Create(ExtractFilePath(ParamStr(0))+'QuitSafeConfig\Cfg.ini') do
  try
    FTokenServerIp   := ReadString('TokenSvr', 'Host', '113.140.30.46'); //192.168.192.252
    FTokenServerPort := ReadInteger('TokenSvr', 'Port', 59998);          //8899
    FSmsServerIp   := ReadString( 'SmsServer', 'ip', '113.140.30.46');
    FSmsServerPort := ReadInteger('SmsServer', 'port', 5008);
    FSmsContent := ReadString('SmsEdit', 'SmsContent', '解除安全模式');
    FTargetPhone := ReadString('SmsEdit', 'TargetPhone', '1069070069');
  finally
    Free;
  end;

  // 创建监听器对象
  pListener := Create_HP_TcpClientListener();
  // 创建 Socket 对象
  pClient := Create_HP_TcpClient(pListener);
  // 设置 Socket 监听器回调函数
  HP_Set_FN_Client_OnConnect(pListener, OnConnect);
  HP_Set_FN_Client_OnSend(pListener, OnSend);
  HP_Set_FN_Client_OnReceive(pListener, OnReceive);
  HP_Set_FN_Client_OnClose(pListener, OnCloseConn);
  HP_Set_FN_Client_OnError(pListener, OnError);

  GSmsEvent := CreateEvent(nil, True, False, 'SmsEvent');

  FreeOnTerminate := True;
  inherited Create(false);
end;

destructor TSmsThread.Destroy;
begin
  DisconnectServer();
  CloseHandle(GSmsEvent);
  inherited;
end;

procedure TSmsThread.Execute;
var
  sRet: string;
begin
  try
    try
      sRet := QuitsafeBySms();
      //SendMessage(GMainHandle, WM_CLOSE_WINDOW, 0, 0);
      //SendMessage(GMainHandle, WM_SEND_RET, 0, Integer(SRet));
    except on E: Exception do
      begin
        ManSoy.MsgBox.WarnMsg(0, '解安全异常'#13'%s', [E.Message]);
        Exit;
      end;
    end;
  finally
  end;
end;

function TSmsThread.QuitSafeBySms: string;
var
  szHtml, sRet: string;
  wParam : TStrings;
  AResponseContent: TStringStream;
  dwTickcount: DWORD;
begin
  Result := Format('解安全失败!', []);

  GRetState := '设备未知错误';
  //向服务端发送解安全命令

  ResetEvent(GSmsEvent);
  if not SendUnsafe() then Exit;
  //LogOut('正在发送短信解安全(QQ=%s，接收号码=%s，发送内容=%s)，请稍后...', [SafeData.QQ, SafeData.PhoneNum,SafeData.MsgContent]);
  WaitForSingleObject(GSmsEvent, 6000 * 1000);  //--等一分钟

  if GRetState <> 'OK' then
  begin
    Result := GRetState;
    ManSoy.MsgBox.WarnMsg(0, GRetState, [])
  end else
  begin
    ManSoy.MsgBox.InfoMsg(0, '短信已发送', []);
    Result := 'OK'
  end;
end;

//----------------------------------------------------------------------------------
function TSmsThread.ConnectServer(AIP: string; APort: Integer): Boolean;
begin
  Result := False;
  if (HP_Client_Start(pClient, PWideChar(AIP), APort, False)) then
  begin
    Result := True;
    ManSoy.Global.DebugInf('MS - Client connected -> (%s:%d)', [AIP, APort]);
  end else
  begin
    ManSoy.Global.DebugInf('MS - Client connect error -> (%s:%d)', [HP_Client_GetLastErrorDesc(pClient), Integer( HP_Client_GetLastError(pClient))]);
  end;
end;

function TSmsThread.DisconnectServer: Boolean;
begin
  Result := False;
  if (HP_Client_Stop(pClient)) then
  begin
    Result := True;
    ManSoy.Global.DebugInf('MS - Client Disconnected', []);
  end else
  begin
    ManSoy.Global.DebugInf('MS - Client Disconnected Error -> %s(%d)', [HP_Client_GetLastErrorDesc(pClient), Integer(HP_Client_GetLastError(pClient))]);
  end;
end;

function TSmsThread.SendData(pData: Pointer; ALen: Integer): Boolean;
begin
  Result := HP_Client_Send(pClient, pData, ALen);
end;

function TSmsThread.SendUnsafe: Boolean;
var
  dwConnID: DWORD;
  MsgPack: TQMsgPack;
  vData: TBytes;
  ss: TMemoryStream;
begin
  Result := False;
  if not ConnectServer(FSmsServerIp, FSmsServerPort) then Exit;
  dwConnID := HP_Client_GetConnectionID(pClient);

  MsgPack := TQMsgPack.Create();
  try
    MsgPack.Add('Cmd', Ord(TCommType.ctSendMsg));
    MsgPack.Add('QQ', FAccount);
    //MsgPack.Add('TargetPhone', '10698888170069');
    //MsgPack.Add('TargetPhone', '1069070069');
    MsgPack.Add('TargetPhone', FTargetPhone);
    MsgPack.Add('MsgContent', FSmsContent);
    //MsgPack.Add('MsgContent', '解除安全模式');
    vData := MsgPack.Encode();
    if SendData(vData, Length(vData)) then
    begin
      ManSoy.Global.DebugInf('MS - ConnId=%d, Send unsafe cmmand successful, QQ=%s', [dwConnID, 'vData.QQ']);
    end else
    begin
      ManSoy.Global.DebugInf('MS - ConnId=%d, Send unsafe cmmand failed, QQ=%s', [dwConnID, 'vData.QQ']);
      Exit;
    end;
  finally
    FreeAndNil(MsgPack);
  end;
  Result := True;
end;

{ TDoClientRec }

constructor TDoClientRec.Create(AClient, AData: Pointer; ALen: Integer);
var
  vData: TBytes;
begin
  inherited Create(True);
  pClient := AClient;

  SetLength(vData, ALen);
  CopyMemory(vData, AData, ALen);
  MsgPack := TQMsgPack.Create;
  MsgPack.Parse(vData);

  SetLength(vData, 0);

  FreeOnTerminate := True;
end;

procedure TDoClientRec.DealResultMsg;
var
  //vResultInfo: TResultInfo;
  isSucc: Boolean;
begin
  //接到服务返回的消息
  {
  vResultInfo := TResultInfo(pData^);
  ResultInfo.ResultState :=  vResultInfo.ResultState;
  ResultInfo.ResuleMsg := vResultInfo.ResuleMsg;
  ManSoy.Global.DebugInf('MS - %s',[vResultInfo.ResuleMsg]);
  }
end;

procedure TDoClientRec.DealSendMsg;
begin
  if MsgPack.ItemByName('Ret').AsInteger = ord(TResultState.rsFail) then
  begin
     GRetState := MsgPack.ItemByName('Content').AsString;
     ManSoy.Global.DebugInf('MS - %s',[MsgPack.ItemByName('Content').AsString]);
     Exit;
  end;
  GRetState := 'OK';
  ManSoy.Global.DebugInf('MS - 消息返回成功', []);
end;

destructor TDoClientRec.Destroy;
begin
  //FreeMem(pData, Len);
  FreeAndNil(MsgPack);
  inherited;
end;

procedure TDoClientRec.Execute;
var
  vCmdType: TCommType;
begin
  //Cmd  Ret Content
  vCmdType := TCommType(MsgPack.ItemByName('Cmd').AsInteger);
  try
    try
      case vCmdType of
        ctNone     : ;
        ctResult   : DealResultMsg;
        ctGroupName: ;
        ctSendMsg  : DealSendMsg;
        ctRecvMsg  : ;
      end;
    except
    end;
  finally
    SetEvent(GSmsEvent);
  end;
end;

end.
