unit uServerPublic;

interface

uses
  Windows, System.SysUtils, Generics.Collections,
  Data.DB, Data.Win.ADODB, uPublic, HPSocketSDKUnit
  , QMsgPack;

type
  TConfigInfo = record
    IP: string;
    Port: Word;
    DB_Host: string;
    DB_Name: string;
    DB_Account: string;
    DB_PassWord: string;
  end;

var
  GHPServer: Pointer;
  GHPListener: Pointer;
  GAppState: EnAppState;
  GDeviceInfos: TDictionary<DWORD,TDeviceInfo>;
  GConfigInfo: TConfigInfo;
  GAdoConn: TAdoConnection;
  GConfigFileName: string;

const
  GDBConnString = //'Provider=SQLOLEDB.1;Password=%s;Persist Security Info=True;User ID=%s;Initial Catalog=%s;Data Source=%s\SQLEXPRESS';
                  'Provider=SQLOLEDB.1;Password=%s;Persist Security Info=True;User ID=%s;Initial Catalog=%s;Data Source=%s';
                  //'Provider=SQLOLEDB.1;Password=%s;Persist Security Info=True;User ID=%s;Initial Catalog=%s;Data Source=%s\SQLEXPRESS';
  function SendData(AConnID: DWORD; AData: Pointer; ADataLen: integer): Boolean;
  function SendResult(AConnID: DWORD; ACmdType: TCommType; AResultState: TResultState; ResuleMsg: string): Boolean;
  procedure AddLogMsg(AFormat: string; Args: array of const);

  function ConnDataBase: Boolean;
  function DisConnDataBase: Boolean;
  function GetModelPoolInfo(QQ: string; var AGroupName: string; var AComName: string): Boolean;

implementation

function SendData(AConnID: DWORD; AData: Pointer; ADataLen: integer): Boolean;
begin
  Result := False;
  try
    Result := HP_Server_Send(GHPServer, AConnID, AData, ADataLen);
  except
    AddLogMsg('SendData fail[%s]...', [GetLastError()]);
  end;
end;

function SendResult(AConnID: DWORD; ACmdType: TCommType; AResultState: TResultState; ResuleMsg: string): Boolean;
var
  vMsgPack: TQMsgPack;
  vBin: TBytes;
begin
  Result := False;
  vMsgPack := TQMsgPack.Create;
  try
    try
      vMsgPack.Add('Cmd', Integer(ACmdType));
      vMsgPack.Add('Ret', Integer(AResultState));
      vMsgPack.Add('Content', ResuleMsg);
      vBin := vMsgPack.Encode;
      SendData(AConnID, vBin, Length(vBin));
      Result := True;
    except
      AddLogMsg('SendResult fail[%s]...', [GetLastError()]);
    end;
  finally
    FreeAndNil(vMsgPack);
  end;
end;

procedure AddLogMsg(AFormat: string; Args: array of const);
var
  sText: string;
begin
  sText := System.SysUtils.Format(AFormat, Args, FormatSettings);
  if sText <> '' then
  begin
    SendMessage(GFrmMainHwnd, WM_ADD_LOG, 0, LPARAM(sText));
  end;
end;

function ConnDataBase: Boolean;
var
  sConnString: string;
begin
  try
    if GAdoConn.Connected then GAdoConn.Close;
    sConnString := Format(GDBConnString, [
        GConfigInfo.DB_PassWord,
        GConfigInfo.DB_Account,
        GConfigInfo.DB_Name,
        GConfigInfo.DB_Host
        ]);
    GAdoConn.ConnectionString := sConnString;
    GAdoConn.Connected := True;
    Result := GAdoConn.Connected;
    AddLogMsg('ConnDataBase OK...', []);
  except
    AddLogMsg('ConnDataBase fail[%d]...', [GetLastError()]);
  end;
end;

function DisConnDataBase: Boolean;
begin
  Result := False;
  try
    if GAdoConn.Connected then GAdoConn.Close;
    AddLogMsg('DisConnDataBase OK...', []);
  except
    AddLogMsg('DisConnDataBase fail[%d]...', [GetLastError()]);
  end;
end;

function GetModelPoolInfo(QQ: string; var AGroupName: string; var AComName: string): Boolean;
var
  vQuery: TADOQuery;
begin
  Result := False;
  AGroupName := '';
  AComName := '';
  if not GAdoConn.Connected then begin
    AddLogMsg('DataBase not connected...', []);
    Exit;
  end;

  try
    vQuery := TADOQuery.Create(nil);
    try
      vQuery.Connection := GAdoConn;
      vQuery.SQL.Clear;
      vQuery.SQL.Text := 'SELECT * FROM VDeviceInfo WHERE QQ = ' + QuotedStr(QQ);
      vQuery.Open;

      if vQuery.RecordCount <= 0 then Exit;

      AComName := vQuery.FieldByName('ComName').AsString;
      AGroupName := vQuery.FieldByName('GroupName').AsString;
    finally
      if vQuery.Active then vQuery.Close;
      FreeAndNil(vQuery);
    end;

  except
    AddLogMsg('GetComPortInfo fail[%d]...', [GetLastError()]);
  end;
  Result := True;
end;

//function AddMsgToDataBase(ASmsData: TSmsData): Boolean;
//var
//  vQuery: TADOQuery;
//  nType: ShortInt;
//begin
//  Result := False;
//  if not GAdoConn.Connected then begin
//    AddLogMsg('DataBase not connected...', []);
//    Exit;
//  end;
//
//  try
//    vQuery := TADOQuery.Create(nil);
//    try
//      if ASmsData.CommType = ctSendMsg then
//         nType := 0
//      else
//         nType := 1;
//
//      vQuery.Connection := GAdoConn;
//      vQuery.SQL.Clear;
//      vQuery.SQL.Text := 'INSERT INTO [ModelPool].[dbo].[Message] (' + #13#10 +
//                         '  [SendPhoneNum],' + #13#10 +
//                         '  [RecvPhoneNum],' + #13#10 +
//                         '  [MsgType],' + #13#10 +
//                         '  [MsgContent])' + #13#10 +
//                         'VALUES(' + #13#10 +
//                            QuotedStr(ASmsData.SendPhoneNum) + ',' + #13#10 +
//                            QuotedStr(ASmsData.RecvPhoneNum) + ',' + #13#10 +
//                            IntToStr(nType) + ',' + #13#10 +
//                            QuotedStr(ASmsData.MsgContent) + #13#10 +
//                         ')';
//      vQuery.ExecSQL;
//    finally
//      if vQuery.Active then vQuery.Close;
//      FreeAndNil(vQuery);
//    end;
//  except
//    AddLogMsg('AddMsgToDataBase fail[%d]...', [GetLastError()]);
//  end;
//  Result := True;
//end;

initialization
  GDeviceInfos := TDictionary<DWORD,TDeviceInfo>.Create();
  GDeviceInfos.Clear;
  GAdoConn := TADOConnection.Create(nil);
  GAdoConn.LoginPrompt := False;
  GConfigFileName := ExtractFilePath(ParamStr(0));
  GConfigFileName := GConfigFileName + 'Config';
  if not DirectoryExists(GConfigFileName) then ForceDirectories(GConfigFileName);
  GConfigFileName := GConfigFileName + '\Config.ini';

finalization
  GDeviceInfos.Clear;
  FreeAndNil(GDeviceInfos);
  if GAdoConn.Connected then GAdoConn.Close;
  FreeAndNil(GAdoConn);
end.
