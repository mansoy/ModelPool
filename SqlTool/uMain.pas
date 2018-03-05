unit uMain;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Data.DB, Data.Win.ADODB,
  System.StrUtils, Vcl.StdCtrls,
  uDm, Vcl.ExtCtrls;

type
  TForm1 = class(TForm)
    GroupBox1: TGroupBox;
    Label3: TLabel;
    Label4: TLabel;
    Label5: TLabel;
    Label6: TLabel;
    Label7: TLabel;
    edtComName: TEdit;
    edtGroupName: TEdit;
    edtPhoneNum: TEdit;
    edtQQ: TEdit;
    btnAdd: TButton;
    btnImport: TButton;
    Label9: TLabel;
    GroupBox3: TGroupBox;
    Label1: TLabel;
    Label2: TLabel;
    btnTest: TButton;
    edtIp: TEdit;
    edtPwd: TEdit;
    pnlHit: TPanel;
    cmbBusiness: TComboBox;
    Label10: TLabel;
    procedure btnImportClick(Sender: TObject);
    procedure btnTestClick(Sender: TObject);
    procedure btnAddClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);

  private
    { Private declarations }
    function OpenFile(): string;
    procedure PostData(AData: string);
    procedure ShowHint(AShow: Boolean = True);
    procedure SaveConfig;
    procedure LocaConfig;
    function GetDataBaseName(AIndex: Integer): string;
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

uses ManSoy.Base64, ManSoy.Global, System.IniFiles;

{$R *.dfm}

procedure TForm1.btnAddClick(Sender: TObject);
var
  sData: string;
begin
  ShowHint();
  try
    if edtGroupName.Text = '' then
    begin
      ShowMessage('设备组名不能为空！');
      edtGroupName.SetFocus;
      Exit;
    end;
    if edtComName.Text = '' then
    begin
      ShowMessage('串口名不能为空！');
      edtComName.SetFocus;
      Exit;
    end;
    if edtPhoneNum.Text = '' then
    begin
      ShowMessage('手机号不能为空！');
      edtPhoneNum.SetFocus;
      Exit;
    end;
    if edtQQ.Text = '' then
    begin
      ShowMessage('QQ号不能为空！');
      edtQQ.SetFocus;
      Exit;
    end;

    if Application.MessageBox(
      '友情提示: '#13' 之前同卡号下的数据将被清除,请谨慎操作！！！ '#13''#13' 确定操作按【是】，取消操作按【否】',
      '提示',
      MB_ICONQUESTION or MB_YESNO
    ) = IDNO then Exit;

    try
      sData := Format('%s,%s,%s,[%s]', [Trim(edtGroupName.Text), Trim(edtComName.Text),Trim(edtPhoneNum.Text), Trim(edtQQ.Text)]);
      PostData(sData);
      ShowMessage('提交成功！');
    except
      ShowMessage('提交失败！');
    end;
  finally
    ShowHint(False);
  end;
end;

procedure TForm1.btnImportClick(Sender: TObject);
var
  f: string;
  t: TextFile;
  s: string;
begin
  ShowHint();
  try
    f := OpenFile;
    if f = '' then Exit;

    AssignFile(t,f);
    Reset(t);   //只读打开文件
    while not Eof(t) do
    begin
      Readln(t,s);
      PostData(Trim(s));
    end;
    ShowMessage('导入完成');
  finally
    ShowHint(False);
  end;
end;

procedure TForm1.btnTestClick(Sender: TObject);
begin
  if dm.ConnDB(edtIp.Text, edtPwd.Text, GetDataBaseName(cmbBusiness.ItemIndex)) then
  begin
    SaveConfig;
    ShowMessage('连接成功！')
  end else
    ShowMessage('连接失败！');
end;

procedure TForm1.FormCreate(Sender: TObject);
begin
  ShowHint(False);
  LocaConfig;
end;

function TForm1.GetDataBaseName(AIndex: Integer): string;
begin
  Result := 'ModelPool';
  case AIndex of
    0: Result := 'ModelPool';
    1: Result := 'ModelPool_1681';
  end;
end;

procedure TForm1.LocaConfig;
var
  sCfgFile: string;
  iFile: TiniFile;
begin
  sCfgFile := ExtractFilePath(ParamStr(0)) + 'Config\Cfg.ini';
  iFile := TIniFile.Create(sCfgFile);
  try
    edtIp.Text := iFile.ReadString('DB', 'Host', '');
    edtPwd.Text := ManSoy.Base64.Base64ToStr(iFile.ReadString('DB', 'Pwd', ''));
    cmbBusiness.ItemIndex := iFile.ReadInteger('DB', 'Business', 0);
    cmbBusiness.Enabled := False;
  finally
    FreeAndNil(iFile);
  end;
