unit uQQLogin;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.OleCtrls, SHDocVw,
  MSHTML, Vcl.StdCtrls, Vcl.ExtCtrls,
  ManSoy.StrSub,
  ActiveX,
  ManSoy.Global;

const
  WM_LOGIN_QQ = WM_USER + 1009;
  //win7系统下 IE缓存路径
  //imgPath = 'C:\Users\Administrator\AppData\Local\Microsoft\Windows\Temporary Internet Files\getimage[1].jpg';

  WM_INPUT_ACC    = WM_USER + 1001;
  WM_SUBMIT       = WM_USER + 1002;
  WM_CHECK_VC     = WM_USER + 1003;
  WM_INPUT_VC     = WM_USER + 1004;
  WM_PLOGIN       = WM_USER + 1005;
  WM_LOGIN_RESULT = WM_USER + 1006;

type
  TfrmQQLogin = class(TForm)
    wb: TWebBrowser;
    btnOK: TButton;
    Timer1: TTimer;
    Button1: TButton;
    procedure wbProgressChange(ASender: TObject; Progress,
      ProgressMax: Integer);
    procedure wbNewWindow2(ASender: TObject; var ppDisp: IDispatch;
      var Cancel: WordBool);
    procedure wbNavigateComplete2(ASender: TObject; const pDisp: IDispatch;
      const URL: OleVariant);
    procedure btnOKClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure Timer1Timer(Sender: TObject);
    procedure Button1Click(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
  private
    { Private declarations }
    dwTid: dword;
    //html: string;
    function FillForm(FieldName: string; Value: string): Boolean;
    function SetValue(wb: TWebBrowser; id: string; value: string): Boolean;
  public
    { Public declarations }
    u         : string;  //账号
    p         : string;  //密码
    verifycode: string;  //验证码
    url       : string;  //登录页面
    cookies: string;  //返回cookies
    isOpen: boolean;
    isDocumentOk: boolean;
    isLogin: boolean;
    procedure OpenQQLoginPage();
    procedure InputAccountPwd();
    procedure PostLoginPage();
    procedure WMLOGINQQ(var Msg: TMessage); message WM_LOGIN_QQ;


    procedure WmInputAccountPwd(var Msg: TMessage); message WM_INPUT_ACC;
    procedure WmSubmit(var Msg: TMessage); message WM_SUBMIT;
    //procedure WmCheckVC(var Msg: TMessage); message WM_CHECK_VC;
    //procedure WmInputVC(var Msg: TMessage); message WM_INPUT_VC;
    procedure WmPLogin(var Msg: TMessage); message WM_PLOGIN;
    procedure WmLoginResult(var Msg: TMessage); message WM_LOGIN_RESULT;

  end;

var
  GMainForm: HWND;
  frmQQLogin: TfrmQQLogin;
  CheckCode: string;
  OldProgress: Integer;

  bNav: boolean;

implementation


{$R *.dfm}

procedure WorkThread(P: Pointer); stdcall;
var
  f: TfrmQQLogin;
  sRet: string;
  i: Integer;
  tickcount: dword;
begin
  f := TfrmQQLogin(P);
  if f = nil then Exit;
  try
    while true do
    try
      f.isLogin := false;
      //使用账号密码登录
      SendMessage(f.Handle, WM_PLOGIN,  0, 0);
      sleep(2000);
      //输入账号密码
      SendMessage(f.Handle, WM_INPUT_ACC,  0, 0);

      Exit;
//      SendMessage(f.Handle, WM_LOGIN_RESULT, 0, 0);


//      if f.isDocumentOk then
//      begin
//        sleep(2000);
//        sRet := (f.wb.document as IHtmlDocument2).body.innerHTML;
//        //判断登录页面是否完全打开
//        if Pos('安全登录，防止被盗', sRet) <= 0 then continue;
//
//        //判断登录页面是否需要验证码
//        if FileExists(imgPath) then
//        begin
//          ManSoy.Global.DebugInf('MS - 检测到登录需要验证码', []);
//          //CopyFile(imgPath, ExtractFilePath(ParamStr(0))+'Tmp.bmp',False);
//          //打开验证码输入窗口
//          for I := 0 to 2 do
//          begin
//            CheckCode := '';
//            CheckCode := OpenCheckCode(imgPath);
//            if Length(CheckCode) <> 4 then
//            begin
//              //'验证码位数错误,重试
//              Continue;
//            end;
//            ManSoy.Global.DebugInf('MS - 输入验证码 %s', [CheckCode]);
//            f.FillForm(f.wb, 'verifycode', CheckCode);
//            sleep(1000);
//            break;
//          end;
//        end;
//
//        //提交登录页面
//        SendMessage(f.handle, WM_LOGIN_QQ, 0, 0);
//        break;
//      end;
    except
    end;
  finally
  end;
end;

procedure TfrmQQLogin.btnOKClick(Sender: TObject);
begin
  PostLoginPage;
  //self.ModalResult := mrOk;
  wb.OleObject.document.GetElementByID('login_button').click;
end;

procedure TfrmQQLogin.FormCreate(Sender: TObject);
begin
  //cookies := '';
  isLogin := false;
  //isDocumentOk := false;
  //OpenQQLoginPage();
end;

procedure TfrmQQLogin.FormDestroy(Sender: TObject);
begin
  timer1.Enabled := false;
end;

procedure TfrmQQLogin.OpenQQLoginPage;
begin
  bNav := true;
  wb.Navigate(url);
end;

//登录页面输入账号密码
procedure TfrmQQLogin.InputAccountPwd;
begin
  FillForm('u', u);
  FillForm('p', p);

//  SetValue(wb, 'u', u);
//  SetValue(wb, 'p', p);
end;

//提交登录页面
procedure TfrmQQLogin.PostLoginPage;
var
  o: olevariant;
  doc: IHTMLDocument2;
begin
  ManSoy.Global.DebugInf('MS - 提交登录页面', []);
  doc := wb.Document as IHtmlDocument2;
  o := doc.all.item('login_button', 0);
  Sleep(1000);
  o.click;
end;

procedure TfrmQQLogin.Timer1Timer(Sender: TObject);
var
  sRet: string;
begin
  try
    if wb.busy then Exit;
//    sRet := wb.OleObject.document.body.innerHTML; //body内的所有代码
//    sRet := wb.OleObject.document.body.outerHTML; //body内的所有代码, 包含body标签
    sRet := wb.OleObject.document.documentElement.innerHTML; //html内的所有代码
    if Pos('腾讯游戏安全中心', sRet) > 0 then
    begin
      islogin := true;
      cookies := (wb.Document as IHTMLDocument2).cookie + ' ;';
//      if Pos('confirmuin', cookies) > 0 then
//        ReplaceStr('confirmuin',';' , 'confirmuin=' + u + ';' , cookies)
//      else
//        cookies := cookies + 'confirmuin='+u+' ;';
      ModalResult := mrOk;
      Exit;
    end;

  except
  end;
end;

procedure TfrmQQLogin.Button1Click(Sender: TObject);
begin
  InputAccountPwd;
end;

//导航完成
procedure TfrmQQLogin.wbNavigateComplete2(ASender: TObject;
  const pDisp: IDispatch; const URL: OleVariant);
begin
  //禁止提示脚步错误
  wb.Silent := True;

end;

procedure TfrmQQLogin.wbNewWindow2(ASender: TObject; var ppDisp: IDispatch;
  var Cancel: WordBool);
begin
  //禁止弹窗
  Cancel := True;
end;

procedure TfrmQQLogin.wbProgressChange(ASender: TObject; Progress,
  ProgressMax: Integer);
var
  sRet:string;
begin
  if (Progress = 0) and
     (ProgressMax = 0) and
     (OldProgress = -1) then
  begin
    //登录页面所有文档包括js都下载完成...
    if bNav = true then
    begin
      bNav := false;

      cookies := (wb.Document as IHTMLDocument2).cookie + ' ;';
      if Pos('pt2gguin', cookies) > 0 then
        ReplaceStr('pt2gguin',';' , 'pt2gguin=o' + u + ';' , cookies)
      else
        cookies := cookies + 'pt2gguin=o'+u+' ;';

      if Pos('ptui_loginuin', cookies) > 0 then
        ReplaceStr('ptui_loginuin',';' , 'ptui_loginuin=' + u + ';' , cookies)
      else
        cookies := cookies + 'ptui_loginuin='+u+' ;';

      (wb.Document as IHTMLDocument2).cookie := cookies;
      wb.Refresh;

      //sRet := wb.OleObject.document.body.innerHTML; //body内的所有代码
      //sRet := wb.OleObject.document.body.outerHTML; //body内的所有代码, 包含body标签
      //sRet := wb.OleObject.document.documentElement.innerHTML; //html内的所有代码

      if dwTid <= 0 then
        CreateThread(nil, 0, @WorkThread, frmQQLogin, 0, dwTid);
    end;
    Caption := '';
  end;
  OldProgress := Progress;
end;

procedure TfrmQQLogin.WMLOGINQQ(var Msg: TMessage);
begin
  PostLoginPage;
end;

function TfrmQQLogin.SetValue(wb: TWebBrowser; id, value: string): Boolean;
var
  doc: IHTMLDocument2;
  inputText : IHTMLInputTextElement;
begin
  result := false;
  while wb.ReadyState<>READYSTATE_COMPLETE do
  begin
    Sleep(1);
    Application.ProcessMessages;
  end;
  try
    doc := wb.Document as IHTMLDocument2;
    if nil <> doc then
    begin
      //如果id不是IHTMLInputTextElement类型将出错
      inputText := doc.all.item(id, 0) as IHTMLInputTextElement;
      inputText.value := value;
    end;
    result := true;
  except
  end;
end;

function TfrmQQLogin.FillForm(FieldName, Value: string): Boolean;
var
  i, j: Integer;
  FormItem: Variant;
begin
  Result := False;
  //no form on document
  if wb.OleObject.Document.All.Tags('FORM').Length = 0 then
  begin
    Exit;
  end;
  //forms count on document
  for I := 0 to wb.OleObject.Document.forms.Length - 1 do
  begin
    FormItem := wb.OleObject.Document.forms.Item(I);
    for j := 0 to FormItem.Length - 1 do
    begin
      try
        //when the fieldname is found, try to fill out
        if FormItem.Item(j).Name = FieldName then
        begin
          FormItem.Item(j).Value := Value;
          Result := True;
        end;
      except
        Exit;
      end;
    end;
  end;
end;

procedure TfrmQQLogin.WmInputAccountPwd(var Msg: TMessage);
begin
  FillForm('u', u);
  FillForm('p', p);
end;

procedure TfrmQQLogin.WmPLogin(var Msg: TMessage);
begin
  //使用账号密码登录
  wb.OleObject.document.GetElementByID('switcher_plogin').click ;
end;

procedure TfrmQQLogin.WmLoginResult(var Msg: TMessage);
var
  tickcount: dword;
  sRet: string;
begin
  tickcount := gettickcount;
  while gettickcount - tickcount < 30 * 1000 do
  begin
    Sleep(3000);
    application.ProcessMessages;
    if wb.busy then continue;
    sRet := wb.OleObject.document.documentElement.innerHTML; //html内的所有代码
    if Pos('腾讯游戏安全中心', sRet) > 0 then
    begin
      islogin := true;
      cookies := (wb.Document as IHTMLDocument2).cookie + ' ;';
//      if Pos('confirmuin', cookies) > 0 then
//        ReplaceStr('confirmuin',';' , 'confirmuin=' + u + ';' , cookies)
//      else
//        cookies := cookies + 'confirmuin='+u+' ;';
      ModalResult := mrOk;
      Exit;
    end;
  end;
end;

procedure TfrmQQLogin.WmSubmit(var Msg: TMessage);
begin
  wb.OleObject.document.GetElementByID('login_button').click;
end;

end.
