unit uFrmConfig;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.Samples.Spin, qjson, Vcl.ExtCtrls;

type
  TfrmConfig = class(TForm)
    Label7: TLabel;
    edtServerIP: TEdit;
    Label8: TLabel;
    Label9: TLabel;
    edtGroupName: TEdit;
    btnSave: TButton;
    btnClose: TButton;
    edtServerPort: TSpinEdit;
    chkSync: TCheckBox;
    Bevel1: TBevel;
    Bevel2: TBevel;
    cmbBaudRate: TComboBox;
    Label1: TLabel;
    procedure btnSaveClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
    procedure Data2UI;
  end;

  function fnOpenCfg: Boolean;

//var
  //frmConfig: TfrmConfig;


implementation

uses uData;

{$R *.dfm}

function fnOpenCfg: Boolean;
var
  f: TfrmConfig;
begin
  f := TfrmConfig.Create(nil);
  try
    f.Data2UI;
    Result := f.ShowModal = mrOk;
  finally
    FreeAndNil(f);
  end;
end;

function fnInitCfg: Boolean;
var
  sCfg: string;
  vJson: TQJson;
begin
  Result := False;
  sCfg := ExtractFilePath(ParamStr(0)) + 'Config\Cfg.Json';
  if not FileExists(sCfg) then Exit;
  vJson := TQJson.Create;
  try
    vJson.LoadFromFile(sCfg);
    vJson.ToRecord<TConfig>(GConfig);
    Result := True;
  finally
    FreeAndNil(vJson);
  end;
end;

procedure TfrmConfig.btnSaveClick(Sender: TObject);
var
  sCfg: string;
  vJson: TQJson;
begin
  vJson := TQJson.Create;
  try
    if Trim(edtServerIP.Text) = '' then
    begin
      Application.MessageBox('请填写服务地址！', '提示', MB_ICONWARNING);
      Exit;
    end;
    if edtServerPort.Value < 1024 then
    begin
      Application.MessageBox('请服务端口填写有误！', '提示', MB_ICONWARNING);
      Exit;
    end;
    if Trim(edtGroupName.Text) = '' then
    begin
      Application.MessageBox('请设置猫池组名称！', '提示', MB_ICONWARNING);
      Exit;
    end;

    if cmbBaudRate.ItemIndex = -1 then
    begin
      Application.MessageBox('请选择波特率！', '提示', MB_ICONWARNING);
      Exit;
    end;

    vJson.Clear;
    GConfig.Host := Trim(edtServerIP.Text);
    GConfig.Port := edtServerPort.Value;
    GConfig.GroupName := Trim(edtGroupName.Text);
    GConfig.SyncSocket := chkSync.Checked;
    GConfig.BaudRate := StrToIntDef(cmbBaudRate.Text, 9600);
    sCfg := ExtractFilePath(ParamStr(0)) + 'Config\Cfg.Json';

    vJson.FromRecord<TConfig>(GConfig);
    vJson.SaveToFile(sCfg);
    Self.ModalResult := mrOk;
  finally
    FreeAndNil(vJson);
  end;
end;

procedure TfrmConfig.Data2UI;
begin
  //
  edtServerIP.Text := GConfig.Host;
  edtServerPort.Value := GConfig.Port;
  edtGroupName.Text := GConfig.GroupName;
  chkSync.Checked := GConfig.SyncSocket;
  cmbBaudRate.ItemIndex := cmbBaudRate.Items.IndexOf(IntToStr(GConfig.BaudRate)) ;
end;

initialization
  fnInitCfg;

finalization

end.
