object FrmMain: TFrmMain
  Left = 687
  Top = 272
  BorderIcons = [biSystemMenu, biMinimize]
  BorderStyle = bsSingle
  Caption = 'Echo Server [ '#39'C'#39' - clear list box ]'
  ClientHeight = 329
  ClientWidth = 457
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  OnClose = FormClose
  OnCreate = FormCreate
  PixelsPerInch = 96
  TextHeight = 13
  object lbl1: TLabel
    Left = 130
    Top = 308
    Width = 40
    Height = 13
    Caption = 'CONNID'
  end
  object lstMsg: TListBox
    Left = 1
    Top = 0
    Width = 457
    Height = 298
    ItemHeight = 13
    TabOrder = 0
    OnKeyPress = lstMsgKeyPress
  end
  object edtIpAddress: TEdit
    Left = 1
    Top = 304
    Width = 121
    Height = 21
    TabOrder = 1
    Text = '0.0.0.0'
  end
  object edtConnId: TEdit
    Left = 176
    Top = 304
    Width = 48
    Height = 21
    TabOrder = 2
    OnChange = edtConnIdChange
  end
  object btnDisConn: TButton
    Left = 230
    Top = 303
    Width = 57
    Height = 23
    Caption = 'Dis Conn'
    TabOrder = 3
    OnClick = btnDisConnClick
  end
  object btnStart: TButton
    Left = 336
    Top = 304
    Width = 57
    Height = 23
    Caption = 'Start'
    TabOrder = 4
    OnClick = btnStartClick
  end
  object btnStop: TButton
    Left = 398
    Top = 304
    Width = 57
    Height = 23
    Caption = 'Stop'
    TabOrder = 5
    OnClick = btnStopClick
  end
end
