unit ufrmTest;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ExtCtrls;

type
  TfrmTest = class(TForm)
    Label6: TLabel;
    edtPhone: TEdit;
    Label1: TLabel;
    edtCom: TEdit;
    Label10: TLabel;
    memContent: TMemo;
    btnSendSms: TButton;
    Button1: TButton;
    Bevel1: TBevel;
    procedure btnSendSmsClick(Sender: TObject);
    procedure Button1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

//var
  //frmTest: TfrmTest;

  function fnOpenTest: Boolean;

implementation

uses
  uSms, uData, QWorker, qmsgpack;

{$R *.dfm}

function fnOpenTest: Boolean;
begin
   with TfrmTest.Create(nil) do
   try
     ShowModal;
   finally
     Free;
   end;
end;

procedure DoSendSms(AJob: PQJob);
var
  vCom: TModelCom;
  sRet: string;
  vMsgPack: TQMsgPack;
begin
  vMsgPack := TQMsgPack(AJob.Data);
  if vMsgPack = nil then Exit;
  
  vCom := TModelCom.Create(vMsgPack.ItemByName('ComPort').AsString, vMsgPack.ItemByName('TargetPhone').AsString, GConfig.BaudRate);
  try
    sRet := vCom.Open();
    if sRet <> 'OK' then
    begin
      AddLogMsg('%s', [sRet]);
      Exit;
    end;
    sRet := vCom.SendSms(vMsgPack.ItemByName('MsgContent').AsString);
    uData.AddLogMsg(sRet, []);
  finally
    vCom.Close();
    FreeAndNil(vCom);
    FreeAndNil(vMsgPack);
  end;
end;

procedure TfrmTest.btnSendSmsClick(Sender: TObject);
var
  vMsgPack: TQMsgPack;
begin
  vMsgPack := TQMsgPack.Create;
  vMsgPack.Add('ComPort', edtCom.Text);
  vMsgPack.Add('TargetPhone', edtPhone.Text);
  vMsgPack.Add('MsgContent', memContent.Text);
  Workers.Post(DoSendSms, vMsgPack);
end;

procedure TfrmTest.Button1Click(Sender: TObject);
  procedure BubbleSort(var ASmsRecords: TSmsReocrds);
  var
    I, J: Integer;
    T: TSmsRecord;
    vDate: TDateTime;
  begin
    for I := High(ASmsRecords) downto Low(ASmsRecords) do
      for J := Low(ASmsRecords) to High(ASmsRecords) - 1 do
        if ASmsRecords[J].DateTime < ASmsRecords[J + 1].DateTime then
        begin
          T := ASmsRecords[J];
          ASmsRecords[J] := ASmsRecords[J + 1];
          ASmsRecords[J + 1] := T;
        end;
  end;
  function ParseSms(AKeyValue: string; ASmsRecords: TSmsReocrds): Integer;
  var
    I: Integer;//: TSmsRecord;
  begin
    Result := -1;
    try
      if Trim(AKeyValue) = '' then
      begin
        Result := 0;
        Exit;
      end;
      for I := Low(ASmsRecords) to High(ASmsRecords) do
      begin
        {$IFDEF DEBUG}
        AddLogMsg('[短信内容]:%s, [发送号码]:%s, [发送时间]:%s',
                [ASmsRecords[I].Content, ASmsRecords[I].SendPhoneNum, FormatDateTime('yyyy-MM-dd hh:nn:ss', ASmsRecords[I].DateTime)]);
        {$ENDIF}
        if Pos(Trim(AKeyValue), ASmsRecords[I].Content) > 0 then
        begin
          Result := I;
          Exit;
        end;
      end;
    except
    end;
  end;
var
  sCom, sRet, sContext: string;
  vCom: TModelCom;
  vSmsRecords: TSmsReocrds;
  I: Integer;
begin
  AMsgPack.I['Cmd'] := Integer(cmdRetRecvSms);
  AMsgPack.O['Ret'].I['Code']:= Integer(tfFail);
  try
    try
      sCom := AMsgPack.S['ComPort'];
      if sCom = '' then
      begin
        sRet := '数据错误:Com端口为空';
        AMsgPack.O['Ret'].S['Msg'] := sRet;
        Exit;
      end;
      if fnCheckComPort(sCom) then
      begin
        sRet := Format('当前Com口[%s]繁忙,请稍后再试', [sCom]);
        AMsgPack.O['Ret'].S['Msg'] := sRet;
        Exit;
      end;
      GMsQueue.Add(sCom);
      try
        //--切换通道
        sRet := fnSwitchSms(AMsgPack);
        if sRet <> 'OK' then
        begin
          AMsgPack.O['Ret'].S['Msg'] := sRet;
          Exit;
        end;
        //执行发短信操作
        vCom := TModelCom.Create(sCom, GConfig.ModelPoolBaudRate);
        try
          sRet := vCom.Open();
          if sRet <> 'OK' then
          begin
            AddLogMsg(sRet, []);
            AMsgPack.O['Ret'].S['Msg'] := sRet;
            Exit;
          end;
          //--vSmsRecords里边包含了当前手机卡上所有短信
          sRet := vCom.RecvSms(vSmsRecords);
          if sRet <> 'OK' then
          begin
            AddLogMsg(sRet, []);
            AMsgPack.O['Ret'].S['Msg'] := sRet;
            Exit;
          end;
        finally
          vCom.Close();
          FreeAndNil(vCom);
        end;
      finally
        GMsQueue.Delete(sCom);
      end;

      //---得到自己想要的短信
      if Length(vSmsRecords) = 0 then
      begin
        AMsgPack.O['Ret'].S['Msg'] := '没有收到短信';
        Exit;
      end;
      //--先按日期排个序
      BubbleSort(vSmsRecords);
      {$IFDEF DEBUG}
      for I := Low(vSmsRecords) to High(vSmsRecords) do
      begin
        AddLogMsg('[短信内容]:%s, [发送号码]:%s, [发送时间]:%s',
                [vSmsRecords[I].Content, vSmsRecords[I].SendPhoneNum, FormatDateTime('yyyy-MM-dd hh:nn:ss', vSmsRecords[I].DateTime)]);
      end;
      {$ENDIF}
      I := ParseSms(AMsgPack.S['KeyWord'], vSmsRecords);
      AddLogMsg('11111111', []);
      if -1 = I then
      begin
        AMsgPack.O['Ret'].S['Msg'] := '没有收到短信';
        Exit;
      end;
      AddLogMsg('11111112', []);
      AMsgPack.O['Data'].S['SendPhone'] := vSmsRecords[I].SendPhoneNum;
      AMsgPack.O['Data'].S['SendDate']  := DateTimeToStr(vSmsRecords[I].DateTime);
      AMsgPack.O['Data'].S['SmsContent'] := vSmsRecords[I].Content;
      AddLogMsg('11111113', []);

      AMsgPack.O['Ret'].I['Code'] := Integer(tfSuccess);
    except on E: Exception do
      begin
        AMsgPack.O['Ret'].S['Msg'] := Format('接收短信发生错误[%s]', [E.Message]);
        Exit;
      end;
    end;
  finally
    fnSendData(AMsgPack);
  end;
end;

end.
