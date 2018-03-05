unit uMain;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls,
  superobject,
  IdHTTP, Vcl.Menus,
  System.IniFiles,
  uData,
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
    function OpenExe(AAppName: string): Boolean;
    function Inject(): Boolean;
    procedure DoExecute;
  public
    { Public declarations }
    procedure WndProc(var Message: TMessage); override;
    procedure WmSendRet(var Msg: TMessage); message WM_SEND_RET;
  end;

var
  frmMain: TfrmMain;
  RetFlag: Integer;
  RetStr : string;
  DispalyCount: Integer;

implementation

uses uFrmLogin, ManSoy.Base64, ManSoy.Global,ManSoy.MsgBox;
{$R *.dfm}

procedure TfrmMain.DoExecute;
var
  jo: ISuperObject;
  ja: TSuperArray;
  orderStr, account, pwd: string;
  safeWay, I: Integer;
  F: TFrmLogin;
begin
  try
    Panel1.Color := clBtnFace;
    Panel1.Caption := '';
    RetFlag := -1;
    RetStr := '';
    DispalyCount := 0;

    //-----------------------------------------

    account := Trim(edtAccount.Text);

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

    //for I := 0 to 2 do
    begin
      F := TFrmLogin.Create(nil);
      try
        F.QQAcc := account;
        F.QQPwd := pwd;
        F.QQSafeWay := safeWay;
        F.ShowModal();
      finally
        FreeAndNil(F);
      end;
    end;
  except

  end;
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
    Key := #0;
    DoExecute;
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
