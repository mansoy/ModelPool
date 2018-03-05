object FrmMain: TFrmMain
  Left = 0
  Top = 0
  Caption = #29483#27744#32452#31243#24207
  ClientHeight = 265
  ClientWidth = 611
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  Position = poScreenCenter
  OnCreate = FormCreate
  OnDestroy = FormDestroy
  PixelsPerInch = 96
  TextHeight = 13
  object memLog: TMemo
    Left = 0
    Top = 0
    Width = 514
    Height = 246
    Align = alClient
    Lines.Strings = (
      'memLog')
    ScrollBars = ssBoth
    TabOrder = 0
  end
  object StatusBar1: TStatusBar
    Left = 0
    Top = 246
    Width = 611
    Height = 19
    Panels = <
      item
        Width = 170
      end
      item
        Width = 150
      end>
  end
  object Panel1: TPanel
    Left = 514
    Top = 0
    Width = 97
    Height = 246
    Align = alRight
    BevelInner = bvLowered
    TabOrder = 2
    DesignSize = (
      97
      246)
    object btnServerConn: TButton
      Left = 12
      Top = 172
      Width = 75
      Height = 25
      Anchors = [akLeft, akBottom]
      Caption = #36830#25509
      TabOrder = 0
      OnClick = btnServerConnClick
    end
    object btnServerDisconn: TButton
      Left = 12
      Top = 203
      Width = 75
      Height = 25
      Anchors = [akLeft, akBottom]
      Caption = #26029#24320
      TabOrder = 1
      OnClick = btnServerDisconnClick
    end
    object btnConfig: TButton
      Left = 12
      Top = 6
      Width = 75
      Height = 25
      Caption = #37197#32622
      TabOrder = 2
      OnClick = btnConfigClick
    end
    object btnTest: TButton
      Left = 12
      Top = 37
      Width = 75
      Height = 25
      Caption = #27979#35797
      TabOrder = 3
      OnClick = btnTestClick
    end
  end
end
