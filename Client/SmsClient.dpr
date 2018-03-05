program SmsClient;

uses
  Vcl.Forms,
  uFrmMain in 'uFrmMain.pas' {FrmMain},
  uSms in 'uSms.pas',
  SPComm in '..\Comm\SPComm.pas',
  uPduProtocol in '..\Comm\uPduProtocol.pas',
  uSimpleCom in '..\Comm\uSimpleCom.pas',
  uData in 'uData.pas',
  HPSocketSDKUnit in '..\Comm\HPSocketSDKUnit.pas',
  uPublic in '..\Comm\uPublic.pas',
  uFrmConfig in 'uFrmConfig.pas' {frmConfig},
  ufrmTest in 'ufrmTest.pas' {frmTest};

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TFrmMain, FrmMain);
  Application.Run;
end.
