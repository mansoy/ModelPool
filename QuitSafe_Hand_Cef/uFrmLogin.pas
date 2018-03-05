unit uFrmLogin;



{$I cef.inc}

interface

uses
  {$IFDEF DELPHI16_UP}
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls,
  {$ELSE}
  Windows, Messages, SysUtils, Variants, Classes, Graphics,
  Controls, Forms, Dialogs, StdCtrls, ExtCtrls,
  {$ENDIF}
  uCEFChromium, uCEFTypes, uCEFInterfaces, uCEFWindowParent;

const
  CEF_AFTERCREATED = WM_USER + 10001;
  WM_DO_EXECUTE = WM_USER + 10002;
type
  TDoStep = (dsLogin, dsQuitSafe, dsSubmit);

  TFrmLogin = class(TForm)
    CEFWindowParent1: TCEFWindowParent;
    Panel1: TPanel;
    btnReLoad: TButton;
    Chromium1: TChromium;
    Timer1: TTimer;
    GetDynCode: TButton;
    btnSendSms: TButton;
    btnLogin: TButton;
    Button2: TButton;
    procedure FormShow(Sender: TObject);
    procedure Chromium1AfterCreated(Sender: TObject; const browser: ICefBrowser);
    procedure Chromium1LoadEnd(Sender: TObject; const browser: ICefBrowser; const frame: ICefFrame;
      httpStatusCode: Integer);
    procedure Timer1Timer(Sender: TObject);
    procedure Chromium1TextResultAvailable(Sender: TObject; const aText: string);
    procedure FormCreate(Sender: TObject);
    procedure btnReLoadClick(Sender: TObject);
    procedure btnSendSmsClick(Sender: TObject);
    procedure GetDynCodeClick(Sender: TObject);
    procedure btnLoginClick(Sender: TObject);
  private
    FHtml: string;
    FDoStep: TDoStep;
    FQQAcc: string;
    FQQPwd: string;
    FQQSafeWay: Integer;
    procedure DoLogin;
    // You have to handle this two messages to call NotifyMoveOrResizeStarted or some page elements will be misaligned.
    procedure WMMove(var aMessage : TWMMove); message WM_MOVE;
    procedure WMMoving(var aMessage : TMessage); message WM_MOVING;
    procedure BrowserCreatedMsg(var aMessage : TMessage); message CEF_AFTERCREATED;
    procedure WmDoExecute(var aMessage: TMessage); message WM_DO_EXECUTE;
  public
    { Public declarations }
    property QQAcc: string read FQQAcc write FQQAcc;
    property QQPwd: string read FQQPwd write FQQPwd;
    property QQSafeWay: Integer read FQQSafeWay write FQQSafeWay;
  end;

var
  FrmLogin: TFrmLogin;

const
  CON_LOGIN_URL =
    'http://xui.ptlogin2.qq.com/cgi-bin/xlogin?proxy_url=http://game.qq.com/comm' +
    '-htdocs/milo/proxy.html&appid=21000127&f_url=loginerroralert&s_url=http%3A/' +
    '/gamesafe.qq.com/safe_mode_remove.shtml%3Fgame_id%3D5&no_verifyimg=1&qlogin' +
    '_jumpname=jump&daid=8&';

implementation

uses uSmsThread, uTokenThread;

{$R *.dfm}

procedure TFrmLogin.FormCreate(Sender: TObject);
begin
  FDoStep := dsLogin;
end;

procedure TFrmLogin.FormShow(Sender: TObject);
begin
  Chromium1.CreateBrowser(CEFWindowParent1, '');
  btnSendSms.Enabled := QQSafeWay = 60;
  GetDynCode.Enabled := QQSafeWay <> 60;
end;

procedure TFrmLogin.GetDynCodeClick(Sender: TObject);
begin
  FDoStep := dsSubmit;
  TTokenThread.Create(QQAcc, QQSafeWay);
end;

procedure TFrmLogin.Timer1Timer(Sender: TObject);
var
  IsNeed: Boolean;
begin
  IsNeed := True;
  Timer1.Enabled := False;
  try
    Chromium1.RetrieveHTML;
    if (FDoStep = dsLogin) then
    begin
      if Pos('安全模式-腾讯游戏安全中心-腾讯游戏', FHtml) > 0 then
      begin
        IsNeed := False;
        FDoStep := dsQuitSafe;
      end;
    end;
    if (FDoStep = dsSubmit ) then
    begin
      if Pos('高级密保校验成功', FHtml) > 0 then
      begin
        IsNeed := False;
        Self.ModalResult := mrOk;
      end;
    end;

    if FDoStep = dsQuitSafe then
    begin
      IsNeed := False;
    end;
    Self.Caption := FormatDateTime('yyyy-MM-dd hh:mm:ss', Now);
  finally
    if IsNeed then
      Timer1.Enabled := True;
  end;
end;

procedure TFrmLogin.BrowserCreatedMsg(var aMessage: TMessage);
begin
  CEFWindowParent1.UpdateSize;
  btnReLoad.Click;
end;

procedure TFrmLogin.btnReLoadClick(Sender: TObject);
begin
  FDoStep := dsLogin;
  Chromium1.DeleteCookies;
  Chromium1.LoadURL(CON_LOGIN_URL);
end;

procedure TFrmLogin.btnSendSmsClick(Sender: TObject);
begin
  FDoStep := dsSubmit;
  TSmsThread.Create(QQAcc);
end;

procedure TFrmLogin.btnLoginClick(Sender: TObject);
begin
  DoLogin;
  Sleep(200);
  DoLogin;
end;

procedure TFrmLogin.Chromium1AfterCreated(Sender: TObject; const browser: ICefBrowser);
begin
  PostMessage(Handle, CEF_AFTERCREATED, 0, 0);
end;

procedure TFrmLogin.Chromium1LoadEnd(Sender: TObject; const browser: ICefBrowser; const frame: ICefFrame;
  httpStatusCode: Integer);
begin
  //---
  Chromium1.RetrieveHTML;
end;

procedure TFrmLogin.Chromium1TextResultAvailable(Sender: TObject; const aText: string);
begin
  //if (FDoStep = dsLogin) or (FDoStep = dsSubmit) then
  SendMessage(Handle, WM_DO_EXECUTE, 0, LPARAM(aText));
end;

procedure TFrmLogin.DoLogin;
begin
  try
    Chromium1.browser.MainFrame.ExecuteJavaScript(Format('document.forms[0].u.value="%s";', [QQAcc]), 'about:blank',0);
    Chromium1.browser.MainFrame.ExecuteJavaScript(Format('document.forms[0].p.value="%s";', [QQPwd]), 'about:blank',0);
    Chromium1.browser.MainFrame.ExecuteJavaScript('document.forms[0].login_button.click();', 'about:blank',0);
  except

  end;
end;

procedure TFrmLogin.WmDoExecute(var aMessage: TMessage);
begin
  FHtml := string(aMessage.Lparam);
  Timer1.Enabled := True;
end;

procedure TFrmLogin.WMMove(var aMessage : TWMMove);
begin
  inherited;
  if (Chromium1 <> nil) then Chromium1.NotifyMoveOrResizeStarted;
end;

procedure TFrmLogin.WMMoving(var aMessage : TMessage);
begin
  inherited;
  if (Chromium1 <> nil) then Chromium1.NotifyMoveOrResizeStarted;
end;

end.
