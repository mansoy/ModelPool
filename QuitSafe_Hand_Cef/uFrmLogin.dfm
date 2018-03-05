object FrmLogin: TFrmLogin
  Left = 0
  Top = 0
  Caption = #35299#23433#20840#24037#20855
  ClientHeight = 566
  ClientWidth = 808
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  OnCreate = FormCreate
  OnShow = FormShow
  PixelsPerInch = 96
  TextHeight = 13
  object CEFWindowParent1: TCEFWindowParent
    Left = 0
    Top = 0
    Width = 703
    Height = 566
    Align = alClient
    TabOrder = 0
    ExplicitTop = 41
    ExplicitWidth = 1038
    ExplicitHeight = 583
  end
  object Panel1: TPanel
    Left = 703
    Top = 0
    Width = 105
    Height = 566
    Align = alRight
    BevelInner = bvLowered
    TabOrder = 1
    object btnReLoad: TButton
      Left = 14
      Top = 64
      Width = 75
      Height = 25
      Caption = #37325#26032#21152#36733
      TabOrder = 0
      OnClick = btnReLoadClick
    end
    object GetDynCode: TButton
      Left = 14
      Top = 240
      Width = 75
      Height = 25
      Caption = #33719#21462#23494#20445
      TabOrder = 1
      OnClick = GetDynCodeClick
    end
    object btnSendSms: TButton
      Left = 14
      Top = 295
      Width = 75
      Height = 25
      Caption = #21457#36865#30701#20449
      TabOrder = 2
      OnClick = btnSendSmsClick
    end
    object btnLogin: TButton
      Left = 15
      Top = 111
      Width = 75
      Height = 25
      Caption = #30331#24405
      TabOrder = 3
      OnClick = btnLoginClick
    end
    object Button2: TButton
      Left = 40
      Top = 511
      Width = 75
      Height = 25
      Caption = #20851' '#38381
      ModalResult = 2
      TabOrder = 4
      OnClick = btnSendSmsClick
    end
  end
  object Chromium1: TChromium
    OnTextResultAvailable = Chromium1TextResultAvailable
    OnLoadEnd = Chromium1LoadEnd
    OnAfterCreated = Chromium1AfterCreated
    Left = 400
    Top = 328
  end
  object Timer1: TTimer
    Enabled = False
    Interval = 500
    OnTimer = Timer1Timer
    Left = 584
    Top = 184
  end
end
