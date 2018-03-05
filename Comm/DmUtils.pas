unit DmUtils;

interface

uses
  Winapi.Windows, System.Classes, System.SysUtils, Winapi.Messages, Vcl.Graphics,
  Vcl.StdCtrls, System.Variants, System.Win.ComObj, Winapi.ActiveX, Winapi.TlHelp32,
  Dm_TLB, Vcl.Controls, Vcl.ComCtrls, Vcl.Forms, mansoy.global;

  function RegisterOleFile(strOleFileName: string ): Boolean;

  function fnBindWindow(hWnd: HWND): Boolean;
  function fnUnBindWindow: Boolean;

  function fnFindPicOnScreen(AImgName: string; ARatio: Single = 0.8; ADealy: Cardinal = 1): TPoint;
  function fnFindPicOnWindow(hWnd: HWND; AImgName: string; ARatio: Single = 0.8; ADealy: Cardinal = 1): TPoint;
  function fnFindPicOnWindowArea(hWnd: HWND; x1, y1, x2, y2: Integer; AImgName: string; ARatio: Single = 0.8; ADealy: Cardinal = 1): TPoint;
  function fnPicExistOnWindow(hWnd: HWND; AImgName: string; ARatio: Single = 0.8; ADealy: Cardinal = 1): Boolean;
  function fnPicExistOnWindowArea(hWnd: HWND; x1, y1, x2, y2: Integer; AImgName: string; ARatio: Single = 0.6; ADealy: Cardinal = 1): Boolean;
  function fnFindWordOnWindow(hWnd: HWND; AText, AColorCast, ADict: string; ARation: Single = 0.8; ADealy: Cardinal = 1): TPoint;
  function fnFindWordOnWindowRect(hWnd: HWND; x1, y1, x2, y2: Integer; AText, AColorCast, ADict: string; ARation: Single = 0.8; ADealy: Cardinal = 1): TPoint;
  function fnFindWordByColor(hWnd: HWND; x1, y1, x2, y2: Integer; AColorCast: string; ADict: string; ARatio: Single = 0.8; ADealy: Cardinal = 1): string;

  procedure proSetForeground(hWnd: HWND);
  procedure proKeyPress(hWnd: HWND; AKey: ShortInt; ATimes: DWORD = 1);
  procedure proLeftClick(hWnd: HWND; AX, AY: Integer; ABind: Boolean = True);
  procedure proLeftDoubleClick(hWnd: HWND; AX, AY: Integer; ATimes: Integer = 1);
  procedure SwitchToThisWindow(hWnd: Thandle; fAltTab: Boolean); stdcall; external 'User32.dll';

var
  dm: Idmsoft;

implementation

//注册COM组件
function RegisterOleFile (strOleFileName: string ): Boolean;
const
  RegisterOle = 1;//注册
  UnRegisterOle = 0;//卸载

type
  TOleRegisterFunction = function : HResult;//注册或卸载函数的原型

var
  hLibraryHandle : THandle;//由LoadLibrary返回的DLL或OCX句柄
  hFunctionAddress: TFarProc;//DLL或OCX中的函数句柄，由GetProcAddress返回
  RegFunction : TOleRegisterFunction;//注册或卸载函数指针
begin
  Result := False;

  mansoy.Global.EnabledDebugPrivilege();

  //打开OLE/DCOM文件，返回的DLL或OCX句柄
  hLibraryHandle := LoadLibrary(PCHAR(strOleFileName));
  if (hLibraryHandle > 0) then //DLL或OCX句柄正确
  try
    //返回注册函数的指针
    hFunctionAddress := GetProcAddress(hLibraryHandle, pchar('DllRegisterServer'));
    if (hFunctionAddress <> NIL) then//注册函数存在
    begin
      RegFunction := TOleRegisterFunction(hFunctionAddress);//获取操作函数的指针
      if RegFunction >= 0 then //执行注册或卸载操作，返回值>=0表示执行成功
        result := true;
    end
    else
      MessageBox(0, '没找到DLL的接口DllRegisterServer!','提示信息',64)
  finally
    FreeLibrary(hLibraryHandle); //关闭已打开的OLE/DCOM文件
  end;
