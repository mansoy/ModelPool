object FrmMain: TFrmMain
  Left = 687
  Top = 272
  BorderIcons = [biSystemMenu, biMinimize]
  BorderStyle = bsSingle
  Caption = #29483#27744#20013#38388#26381#21153#22120
  ClientHeight = 452
  ClientWidth = 500
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  OnCloseQuery = FormCloseQuery
  OnCreate = FormCreate
  OnDestroy = FormDestroy
  PixelsPerInch = 96
  TextHeight = 13
  object Panel1: TPanel
    Left = 0
    Top = 0
    Width = 500
    Height = 49
    Align = alTop
    TabOrder = 0
    DesignSize = (
      500
      49)
    object btnStop: TButton
      Left = 424
      Top = 14
      Width = 57
      Height = 23
      Anchors = [akTop, akRight]
      Caption = #20572#27490
      TabOrder = 0
      OnClick = btnStopClick
    end
    object btnStart: TButton
      Left = 362
      Top = 14
      Width = 57
      Height = 23
      Anchors = [akTop, akRight]
      Caption = #24320#21551
      TabOrder = 1
      OnClick = btnStartClick
    end
    object btnDisConn: TButton
      Left = 299
      Top = 14
      Width = 57
      Height = 23
      Anchors = [akTop, akRight]
      Caption = #26029#24320#36830#25509
      TabOrder = 2
      OnClick = btnDisConnClick
    end
    object btnConfig: TButton
      Left = 16
      Top = 13
      Width = 75
      Height = 25
      Caption = #22522#26412#37197#32622
      TabOrder = 3
      OnClick = btnConfigClick
    end
  end
  object GroupBox1: TGroupBox
    Left = 0
    Top = 49
    Width = 500
    Height = 274
    Align = alClient
    Caption = #24050#36830#25509#35774#22791#21015#34920
    TabOrder = 1
    object LstDevices: TListView
      Left = 2
      Top = 15
      Width = 496
      Height = 257
      Align = alClient
      Columns = <
        item
          Caption = #35774#22791#26631#35782#31526
          Width = 120
        end
        item
          Caption = #20998#32452#21517#31216
          Width = 100
        end
        item
          Caption = #35774#22791'IP'
          Width = 120
        end
        item
          Caption = #35774#22791#31471#21475
          Width = 100
        end>
      GridLines = True
      ReadOnly = True
      RowSelect = True
      TabOrder = 0
      ViewStyle = vsReport
      OnChange = LstDevicesChange
    end
  end
  object GroupBox2: TGroupBox
    Left = 0
    Top = 323
    Width = 500
    Height = 129
    Align = alBottom
    Caption = #26085#24535
    TabOrder = 2
    object lstMsg: TListBox
      Left = 2
      Top = 15
      Width = 496
      Height = 112
      Align = alClient
      ItemHeight = 13
      TabOrder = 0
      OnKeyPress = lstMsgKeyPress
    end
  end
end