end;

function TForm1.OpenFile: string;
begin
  Result := '';
  with TOpenDialog.Create(nil) do
  try
    Filter := 'Text Files|*.txt';
    if Execute then
      Result := FileName;
  finally
    Free;
  end;
end;

procedure TForm1.PostData(AData: string);
var
  s,sqlStr,groupName,comName,phone, qq: string;
  sl: TStrings;
  i: Integer;
begin
  if not dm.ConnDB(edtIp.Text, edtPwd.Text, GetDataBaseName(cmbBusiness.ItemIndex)) then
  begin
    Application.MessageBox('连接失败！', '提示');
    Exit;
  end;
  sl := TStringList.Create;
  sl.CommaText := AData;
  with dm do
  try
    conn.BeginTrans;
    try
      groupName := trim(sl.Strings[0]);
      comName := trim(sl.Strings[1]);
      phone := trim(sl.Strings[2]);
      qq := trim(sl.Strings[3]);
      qq := trim(Copy(qq,2, Length(qq)-2));
      sl.Delimiter := '/';
      sl.DelimitedText := qq;
      //GROUPINFO-----------------------------------------------
      qry.Close;
      sqlStr := 'SELECT * FROM GROUPINFO WHERE GROUPNAME='+quotedstr(groupName);
      qry.SQL.Text := sqlStr;
      qry.Open;
      if qry.RecordCount <= 0 then
      begin
        qry.Close;
        sqlStr := Format('INSERT GROUPINFO (GROUPNAME) VALUES (%s);', [quotedstr(groupName)]);
        qry.SQL.Text := sqlStr;
        qry.ExecSQL;
      end;

      //COMPORTS---------------如果没有就insert，有的话就update-------
      qry.Close;
      qry.SQL.Text := 'DELETE COMPORTS ' +
                      'WHERE PhoneNum=' +quotedstr(phone);
                      //'WHERE GROUPNAME='+quotedstr(groupName)+
                      //'      AND (COMNAME='  +quotedstr(comName) +
                      //'  AND PhoneNum=' +quotedstr(phone);
      qry.ExecSQL;

      qry.Close;
      sqlStr := Format('INSERT COMPORTS (GROUPNAME,COMNAME,PHONENUM) VALUES (%s,%s,%s);', [quotedstr(groupName), quotedstr(comName), quotedstr(phone)]);
      qry.SQL.Text := sqlStr;
      qry.ExecSQL;


      //BIND----------------------------------------
      i := 0;
      for i := 0 to sl.Count - 1 do
      begin
        qq:= Trim(sl.Strings[i]);
        qq:= Trim(sl.Strings[i]);
        qry.Close;
        qry.SQL.Text := 'DELETE BIND ' +
                        //'WHERE PHONENUM='+quotedstr(phone)+
                        //'      AND QQ='+quotedstr(qq);
                        'WHERE QQ='+quotedstr(qq);
        qry.ExecSQL;

        qry.Close;
        sqlStr := Format('INSERT BIND (PHONENUM,QQ) VALUES (%s,%s);', [quotedstr(phone), quotedstr(qq)]);
        qry.SQL.Text := sqlStr;
        qry.ExecSQL;
      end;
      conn.CommitTrans;
    except on E: Exception do
      begin
        conn.RollbackTrans;
        Application.MessageBox(PWideChar(Format('数据提交失败,错误原因'#13''#13'%s', [E.Message])), '提示', MB_ICONERROR)
      end;
    end;
  finally
    qry.Close;
    sl.Free;
  end;
end;

procedure TForm1.SaveConfig;
var
  sCfgFile: string;
  iFile: TiniFile;
begin
  sCfgFile := ExtractFilePath(ParamStr(0)) + 'Config\Cfg.ini';
  if not DirectoryExists(ExtractFileDir(sCfgFile)) then
    ForceDirectories(ExtractFileDir(sCfgFile));
  iFile := TIniFile.Create(sCfgFile);
  try
    iFile.WriteString('DB', 'Host', Trim(edtIp.Text));
    iFile.WriteString('DB', 'Pwd', ManSoy.Base64.StrToBase64(Trim(edtPwd.Text)));
    iFile.WriteInteger('DB', 'Business', cmbBusiness.ItemIndex);
  finally
    FreeAndNil(iFile);
  end;
end;

procedure TForm1.ShowHint(AShow: Boolean);
begin
  pnlHit.Visible := AShow;
  Self.Enabled := not AShow;
  if pnlHit.Visible then
  begin
    pnlHit.BringToFront
  end else
    pnlHit.SendToBack;
end;

end.
