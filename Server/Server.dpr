program Server;

uses
  Vcl.Forms,
  HPSocketSDKUnit in '..\Comm\HPSocketSDKUnit.pas',
  uFrmMain in 'uFrmMain.pas' {FrmMain},
  uPublic in '..\Comm\uPublic.pas',
  uDataProcess in 'uDataProcess.pas',
  uServerPublic in 'uServerPublic.pas',
  uFrmConfig in 'uFrmConfig.pas' {FrmConfig};

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TFrmMain, FrmMain);
  Application.CreateForm(TFrmConfig, FrmConfig);
  Application.Run;
end.
