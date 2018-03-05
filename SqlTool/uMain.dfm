object Form1: TForm1
  Left = 0
  Top = 0
  BorderIcons = [biSystemMenu, biMinimize]
  BorderStyle = bsSingle
  Caption = #25968#25454#24211#25805#20316#24037#20855
  ClientHeight = 208
  ClientWidth = 580
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poDesktopCenter
  OnCreate = FormCreate
  PixelsPerInch = 96
  TextHeight = 13
  object GroupBox1: TGroupBox
    Left = 0
    Top = 53
    Width = 580
    Height = 155
    Align = alClient
    Caption = #28155#21152#19968#24352'SIM'#21345#20449#24687
    TabOrder = 1
    object Label3: TLabel
      Left = 20
      Top = 28
      Width = 48
      Height = 13
      Caption = #35774#22791#32452#21517
    end
    object Label4: TLabel
      Left = 198
      Top = 28
      Width = 36
      Height = 13
      Caption = #20018#21475#21517
    end
    object Label5: TLabel
      Left = 362
      Top = 28
      Width = 36
      Height = 13
      Caption = #25163#26426#21495
    end
    object Label6: TLabel
      Left = 16
      Top = 55
      Width = 52
      Height = 13
      Caption = #32465#23450'QQ'#21495
    end
    object Label7: TLabel
      Left = 110
      Top = 84
      Width = 270
      Height = 13
      Caption = '(QQ'#21495#65292#20197'"/"'#38388#38548' '#27880#24847#65306#27492#25805#20316#23558#21024#38500#20043#21069#30340#25968#25454' )'
      Color = clBtnFace
      Font.Charset = DEFAULT_CHARSET
      Font.Color = clPurple
      Font.Height = -11
      Font.Name = 'Tahoma'
      Font.Style = []
      ParentColor = False
      ParentFont = False
    end
    object Label9: TLabel
      Left = 110
      Top = 116
      Width = 402
      Height = 13
      Caption = #27599#34892#25991#26412#26684#24335#65306#32452#21517','#20018#21475#21517','#25163#26426#21495',[QQ'#21495'1/QQ'#21495'2/QQ'#21495'3/QQ'#21495'4/QQ'#21495'5/...]'
      Font.Charset = DEFAULT_CHARSET
      Font.Color = clPurple
      Font.Height = -11
      Font.Name = 'Tahoma'
      Font.Style = []
      ParentFont = False
    end
    object edtComName: TEdit
      Left = 240
      Top = 25
      Width = 116
      Height = 21
      TabOrder = 1
    end
    object edtGroupName: TEdit
      Left = 71
      Top = 25
      Width = 122
      Height = 21
      TabOrder = 0
    end
    object edtPhoneNum: TEdit
      Left = 400
      Top = 25
      Width = 164
      Height = 21
      TabOrder = 2
    end
    object edtQQ: TEdit
      Left = 71
      Top = 52
      Width = 493
      Height = 21
      TabOrder = 3
    end
    object btnAdd: TButton
      Left = 18
      Top = 79
      Width = 82
      Height = 25
      Caption = #20445#23384
      TabOrder = 4
      OnClick = btnAddClick
    end
    object btnImport: TButton
      Left = 17
      Top = 111
      Width = 82
      Height = 25
      Caption = #25209#37327#23548#20837
      TabOrder = 5
      OnClick = btnImportClick
    end
  end
  object GroupBox3: TGroupBox
    Left = 0
    Top = 0
    Width = 580
    Height = 53
    Align = alTop
    Caption = #25968#25454#24211#20449#24687
    TabOrder = 0
    object Label1: TLabel
      Left = 362
      Top = 20
      Width = 24
      Height = 13
      Caption = #23494#30721
    end
    object Label2: TLabel
      Left = 32
      Top = 21
      Width = 36
      Height = 13
      Caption = #26381#21153#22120
    end
    object Label10: TLabel
      Left = 210
      Top = 20
      Width = 24
      Height = 13
      Caption = #21830#23478
    end
    object btnTest: TButton
      Left = 489
      Top = 15
      Width = 75
      Height = 25
      Caption = #27979#35797#36830#25509
      TabOrder = 0
      OnClick = btnTestClick
    end
    object edtIp: TEdit
      Left = 71
      Top = 17
      Width = 122
      Height = 21
      TabOrder = 1
      Text = '113.200.71.18,5009'
    end
    object edtPwd: TEdit
      Left = 392
      Top = 17
      Width = 88
      Height = 21
      PasswordChar = '*'
      TabOrder = 2
      Text = '123'
    end
    object cmbBusiness: TComboBox
      Left = 240
      Top = 17
      Width = 116
      Height = 21
      ItemIndex = 0
      TabOrder = 3
      Text = #37027#34013
      Items.Strings = (
        #37027#34013
        '1681')
    end
  end
  object pnlHit: TPanel
    Left = 129
    Top = 78
    Width = 383
    Height = 68
    Caption = #27491#22312#25552#20132#25968#25454','#35831#31245#21518'...'
    TabOrder = 2
  end
end
