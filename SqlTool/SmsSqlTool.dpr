program SmsSqlTool;

uses
  Vcl.Forms,
  uMain in 'uMain.pas' {Form1},
  uDm in 'uDm.pas' {dm: TDataModule},
  ManSoy.Base64 in '..\Global\ManSoy.Base64.pas',
  ManSoy.Global in '..\Global\ManSoy.Global.pas';

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TForm1, Form1);
  Application.CreateForm(Tdm, dm);
  Application.Run;
end.
