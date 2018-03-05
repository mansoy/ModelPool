unit uMain;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls,
  superobject,
  IdHTTP, Vcl.Menus,
  System.IniFiles,
  uData
  ,uDispatchThread,
  Winapi.TlHelp32;

type
  TfrmMain = class(TForm)
    edtAccount: TEdit;
    Label1: TLabel;
    Panel1: TPanel;
    Timer1: TTimer;
    TrayIcon1: TTrayIcon;
    pm: TPopupMenu;
    miMax: TMenuItem;
    miMin: TMenuItem;
    miExit: TMenuItem;
    N4: TMenuItem;
    N5: TMenuItem;
    N1: TMenuItem;
    miInject: TMenuItem;
    procedure edtAccountKeyPress(Sender: TObject; var Key: Char);
    procedure Timer1Timer(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure FormCloseQuery(Sender: TObject; var CanClose: Boolean);
    procedure miMaxClick(Sender: TObject);
    procedure miMinClick(Sender: TObject);
    procedure miExitClick(Sender: TObject);
    procedure TrayIcon1Click(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure miInjectClick(Sender: TObject);
  private
    { Private declarations }
    function GetOrderInfo(AAccount: string): string;
    function QuitSafe(AAccount: string; APassword: string; ASafeWay: Integer): Boolean;

    function OpenExe(AAppName: string): Boolean;
    function Inject(): Boolean;
  public
    { Public declarations }
    procedure WndProc(var Message: TMessage); override;
    procedure WmSendRet(var Msg: TMessage); message WM_SEND_RET;
  end;

  //function QQSafe(AGameID: Integer; AAccount: PAnsiChar; APassWord: PAnsiChar; AArea: PAnsiChar; AServer: PAnsiChar; AMBType: Integer; AKey: PAnsiChar): PAnsiChar; stdcall; external 'QuitSafe.dll';


var
  frmMain: TfrmMain;
  RetFlag: Integer;
  RetStr : string;
  DispalyCount: Integer;

implementation

uses  ManSoy.Base64, ManSoy.Global,ManSoy.MsgBox;
{$R *.dfm}

/// <summary>
/// AMBType: 40-KM(new)  50-KM(old) 60-SMS other(9891 KJava)
/// </summary>
function QQSafe(AGameID  : Integer;   //游戏ID  0-地下城与勇士 1-御龙在天 2-剑灵 3-斗战神
                AAccount : PAnsiChar; //游戏账号
                APassWord: PAnsiChar; //游戏密码
                AArea    : PAnsiChar; //游戏-区
                AServer  : PAnsiChar; //游戏-服
                AMBType  : Integer;   //密保类型
                AKey     : PAnsiChar  //OA校验Key (AMBType为9891数字令牌时，需要传入此参数)
                ): PAnsiChar;
var
  iBind: Integer;
  sAccount,sPassword,sArea,sServer,sKey: string;
  sRet: string;
begin
(*
  Result := '';
  sAccount := string(AnsiString(AAccount));
  sPassword := ManSoy.Base64.Base64ToStr(AnsiString(APassWord));
  sArea := '';
  if AArea <> '' then
    sArea := string(AnsiString(AArea));
  sServer := '';
  if sServer <> '' then
    sServer := string(AnsiString(AServer));
  sKey := '';
  if AKey <> '' then
    sKey := string(AnsiString(AKey));

  with TWorkThread.Create(AGameID,
                          sAccount,
                          sPassword,
                          sArea,
                          sServer,
                          AMBType,
                          sKey) do
  try
    if not OpenLoginPage then  //获取login_sig
    begin
      sRet := Format('[%s]-[%d]打开安全登录页面失败!', [sAccount, AMBType]);
      Result := PAnsiChar(AnsiString(sRet));
      Exit;
    end;
    if not CheckVC() then
    begin
      sRet := Format('[%s]-[%d]检测账号是否需要验证码失败!', [sAccount, AMBType]);
      Result := PAnsiChar(AnsiString(sRet));
      Exit;
    end;
    if not GetCheckCode() then
    begin
      sRet := Format('[%s]-[%d]获取验证码失败!', [sAccount, AMBType]);
      Result := PAnsiChar(AnsiString(sRet));
      Exit;
    end;
    if not LoginQQ() then
    begin
      sRet := Format('[%s]-[%d]登录失败!', [sAccount, AMBType]);
      Result := PAnsiChar(AnsiString(sRet));
      Exit;
    end;
    //--获取QQ绑定方式
    iBind := GetBindType;
    if (iBind <> 20000) and (iBind <> 10000) then
    begin
      sRet := Format('[%s]-[%d]没有绑定手机令牌或手机短信!', [sAccount, AMBType]);
      Result := PAnsiChar(AnsiString(sRet));
      Exit;
    end;
    //--获取手机令牌Token
    if (iBind = 10000) then
    begin
      if StrToIntDef(GetToken(AMBType), -1) = -1 then
      begin
        sRet := Format('[%s]-[%d]获取手机令牌错误!', [sAccount, AMBType]);
        Result := PAnsiChar(AnsiString(sRet));
        Exit;
      end;
    end;

    //Post解安全
    if AMBType = 60 then
    begin
      //短信解安全
      sRet := QuitsafeBySms();
    end else
    begin
      //令牌解安全
      sRet := QuitSafeByToken(TokenPackData.szDnyPsw);
    end;
    Result := PAnsiChar(AnsiString(sRet));
  finally
    Free;
  end;
  *)
end;

procedure TfrmMain.edtAccountKeyPress(Sender: TObject; var Key: Char);
var
  jo: ISuperObject;
  ja: TSuperArray;
  orderStr, account, pwd: string;
  safeWay: Integer;
begin
  if Key = #13 then
  begin
    Panel1.Color := clBtnFace;
    Panel1.Caption := '';
    RetFlag := -1;
    RetStr := '';
    DispalyCount := 0;


    account := Trim(edtAccount.Text);
    //

    orderStr := GetOrderInfo(account);
    if orderStr = '[]' then
    begin
      RetStr := '获取账号密码失败！';
      RetFlag := 0;
      Timer1.Enabled := True;
      Exit;
    end;
    jo := SO(OrderStr);
    ja := jo.AsArray;

    pwd := ja[0].S['gamePasswd'];
    pwd := ManSoy.Base64.Base64ToStr(AnsiString(pwd));
    safeWay := ja[0].I['safetyWay'];

//    account := '251782629';
//    pwd := 'colin1983,./';
//    safeWay := 60;
    TDispatchThread.Create(0,account,pwd,'','',safeWay,'');
  end;
end;

procedure TfrmMain.WmSendRet(var Msg: TMessage);
var
  b: Boolean;
begin
  RetStr := string(Msg.LParam);

  b := Pos('OK', RetStr) > 0;
  if not b then
  begin
    RetFlag := 0;
    Timer1.Enabled := True;
    Exit;
  end;
  if b then
  begin
    RetStr := '解安全成功！';
    Timer1.Enabled := True;
    RetFlag := 1;
  end;
end;

procedure TfrmMain.FormCloseQuery(Sender: TObject; var CanClose: Boolean);
begin
  if MessageBox(Self.Handle, '您确定要关闭解安全程序吗？'+#13#10+'关闭之后下次要打开必须在DNF游戏启动之前，不然打不开哦！',
    '询问', MB_ICONQUESTION+MB_YESNO) = IDYES then
    CanClose := True
  else
    CanClose := False;
end;

function TfrmMain.Inject: Boolean;
var
  dwDealyTimes, dwPid: DWORD;
  hTmp: HWND;
  tp: TProcessEntry32;
begin
  Result := False;
  //将 resume.dll 注入到桌面进程 explorer.exe
  //远线程注入
  dwDealyTimes := GetTickCount;
  while GetTickCount - dwDealyTimes < 15000 do
  begin
    sleep(100);
    dwPid := 0;
    hTmp := CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    tp.dwSize := SizeOf(TProcessEntry32);
    if Process32First(hTmp, tp) then
    begin
      repeat
        if lstrcmp(tp.szExeFile, 'explorer.exe') = 0 then
        begin
          dwPid := tp.th32ProcessID;
        end;
      until not Process32Next(hTmp, tp);
    end;
    if dwPid = 0 then Continue;

    if ManSoy.Global.InjectDll(ExtractFilePath(paramStr(0))+'resume.dll', dwPid) then
    begin
      Self.Caption := Self.Caption + '    注入成功！';
      Result := True;
      Break;
    end;
  end;

  if not Result then
  begin
    Self.Caption := Self.Caption + '    注入失败，请重新打开程序注入！';
  end;
end;

procedure TfrmMain.FormCreate(Sender: TObject);
begin
  Panel1.Color := clBtnFace;
  Panel1.Font.Color := clWindowText;

  //Application.ShowMainForm := False;
  GMainHandle := Self.Handle;

  //注入
  //Inject();
end;

procedure TfrmMain.FormDestroy(Sender: TObject);
begin
   Timer1.Enabled := False;
end;

function TfrmMain.GetOrderInfo(AAccount: string): string;
  function GetUrl(): string;
  begin
    with TIniFile.Create(ExtractFilePath(ParamStr(0))+'QuitSafeConfig\Cfg.ini') do
    try
      Result := ReadString('OrderInfo', 'url', 'http://192.168.192.179:8088/apiImitatorController.do?method=getAccountInfo&account=%s');
      Result := Format(Result, [AAccount])
    finally
      Free;
    end;
  end;
var
  http: TIdHTTP;
  vResponseContent: TStringStream;
  url: string;
begin
  Result := '';
  vResponseContent := TStringStream.Create('', TEncoding.UTF8);
  http := TIdHTTP.Create(nil);
  try
    try
      url := GetUrl();//'http://192.168.192.179:8088/apiImitatorController.do?method=getAccountInfo&account='+AAccount;
      http.Get(url, vResponseContent);
      Result := vResponseContent.DataString;
      //Result := '{"account":"1329663158","gamePasswd":"S2NHQXIzODAyNA==","safetyWay":50}';
      //Result := '[{"account":"1005703743","gamePasswd":"emh1YW5xaWFuODgxOA==","safetyWay":30}]';
    except
    end;
  finally
    FreeAndNil(vResponseContent);
    http.Disconnect;
    FreeAndNil(http);
  end;
end;

procedure TfrmMain.miExitClick(Sender: TObject);
begin
  Close;
end;

procedure TfrmMain.miInjectClick(Sender: TObject);
begin
  //打开64位程序 Inject.exe 完成桌面注入resume.dll的动作
  OpenExe('Inject.exe');
end;

procedure TfrmMain.miMaxClick(Sender: TObject);
begin
  Self.Visible := True;
  ShowWindow(Self.Handle, SW_RESTORE);
end;

procedure TfrmMain.miMinClick(Sender: TObject);
begin
  Self.Visible := False;
end;

function TfrmMain.QuitSafe(AAccount, APassword: string;
  ASafeWay: Integer): Boolean;
begin
  Result := False;
  try
    RetStr := QQSafe(0, PAnsiChar(AnsiString(AAccount)), PAnsiChar(AnsiString(APassword)), '', '', ASafeWay, '');
    Result :=  Pos('OK', RetStr) > 0;
  except
  end;
end;

procedure TfrmMain.Timer1Timer(Sender: TObject);
  function IsStopFlicker(): Boolean;
  begin
    Result := False;
    if DispalyCount > 2 then
    begin
      DispalyCount := 0;
      Timer1.Enabled := False;
      Result := True;
      Exit;
    end;
    Inc(DispalyCount);
  end;
begin
  Panel1.Caption := RetStr;
  if Timer1.Tag = 0 then
  begin
    if RetFlag = 0 then
    begin
      Panel1.Color := clRed;
      if IsStopFlicker() then Exit;
    end else
    begin
      Panel1.Color := clGreen;
      if IsStopFlicker() then Exit;
    end;
    Timer1.Tag := 1;
  end else
  begin
    Panel1.Color := clBtnFace;
    Timer1.Tag := 0;
  end;
end;

procedure TfrmMain.TrayIcon1Click(Sender: TObject);
begin
   miMax.Click;
end;


procedure TfrmMain.WndProc(var Message: TMessage);
begin
  if Message.Msg = WM_SYSCOMMAND then
  begin
    if Message.WParamLo = SC_MINIMIZE then
      Self.Visible := False;
  end;
  inherited WndProc(Message);
end;

function TfrmMain.OpenExe(AAppName: string): Boolean;
var
  startupInfo: TStartupInfo;
  processInfo: TProcessInformation;
begin
  Result := False;
  try
    FillChar(processInfo,sizeof(TProcessInformation),0);
    FillChar(startupInfo,Sizeof(TStartupInfo),0);
    StartupInfo.cb:=Sizeof(TStartupInfo);
    StartupInfo.dwFlags:=STARTF_USESHOWWINDOW;
    StartupInfo.wShowWindow:=SW_SHOW;

    Result := CreateProcess(PWideChar(AAppName),nil,nil,nil,False,NORMAL_PRIORITY_CLASS, nil,nil,StartupInfo,ProcessInfo);
    CloseHandle(ProcessInfo.hThread);
    CloseHandle(ProcessInfo.hProcess);
  except
  end;
end;

end.
