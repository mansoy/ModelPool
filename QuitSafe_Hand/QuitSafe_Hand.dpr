program QuitSafe_Hand;

uses
  Vcl.Forms,
  uMain in 'uMain.pas' {frmMain},
  uData in 'uData.pas',
  uFrmCaptcha in 'uFrmCaptcha.pas' {FrmCaptcha},
  uFun in 'uFun.pas',
  uQQLogin in 'uQQLogin.pas' {frmQQLogin},
  uDispatchThread in 'uDispatchThread.pas',
  HPSocketSDKUnit in '..\Comm\HPSocketSDKUnit.pas',
  uPublic in '..\Comm\uPublic.pas',
  SuperObject in '..\Comm\SuperObject.pas',
  Dm_TLB in '..\Comm\Dm_TLB.pas',
  DmUtils in '..\Comm\DmUtils.pas',
  ManSoy.Base64 in '..\Global\ManSoy.Base64.pas',
  ManSoy.Global in '..\Global\ManSoy.Global.pas',
  ManSoy.MsgBox in '..\Global\ManSoy.MsgBox.pas',
  ManSoy.StrSub in '..\Global\ManSoy.StrSub.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TfrmMain, frmMain);
  Application.Run;
end.
