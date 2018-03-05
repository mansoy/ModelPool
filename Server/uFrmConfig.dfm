object FrmConfig: TFrmConfig
  Left = 0
  Top = 0
  BorderIcons = [biSystemMenu, biMinimize]
  BorderStyle = bsSingle
  Caption = #37197#32622
  ClientHeight = 245
  ClientWidth = 294
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  DesignSize = (
    294
    245)
  PixelsPerInch = 96
  TextHeight = 13
  object GroupBox1: TGroupBox
    Left = 0
    Top = 0
    Width = 294
    Height = 54
    Align = alTop
    Caption = #26381#21153#22120#35774#32622
    TabOrder = 0
    ExplicitLeft = 8
    ExplicitTop = 8
    ExplicitWidth = 371
    object Label1: TLabel
      Left = 16
      Top = 24
      Width = 10
      Height = 13
      Caption = 'IP'
    end
    object Label2: TLabel
      Left = 169
      Top = 24
      Width = 20
      Height = 13
      Caption = 'Port'
    end
    object edtIpAddress: TEdit
      Left = 32
      Top = 21
      Width = 131
      Height = 21
      TabOrder = 0
      Text = '0.0.0.0'
    end
    object edtPort: TSpinEdit
      Left = 195
      Top = 21
      Width = 65
      Height = 22
      MaxValue = 0
      MinValue = 0
      TabOrder = 1
      Value = 5173
    end
  end
  object GroupBox2: TGroupBox
    Left = 0
    Top = 54
    Width = 294
    Height = 151
    Align = alClient
    Caption = #25968#25454#24211#35774#32622
    TabOrder = 1
    ExplicitWidth = 336
    ExplicitHeight = 155
    object Label3: TLabel
      Left = 73
      Top = 32
      Width = 10
      Height = 13
      Caption = 'IP'
    end
    object Label4: TLabel
      Left = 23
      Top = 59
      Width = 60
      Height = 13
      Caption = #25968#25454#24211#21517#31216
    end
    object Label5: TLabel
      Left = 59
      Top = 86
      Width = 24
      Height = 13
      Caption = #36134#21495
    end
    object Label6: TLabel
      Left = 59
      Top = 113
      Width = 24
      Height = 13
      Caption = #23494#30721
    end
    object edtDataBaseHost: TEdit
      Left = 90
      Top = 29
      Width = 170
      Height = 21
      TabOrder = 0
      Text = '127.0.0.1'
    end
    object edtDataBaseName: TEdit
      Left = 90
      Top = 56
      Width = 170
      Height = 21
      TabOrder = 1
      Text = 'ModelPool'
    end
    object edtAccount: TEdit
      Left = 90
      Top = 83
      Width = 170
      Height = 21
      TabOrder = 2
      Text = 'sa'
    end
    object edtPassWord: TEdit
      Left = 90
      Top = 110
      Width = 170
      Height = 21
      PasswordChar = '*'
      TabOrder = 3
      Text = '1232'
    end
  end
  object RadioGroup1: TRadioGroup
    Left = 0
    Top = 205
    Width = 294
    Height = 40
    Align = alBottom
    TabOrder = 2
    ExplicitTop = 215
    ExplicitWidth = 336
  end
  object btnSave: TButton
    Left = 183
    Top = 214
    Width = 46
    Height = 25
    Anchors = [akRight]
    Caption = #20445#23384
    TabOrder = 3
    OnClick = btnSaveClick
    ExplicitLeft = 221
    ExplicitTop = 223
  end
  object Button3: TButton
    Left = 239
    Top = 214
    Width = 46
    Height = 25
    Anchors = [akRight]
    Caption = #21462#28040
    ModalResult = 2
    TabOrder = 4
    ExplicitLeft = 277
    ExplicitTop = 223
  end
  object btnTestConn: TButton
    Left = 8
    Top = 214
    Width = 98
    Height = 25
    Caption = #27979#35797#38142#25509
    TabOrder = 5
    OnClick = btnTestConnClick
  end
end
