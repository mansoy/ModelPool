unit uFrmConfig;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.Samples.Spin, Vcl.StdCtrls, Vcl.ExtCtrls,
  Data.DB, Data.Win.ADODB, uServerPublic;

type
  TFrmConfig = class(TForm)
    GroupBox1: TGroupBox;
    Label1: TLabel;
    edtIpAddress: TEdit;
    Label2: TLabel;
    edtPort: TSpinEdit;
    GroupBox2: TGroupBox;
    edtDataBaseHost: TEdit;
    Label3: TLabel;
    Label4: TLabel;
    edtDataBaseName: TEdit;
    Label5: TLabel;
    edtAccount: TEdit;
    Label6: TLabel;
    edtPassWord: TEdit;
    RadioGroup1: TRadioGroup;
    btnSave: TButton;
    Button3: TButton;
    btnTestConn: TButton;
    procedure btnSaveClick(Sender: TObject);
    procedure btnTestConnClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  FrmConfig: TFrmConfig;

implementation

{$R *.dfm}

procedure TFrmConfig.btnSaveClick(Sender: TObject);
begin
  if Trim(edtIpAddress.Text) = '' then begin
    MessageBox(Self.Handle, '服务IP不能为空！', '警告', MB_ICONWARNING);
    Exit;
  end;

  if edtPort.Value = 0 then begin
    MessageBox(Self.Handle, '服务端口不能为0！', '警告', MB_ICONWARNING);
    Exit;
  end;

  if Trim(edtDataBaseHost.Text) = '' then begin
    MessageBox(Self.Handle, '数据库IP不能为空！', '警告', MB_ICONWARNING);
    Exit;
  end;

  if Trim(edtDataBaseName.Text) = '' then begin
    MessageBox(Self.Handle, '数据库名称不能为空！', '警告', MB_ICONWARNING);
    Exit;
  end;

  if Trim(edtAccount.Text) = '' then begin
    MessageBox(Self.Handle, '数据库账号不能为空！', '警告', MB_ICONWARNING);
    Exit;
  end;
  Self.ModalResult := mrOk;
end;

procedure TFrmConfig.btnTestConnClick(Sender: TObject);
begin
  TButton(Sender).Enabled := False;
  try
    if ConnDataBase then
      MessageBox(Self.Handle, '连接成功', '提示', MB_ICONINFORmATION)
    else
      MessageBox(Self.Handle, '连接失败', '警告', MB_ICONWARNING);
  finally
    TButton(Sender).Enabled := True;
  end;
end;

end.
