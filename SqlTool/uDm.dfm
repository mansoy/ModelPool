object dm: Tdm
  OldCreateOrder = False
  Height = 204
  Width = 345
  object conn: TADOConnection
    LoginPrompt = False
    Left = 40
    Top = 32
  end
  object qry: TADOQuery
    Connection = conn
    Parameters = <>
    Left = 88
    Top = 32
  end
  object qryComInfo: TADOQuery
    Connection = conn
    Parameters = <>
    Left = 144
    Top = 32
  end
end