end;

//前置窗口
procedure proSetForeground(hWnd: HWND);
begin
  SwitchToThisWindow(hWnd, True);
  //Sleep(100);
end;

//绑定窗口
function fnBindWindow(hWnd: HWND): Boolean;
var
  dwTimes: DWORD;
  iRet: Integer;
begin
  try
    if not IsWindow(hWnd) then Exit;
    dwTimes := 0;
    while not IsWindowVisible(hWnd) do begin
      if dwTimes >= 1000 then Break;
      Sleep(100);
      Inc(dwTimes);
    end;

    iRet := dm.BindWindow(hWnd, 'normal', 'normal', 'windows', 0);
  except on E: Exception do
    //AddLogMsg('绑定游戏窗口时失败：%s', [e.Message]);
  end;
  Result := iRet = 1;
end;

//解除窗口绑定
function fnUnBindWindow: Boolean;
var
  iRet: Integer;
begin
  iRet := 0;
  try
    iRet := dm.UnBindWindow;
  except on E: Exception do
    //AddLogMsg('解绑游戏窗口时失败：%s', [e.Message]);
  end;
  Result := iRet = 1;
end;

//在窗口上击键
procedure proKeyPress(hWnd: HWND; AKey: ShortInt; ATimes: DWORD);
var
  I: Integer;
begin
  try
    //fnBindWindow(hWnd);
    for I := 0 to ATimes - 1 do begin
      //if GetForegroundWindow <> hWnd then
      //proSetForeground(hWnd);
      Sleep(10);
      dm.KeyPress(AKey);
    end;
    //fnUnBindWindow;
  except
    //fnUnBindWindow;
  end;
end;

//鼠标左击
procedure proLeftClick(hWnd: HWND; AX, AY: Integer; ABind: Boolean);
var
  vRect: TRect;
begin
  try
    if ABind then
    begin
      GetClientRect(hWnd, vRect);
      AX := vRect.Left + AX;
      AY := vRect.Top + AY;
    end;
    if IsWindow(hWnd) then
    begin
      if GetForegroundWindow <> hWnd then
        proSetForeground(hWnd);
    end;
    dm.MoveTo(AX, AY);
    Sleep(100);
    dm.LeftClick;
    Sleep(50);
    dm.MoveTo(5, 5);
  except
  end;
end;

//鼠标双击
procedure proLeftDoubleClick(hWnd: HWND; AX, AY: Integer; ATimes: Integer);
var
  I: Integer;
begin
  try
    fnBindWindow(hWnd);
    if GetForegroundWindow <> hWnd then
      proSetForeground(hWnd);

    dm.MoveTo(AX, AY);
    for I := 0 to ATimes - 1 do
    begin
      Sleep(100);
      dm.LeftDoubleClick;
      Sleep(100);
    end;
    dm.MoveTo(5, 5);
    fnUnBindWindow;
  except
    fnUnBindWindow;
  end;
end;

//窗口内查找图片(返回窗口相对坐标)
function fnFindPicOnWindow(hWnd: HWND; AImgName: string; ARatio: Single; ADealy: Cardinal): TPoint;
var
  x1, y1, x2, y2, intX,intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
begin
  Result.X := -1; Result.Y := -1;
  iRet := -1;
  try
    try
      dwDealyTimes := GetTickCount;
      while GetTickCount - dwDealyTimes < ADealy * 1000 do
      begin
        if not IsWindow(hWnd) then
        begin
          iRet := -1;
          Break;
        end;
        if IsWindowVisible(hWnd) then
        begin
          proSetForeground(hWnd);
          dm.GetClientRect(hWnd, x1, y1, x2, y2);
          iRet := dm.FindPic(x1, y1, x2, y2, AImgName, '000000', ARatio, 0, intX, intY);
          if iRet = 0 then
          begin
            Result.X := Integer(intX) - x1;
            Result.Y := Integer(intY) - y1;
            Break;
          end;
        end;
        Sleep(100);
      end;
      if iRet = -1 then Exit;
    finally
    end;
  except
  end;
