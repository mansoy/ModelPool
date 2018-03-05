unit uDm;

interface

uses
  System.SysUtils, System.Classes, Data.DB, Data.Win.ADODB,
  Vcl.Dialogs;

const
  DB_PASSWORD = '123';

  FLAG_NONE = 0;
  FLAG_SEND = 1; //'正在发短信';
  FLAG_RECV = 2; //'正在收短信';

type
  Tdm = class(TDataModule)
    conn: TADOConnection;
    qry: TADOQuery;
    qryComInfo: TADOQuery;
  private
    { Private declarations }
  public
    { Public declarations }
    function ConnDB(ip: string; pwd: string; Database: string): Boolean;
    procedure GetComInfo(AGroupName: string);
    function GetPhoneNumByComName(AComName: string): string;
    function GetComNameByPhoneNum(APhoneNum: string): string;
    function GetStateByComName(AComName: string): string;
    function GetStateByPhoneNum(APhoneNum: string): string;
    procedure UpdateStateByComName(AComName: string; AState: string);
    procedure UpdateStateByPhoneNum(APhoneNum: string; AState: string);
    function IsSending(AComName: string): Boolean;
    function IsRecving(AComName: string): Boolean;
    procedure UpdateFlag(AComName: string; AFlag: Integer);
  end;

var
  dm: Tdm;

implementation

{%CLASSGROUP 'Vcl.Controls.TControl'}

{$R *.dfm}


{ Tdm }

function Tdm.ConnDB(ip: string; pwd: string; Database: string): Boolean;
var
  connStr: string;
begin
  Result := False;
  if not conn.Connected then
  begin
    try
      connStr := Format('Provider=SQLOLEDB.1;Password=%s;Persist Security Info=False;User ID=sa;Initial Catalog=%s;Data Source=%s\SQLEXPRESS',
                      [DB_PASSWORD, Database, ip]);
      conn.ConnectionString := connStr;
      conn.Connected := True;
    except
      Exit;
    end;
  end;
  Result := True;
end;

procedure Tdm.GetComInfo(AGroupName: string);
begin
  try
    qryComInfo.Connection := conn;
    qryComInfo.Close;
    qryComInfo.SQL.Clear;
    qryComInfo.SQL.Text := 'select ComName, PhoneNum, '''' as State, 0 as Flag from ComPorts where GroupName='+
                            quotedstr(AGroupName)+' order by cast(substring(ComName,4,3) as int)';

    qryComInfo.Open;
  except on e: Exception do
  end;
end;

function Tdm.GetComNameByPhoneNum(APhoneNum: string): string;
begin
  Result := '';
  if not qryComInfo.Locate('PhoneNum', APhoneNum, [loCaseInsensitive]) then Exit;
  Result := qryComInfo.FieldByName('ComName').AsString;
end;

function Tdm.GetPhoneNumByComName(AComName: string): string;
begin
  Result := '';
  if not qryComInfo.Locate('ComName', AComName, [loCaseInsensitive]) then Exit;
  Result := qryComInfo.FieldByName('PhoneNum').AsString;
end;

function Tdm.GetStateByComName(AComName: string): string;
begin
  Result := '';
  if not qryComInfo.Locate('ComName', AComName, [loCaseInsensitive]) then Exit;
  Result := qryComInfo.FieldByName('State').AsString;
end;

function Tdm.GetStateByPhoneNum(APhoneNum: string): string;
begin
  Result := '';
  if not qryComInfo.Locate('PhoneNum', APhoneNum, [loCaseInsensitive]) then Exit;
  Result := qryComInfo.FieldByName('State').AsString;
end;

function Tdm.IsRecving(AComName: string): Boolean;
begin
  Result := False;
  try
    if AComName = '' then Exit;
    if not qryComInfo.Locate('ComName', AComName, [loCaseInsensitive]) then Exit;
    if qryComInfo.FieldByName('Flag').AsInteger <> FLAG_RECV then Exit;

    Result := True;
  except
  end;
end;

function Tdm.IsSending(AComName: string): Boolean;
begin
  Result := False;
  try
    if AComName = '' then Exit;
    if not qryComInfo.Locate('ComName', AComName, [loCaseInsensitive]) then Exit;
    if qryComInfo.FieldByName('Flag').AsInteger <> FLAG_SEND then Exit;
    Result := True;
  except
  end;
end;

procedure Tdm.UpdateFlag(AComName: string; AFlag: Integer);
begin
  try
    if AComName = '' then Exit;
    if not qryComInfo.Locate('ComName', AComName, [loCaseInsensitive]) then Exit;
    qryComInfo.Edit;
    qryComInfo.FieldByName('Flag').AsInteger := AFlag;
    qryComInfo.Post;
  except
  end;
end;

procedure Tdm.UpdateStateByComName(AComName: string; AState: string);
begin
  try
    if not qryComInfo.Locate('ComName', AComName, [loCaseInsensitive]) then Exit;
    qryComInfo.Edit;
    qryComInfo.FieldByName('State').AsString := AState;
    qryComInfo.Post;
  except
  end;
end;

procedure Tdm.UpdateStateByPhoneNum(APhoneNum: string; AState: string);
begin
  try
    if not qryComInfo.Locate('PhoneNum', APhoneNum, [loCaseInsensitive]) then Exit;
    qryComInfo.Edit;
    qryComInfo.FieldByName('State').AsString := AState;
    qryComInfo.Post;
  except
  end;
end;

end.
