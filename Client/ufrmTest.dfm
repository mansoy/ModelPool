object frmTest: TfrmTest
  Left = 0
  Top = 0
  Caption = #27979#35797#31383#21475
  ClientHeight = 183
  ClientWidth = 335
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  PixelsPerInch = 96
  TextHeight = 13
  object Label6: TLabel
    Left = 15
    Top = 21
    Width = 48
    Height = 13
    Caption = #25163#26426#21495#30721
  end
  object Label1: TLabel
    Left = 190
    Top = 20
    Width = 35
    Height = 13
    Caption = 'COM'#21475
  end
  object Label10: TLabel
    Left = 15
    Top = 47
    Width = 48
    Height = 13
    Caption = #30701#20449#20869#23481
  end
  object Bevel1: TBevel
    Left = 8
    Top = 129
    Width = 319
    Height = 3
  end
  object edtPhone: TEdit
    Left = 69
    Top = 17
    Width = 95
    Height = 21
    NumbersOnly = True
    TabOrder = 0
    Text = '13389220353'
  end
  object edtCom: TEdit
    Left = 229
    Top = 17
    Width = 95
    Height = 21
    TabOrder = 1
    Text = 'COM37'
  end
  object memContent: TMemo
    Left = 69
    Top = 44
    Width = 255
    Height = 77
    Lines.Strings = (
      #35299#38500#23433#20840#27169#24335)
    TabOrder = 2
  end
  object btnSendSms: TButton
    Left = 88
    Top = 142
    Width = 75
    Height = 25
    Caption = #21457#36865#30701#20449
    TabOrder = 3
    OnClick = btnSendSmsClick
  end
  object Button1: TButton
    Left = 174
    Top = 142
    Width = 75
    Height = 25
    Caption = #25509#25910#30701#20449
    TabOrder = 4
    OnClick = Button1Click
  end
end
