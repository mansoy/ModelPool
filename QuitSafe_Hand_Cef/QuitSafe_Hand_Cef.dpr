program QuitSafe_Hand_Cef;

uses
  Winapi.Windows,
  Vcl.Forms,
  uCEFApplication,
  uMain in 'uMain.pas' {frmMain},
  uData in 'uData.pas',
  uFun in 'uFun.pas',
  uTokenThread in 'uTokenThread.pas',
  HPSocketSDKUnit in '..\Comm\HPSocketSDKUnit.pas',
  SuperObject in '..\Comm\SuperObject.pas',
  Dm_TLB in '..\Comm\Dm_TLB.pas',
  DmUtils in '..\Comm\DmUtils.pas',
  ManSoy.Base64 in '..\Global\ManSoy.Base64.pas',
  ManSoy.Global in '..\Global\ManSoy.Global.pas',
  ManSoy.MsgBox in '..\Global\ManSoy.MsgBox.pas',
  ManSoy.StrSub in '..\Global\ManSoy.StrSub.pas',
  uSmsThread in 'uSmsThread.pas',
  uFrmLogin in 'uFrmLogin.pas' {FrmLogin},
  ManSoy.Encode in '..\Global\ManSoy.Encode.pas',
  uPublic in '..\Comm\uPublic.pas';

{$R *.res}

begin
  GlobalCEFApp := TCefApplication.Create;

  GlobalCEFApp.FrameworkDirPath     := 'cef';
  GlobalCEFApp.ResourcesDirPath     := 'cef';
  GlobalCEFApp.LocalesDirPath       := 'cef\locales';
  GlobalCEFApp.cache                := 'cef\cache';
  GlobalCEFApp.cookies              := 'cef\cookies';
  GlobalCEFApp.UserDataPath         := 'cef\User Data';

  // You *MUST* call GlobalCEFApp.StartMainProcess in a if..then clause
  // with the Application initialization inside the begin..end.
  // Read this https://www.briskbard.com/index.php?lang=en&pageid=cef
  if GlobalCEFApp.StartMainProcess then
    begin
      Application.Initialize;
      Application.MainFormOnTaskbar := True;
      Application.CreateForm(TfrmMain, frmMain);
  Application.Run;
    end;

  GlobalCEFApp.Free;
end.
