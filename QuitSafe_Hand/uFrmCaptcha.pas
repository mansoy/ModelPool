unit uFrmCaptcha;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.Imaging.jpeg, Vcl.ExtCtrls, Vcl.StdCtrls;

type
  TFrmCaptcha = class(TForm)
    edtCaptcha: TEdit;
    imgCaptcha: TImage;
    procedure edtCaptchaKeyPress(Sender: TObject; var Key: Char);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

//var
//  FrmCaptcha: TFrmCaptcha;

  function GetCaptcha(AOwner: TComponent): string;

implementation

{$R *.dfm}

function GetCaptcha(AOwner: TComponent): string;
var
  F: TFrmCaptcha;
begin
  Result := '';
  F := TFrmCaptcha.Create(AOwner);
  try
    if F.ShowModal = mrOk then
      Result := Trim(F.edtCaptcha.Text);
  finally
    FreeAndNil(F);
  end;
end;
procedure TFrmCaptcha.edtCaptchaKeyPress(Sender: TObject; var Key: Char);
begin
  if Key = #13 then begin
    if Trim(edtCaptcha.Text) = '' then Exit;
    Self.ModalResult := mrOk;
  end;
end;

procedure TFrmCaptcha.FormCreate(Sender: TObject);
begin
  imgCaptcha.Picture.LoadFromFile(ExtractFilePath(ParamStr(0)) + 'CheckCode.jpg');
end;

end.