end;

//窗口指定区域内查找图片(返回窗口相对坐标)
function fnFindPicOnWindowArea(hWnd: HWND; x1, y1, x2, y2: Integer; AImgName: string; ARatio: Single; ADealy: Cardinal): TPoint;
var
  intX,intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
begin
  Result.X := -1; Result.Y := -1;
  iRet := -1;
  try
    dwDealyTimes := GetTickCount;
    while GetTickCount - dwDealyTimes < ADealy * 1000 do begin
      if not IsWindow(hWnd) then Break;
      if IsWindowVisible(hWnd) then begin
        proSetForeground(hWnd);
        Sleep(100);
        iRet := dm.FindPic(x1, y1, x2, y2, AImgName, '000000', ARatio, 0, intX,intY);
        if iRet <> -1 then Break;
      end;
      Sleep(100);
    end;
    if iRet = -1 then Exit;
    Result.X := Integer(intX) - x1;
    Result.Y := Integer(IntY) - y1;
  except
  end;
end;

function fnPicExistOnWindowArea(hWnd: HWND; x1, y1, x2, y2: Integer; AImgName: string; ARatio: Single; ADealy: Cardinal): Boolean;
var
  intX,intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
begin
  Result := False;
  iRet := -1;
  try
    //dwDealyTimes := GetTickCount;
    //while GetTickCount - dwDealyTimes < ADealy * 1000 do begin
    if not IsWindow(hWnd) then Exit;
    if not IsWindowVisible(hWnd) then Exit;
    proSetForeground(hWnd);
    iRet := dm.FindPic(x1, y1, x2, y2, AImgName, '000000', ARatio, 0, intX,intY);
    Result := iRet <> -1;
    if Result then Exit;
    //end;
  except
  end;
end;

//全屏查找图片(返回屏幕相对坐标)
function fnFindPicOnScreen(AImgName: string; ARatio: Single; ADealy: Cardinal): TPoint;
var
  intX,intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
begin
  Result.X := -1; Result.Y := -1;
  iRet := -1;
  try
    try
      dwDealyTimes := GetTickCount;
      while GetTickCount - dwDealyTimes < ADealy * 1000 do
      begin
        iRet := dm.FindPic(0, 0, 2000, 2000, AImgName, '000000', ARatio, 0, intX, intY);
        if iRet = 0 then begin
          Result.X := Integer(intX);
          Result.Y := Integer(intY);
          Break;
        end;
        Sleep(100);
      end;
      if iRet = -1 then Exit;
    finally
    end;
  except
  end;
end;

//窗口内查找图片(返回true/false)
function fnPicExistOnWindow(hWnd: HWND; AImgName: string; ARatio: Single; ADealy: Cardinal): Boolean;
var
  x1, y1, x2, y2, intX,intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
begin
  Result := False;
  iRet := -1;
  try
      dwDealyTimes := GetTickCount;
      while GetTickCount - dwDealyTimes < ADealy * 1000 do begin
        if not IsWindow(hWnd) then Break;
        if IsWindowVisible(hWnd) then begin
          proSetForeground(hWnd);
          Sleep(100);
          dm.GetClientRect(hWnd, x1, y1, x2, y2);
          iRet := dm.FindPic(x1, y1, x2, y2, AImgName, '000000', ARatio, 0, intX,intY);
          if iRet = 0 then Break;
        end;
        Sleep(100);
      end;
      Result := iRet <> -1;
  except
  end;
end;

//窗口内找字(返回窗口相对坐标)
function fnFindWordOnWindow(hWnd: HWND; AText, AColorCast, ADict: string; ARation: Single; ADealy: Cardinal): TPoint;
var
  x1, y1, x2, y2, intX, intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
