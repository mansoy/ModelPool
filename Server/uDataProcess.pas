unit uDataProcess;

interface

uses
  Windows, System.SysUtils, System.Classes, uPublic,
  uServerPublic,
  HPSocketSDKUnit,
  QMsgPack
  ;

type
  // 处理接受客户端结构体
  TDataProcess = class(TThread)
  private
    FConnID: DWORD;
    FMsgPack: TQMsgPack;
    function SetGroupName: Boolean;
    function fnRetResult: Boolean;
    function fnSendSms: Boolean;
    function GetDeviceInfo(AGroupName: string; var ADeviceInfo: TDeviceInfo): Boolean;
  protected
    procedure Execute; override;
  public
    
    constructor Create(AConnid: DWORD; AData: Pointer; ADataLen: Integer);
    destructor Destroy; override;
  end;

implementation

{ TDataProcess }

constructor TDataProcess.Create(AConnid: DWORD; AData: Pointer; ADataLen: Integer);
var
  vBin: TBytes;
begin
  inherited Create(False);
  FMsgPack := TQMsgPack.Create;
  try
    SetLength(vBin, ADataLen);
    CopyMemory(vBin, AData, ADataLen);
    FMsgPack.Parse(vBin);
    FConnID := AConnid;
    FreeOnTerminate := True;
  finally
    SetLength(vBin, 0);
  end;
end;

destructor TDataProcess.Destroy;
begin
  FreeAndNil(FMsgPack);
  inherited;
end;

procedure TDataProcess.Execute;
var
  vCommType: TCommType;
begin
  // inherited;
  vCommType := TCommType(FMsgPack.ItemByName('Cmd').AsInteger);
  case vCommType of
    ctNone:
      ;
    ctResult:
      fnRetResult;
    ctGroupName:
      SetGroupName;
    ctSendMsg:
      fnSendSms;
    ctRecvMsg:
      ;
  end;
end;

function TDataProcess.GetDeviceInfo(AGroupName: string; var ADeviceInfo: TDeviceInfo): Boolean;
var dwKey: DWORD;
begin
  Result := False;
  //--获取Device的ConnectID
  for dwKey in GDeviceInfos.Keys do  begin
    if GDeviceInfos[dwKey].GroupName = AGroupName then begin
      ADeviceInfo := GDeviceInfos[dwKey];
      Result := True;
      Break;
    end;
  end;
end;

function TDataProcess.fnRetResult: Boolean;
begin
  Result := False;
  try
    Result := SendResult(
                   FMsgPack.ItemByName('ClientId').AsInteger,
                   TCommType(FMsgPack.ItemByName('PriorCmd').AsInteger),
                   TResultState(FMsgPack.ItemByName('Ret').AsInteger),
                   FMsgPack.ItemByName('Content').AsString
              );
    AddLogMsg('Result to client[%d]...', [FMsgPack.ItemByName('ClientId').AsInteger]);
  except
    AddLogMsg('ProcessResult fail[%d]...', [FMsgPack.ItemByName('ClientId').AsInteger]);
  end;
end;

function TDataProcess.fnSendSms: Boolean;
var
  sQQ: string;
  sGroupName, sComPort: string;
  vMsgPack: TQMsgPack;
  vCmdType: TCommType;
  vConnId: DWORD;
  vDeviceInfo: TDeviceInfo;
  vBuf: TBytes;
begin
  Result := False;
  try
    vCmdType := TCommType(FMsgPack.ItemByName('Cmd').AsInteger);
    sQQ := FMsgPack.ItemByName('QQ').AsString;
    if sQQ = '' then
    begin
      SendResult(FConnID, vCmdType, rsFail, 'QQ号不能为空');
      Exit;
    end;

//    {$IFDEF DEBUG}
//    sGroupName := 'ModelPool2';
//    sComPort := 'COM36';
//    {$ELSE}
    if not GetModelPoolInfo(sQQ, sGroupName, sComPort) then
    begin
      SendResult(FConnID, vCmdType, rsFail, '没有找到此账号对应的串口');
      Exit;
    end;
//    {$ENDIF}

    if not GetDeviceInfo(sGroupName, vDeviceInfo) then begin
      SendResult(FConnID, vCmdType, rsFail, '没有找到链接的设备');
      Exit;
    end;
    vMsgPack := FMsgPack.Copy;
    try
      vMsgPack.Add('ComPort', sComPort);
      vMsgPack.Add('ClientId', FConnID);
      vBuf := vMsgPack.Encode;
      if not SendData(vDeviceInfo.ConnectID, vBuf, Length(vBuf)) then begin
        SendResult(FConnID, vCmdType, rsFail, '给设备发送信息失败');
        Exit;
      end;
      AddLogMsg('vSmsData to add database...', []);
      Result := True;
    finally
      SetLength(vBuf, 0);
      FreeAndNil(vMsgPack);
    end;
  except
    AddLogMsg('ProcessSmsData fail[%d]...', [GetLastError()]);
  end;
end;

function TDataProcess.SetGroupName: Boolean;
var
  vDeviceInfo: TDeviceInfo;
  I: Integer;
  sGroupName: string;
begin
  Result := False;
  try
    sGroupName := FMsgPack.ItemByName('GroupName').AsString;
    //TODO:
    if not GDeviceInfos.ContainsKey(FConnID) then begin
      vDeviceInfo.ConnectID := FConnID;
    end else begin
      vDeviceInfo := TDeviceInfo(GDeviceInfos[FConnID]);
    end;
    vDeviceInfo.IsDevice := True;
    vDeviceInfo.GroupName := sGroupName;
    GDeviceInfos.AddOrSetValue(FConnID, vDeviceInfo);
    SendMessage(GFrmMainHwnd, WM_ADD_DEVICE, 0, LPARAM(FConnID));
  except
    AddLogMsg('SetGroupName fail[%d]...', [GetLastError()]);
    Exit;
  end;
  Result := True;
end;

end.
