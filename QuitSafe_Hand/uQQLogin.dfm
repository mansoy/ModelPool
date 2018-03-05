object frmQQLogin: TfrmQQLogin
  Left = 0
  Top = 0
  BorderIcons = [biSystemMenu]
  BorderStyle = bsDialog
  Caption = 'QQ'#30331#24405
  ClientHeight = 384
  ClientWidth = 588
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  FormStyle = fsStayOnTop
  OldCreateOrder = False
  Position = poScreenCenter
  OnCreate = FormCreate
  OnDestroy = FormDestroy
  PixelsPerInch = 96
  TextHeight = 13
  object wb: TWebBrowser
    Left = 0
    Top = 0
    Width = 588
    Height = 384
    Align = alClient
    TabOrder = 0
    OnProgressChange = wbProgressChange
    OnNewWindow2 = wbNewWindow2
    OnNavigateComplete2 = wbNavigateComplete2
    ExplicitLeft = 88
    ExplicitTop = 32
    ExplicitWidth = 300
    ExplicitHeight = 150
    ControlData = {
      4C000000C63C0000B02700000000000000000000000000000000000000000000
      000000004C000000000000000000000001000000E0D057007335CF11AE690800
      2B2E12620A000000000000004C0000000114020000000000C000000000000046
      8000000000000000000000000000000000000000000000000000000000000000
      00000000000000000100000000000000000000000000000000000000}
  end
  object btnOK: TButton
    Left = 427
    Top = 8
    Width = 97
    Height = 32
    Caption = #23436#25104
    TabOrder = 1
    OnClick = btnOKClick
  end
  object Button1: TButton
    Left = 322
    Top = 8
    Width = 99
    Height = 32
    Caption = #36755#20837#36134#21495#23494#30721
    TabOrder = 2
    OnClick = Button1Click
  end
  object Timer1: TTimer
    OnTimer = Timer1Timer
    Left = 456
    Top = 80
  end
end