begin
  Result.X := -1; Result.Y := -1;
  try
    dm.SetDict(0, ADict);
    iRet := -1;
    dwDealyTimes := GetTickCount;
    while GetTickCount - dwDealyTimes < ADealy * 1000 do begin
      if not IsWindow(hWnd) then begin iRet := -1; Break; end;
      if IsWindowVisible(hWnd) then begin
        dm.GetClientRect(hWnd, x1, y1, x2, y2);
        proSetForeground(hWnd);
        iRet := dm.FindStrFast(x1, y1, x2, y2, AText, AColorCast, ARation, intX, intY);
        if iRet <> -1 then Break;
      end;
      Sleep(300);
    end;
    if iRet = -1 then Exit;
    Result.X := Integer(intX) - x1;
    Result.Y := Integer(IntY) - y1;
  except
  end;
end;

//窗口内找字(返回true/false)
function fnWordExistOnWindow(hWnd: HWND; AText, AColorCast, ADict: string; ARation: Single; ADealy: Cardinal): Boolean;
var
  pt: TPoint;
begin
  pt := fnFindWordOnWindow(hWnd, AText, AColorCast, ADict, ARation, ADealy);
  Result := (pt.X <> -1) and (pt.Y <> -1);
end;

function fnFindWordOnWindowRect(hWnd: HWND; x1, y1, x2, y2: Integer; AText, AColorCast, ADict: string; ARation: Single = 0.8; ADealy: Cardinal = 1): TPoint;
var
  dwDealyTimes: DWORD;
  iRet: Integer;
  intX, intY: OleVariant;
begin
  Result.X := -1; Result.Y := -1;
  try
    iRet := -1;
    dm.SetDict(0, ADict);
    try
      fnBindWindow(hWnd);
      dwDealyTimes := GetTickCount;
      while GetTickCount - dwDealyTimes < ADealy * 1000 do
      begin
        if not IsWindow(hWnd) then
        begin
          iRet := -1;
          Break;
        end;
        if IsWindowVisible(hWnd) then
        begin
          proSetForeground(hWnd);
          iRet := dm.FindStrFast(x1, y1, x2, y2, AText, AColorCast, ARation, intX, intY);
          if iRet <> -1 then Break;
        end;
        Sleep(300);
      end;
      if iRet = -1 then Exit;
      Result.X := Integer(intX);
      Result.Y := Integer(IntY);
    finally
      fnUnBindWindow;
    end;
  except
  end;
end;

function fnFindWordByColor(hWnd: HWND; x1, y1, x2, y2: Integer; AColorCast: string; ADict: string; ARatio: Single; ADealy: Cardinal): string;
var
  dwDealyTimes: DWORD;
begin
  Result := '';
  dm.SetDict(0, ADict);
  try
    try
      fnBindWindow(hWnd);
      if dm.SetDict(0, ADict) = 0 then Exit;
      dwDealyTimes := GetTickCount;
      while GetTickCount - dwDealyTimes < ADealy * 1000 do
      begin
        if not IsWindow(hWnd) then Exit;
        if IsWindowVisible(hWnd) then
        begin
          proSetForeground(hWnd);
          Result := dm.Ocr(x1, y1, x2, y2, AColorCast, ARatio);
          if Result <> '' then Break;
        end;
        Sleep(100);
      end;
    finally
      fnUnBindWindow;
    end;
  except
  end;
end;

initialization
  CoInitialize(nil);
  if not RegisterOleFile(ExtractFilePath(ParamStr(0)) + 'dm.dll') then
  begin
    MessageBox(0, '大漠插件加载失败!','提示信息', 64);
    Application.Terminate;
  end;
  dm := Codmsoft.Create;
  dm.SetPath(ExtractFilePath(ParamStr(0)));

finalization
  CoUnInitialize;
end.
