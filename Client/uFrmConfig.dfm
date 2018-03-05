object frmConfig: TfrmConfig
  Left = 0
  Top = 0
  ActiveControl = btnSave
  BorderIcons = [biSystemMenu]
  BorderStyle = bsDialog
  Caption = #37197#32622
  ClientHeight = 214
  ClientWidth = 232
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
  object Label7: TLabel
    Left = 28
    Top = 45
    Width = 48
    Height = 13
    Caption = #26381#21153#22320#22336
  end
  object Label8: TLabel
    Left = 52
    Top = 72
    Width = 24
    Height = 13
    Caption = #31471#21475
  end
  object Label9: TLabel
    Left = 28
    Top = 18
    Width = 48
    Height = 13
    Caption = #29483#27744#26631#35782
  end
  object Bevel1: TBevel
    Left = 8
    Top = 165
    Width = 215
    Height = 2
  end
  object Bevel2: TBevel
    Left = 8
    Top = 120
    Width = 215
    Height = 2
  end
  object Label1: TLabel
    Left = 40
    Top = 134
    Width = 36
    Height = 13
    Caption = #27874#29305#29575
  end
  object edtServerIP: TEdit
    Left = 82
    Top = 42
    Width = 124
    Height = 21
    TabOrder = 0
    Text = '192.168.1.103'
  end
  object edtGroupName: TEdit
    Left = 82
    Top = 15
    Width = 124
    Height = 21
    TabOrder = 1
  end
  object btnSave: TButton
    Left = 121
    Top = 180
    Width = 50
    Height = 25
    Caption = #20445#23384
    TabOrder = 2
    OnClick = btnSaveClick
  end
  object btnClose: TButton
    Left = 173
    Top = 180
    Width = 50
    Height = 25
    Caption = #36864#20986
    ModalResult = 2
    TabOrder = 3
  end
  object edtServerPort: TSpinEdit
    Left = 82
    Top = 69
    Width = 124
    Height = 22
    MaxValue = 65535
    MinValue = 1024
    TabOrder = 4
    Value = 5173
  end
  object chkSync: TCheckBox
    Left = 82
    Top = 98
    Width = 97
    Height = 17
    Caption = #21516#27493#36890#35759#26041#24335
    Checked = True
    State = cbChecked
    TabOrder = 5
  end
  object cmbBaudRate: TComboBox
    Left = 82
    Top = 131
    Width = 124
    Height = 21
    Style = csDropDownList
    ItemIndex = 0
    TabOrder = 6
    Text = '9600'
    Items.Strings = (
      '9600'
      '115200')
  end
end
