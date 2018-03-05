unit uData;

interface

uses
  Winapi.Windows, Winapi.Messages, Winapi.ShellAPI, Vcl.FileCtrl, System.SysUtils;

const
  WM_ADD_LOG  = WM_USER + 1001;
  WM_SEND_RET = WM_USER + 1002;
  //
  DIGIT_DICT = 'QuitSafeConfig\DigitDict.txt';
  SYS_DICT   = 'QuitSafeConfig\SysDict.txt';
  SAFE_CODE  = 'sTnItrFttpcWUASfy0x1Vy94obcrWqJe';
  KEMULATOR_DIR_OLD = '%s\手机模拟器';
  KEMULATOR_CFG_OLD = '%s\手机模拟器\property.txt';
  TOKEN_DIR_OLD     = '%s\手机模拟器\rms\SonyEricssonK800_240x320\.token_config';

  KEMULATOR_DIR_NEW = '%s\手机模拟器-New';
  KEMULATOR_CFG_NEW = '%s\手机模拟器-New\property.txt';
  TOKEN_DIR_NEW     = '%s\手机模拟器-New\rms\SonyEricssonK800_240x320\.token_config';

  TOKEN_SRC_ZIP_FILE  = '%s\令牌文件\%s.zip';
  TOKEN_SRC_DIR       = '%s\令牌文件\%s';
  KEMULATOR_BAT = 'KEmulator.bat';
  //
  FLAG_NONE = 0;
  FLAG_SEND = 1; //'正在发短信';
  FLAG_RECV = 2; //'正在收短信';

type
  Tdm2 = record
    account : string;
    password: string;
    use     : Boolean;
  end;
  TDama2Ret = record
    text: string;
    code: Integer;
  end;

var
  GMainHandle: Hwnd;
  dm2: Tdm2;
  GAppPath: string;

implementation

end.
