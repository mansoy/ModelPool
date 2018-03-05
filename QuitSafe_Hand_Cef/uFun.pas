unit uFun;

interface

uses
  Winapi.Windows, Winapi.ShellAPI, Vcl.FileCtrl, System.SysUtils, System.Zip,
  Winapi.PsAPI, Winapi.ShlObj, System.IniFiles,
  Vcl.Graphics, Vcl.Imaging.jpeg,
  Winapi.GDIPAPI, Winapi.GDIPOBJ, WinApi.ActiveX,
  uData,
  ManSoy.Global,
  Dm_TLB;

type
  TDmFindRet = record
    X: Integer;
    Y: Integer;
    Ret: Integer;
  end;

  TDmUtils = class
  private
    FSysCfgFile: string;
    FDm: Idmsoft;
    FDmHandle: THandle;
    function CreateDmComObject(CLSID: TGUID): Idmsoft;
  public
    constructor Create;
    destructor Destroy; override;

    function Init: Boolean;

    function GetPath(FID: Integer): string;
    function GetAppdataPath: string;

    procedure BeginVMP; stdcall;
    procedure EndVMP; stdcall;
    procedure SetWindowFront(hWindow: HWND);
    function BindWindow(hWnd: HWND): Boolean;
    function UnBindWindow: Boolean;
    function FindPicExistOnWindowArea(hWindow: HWND; x1, y1, x2, y2: Integer; AImgName: string; ARatio: Single = 1.0; ADealy: Cardinal = 1): Boolean;
    function FindWordOnWindow(hWnd: HWND; AText, AColorCast, ADict: string; ARation: Single; ADealy: Cardinal): TPoint;
    function FindWordByColor(hWnd: HWND; x1, y1, x2, y2: Integer; AColorCast: string; ADict: string; ARatio: Single; ADealy: Cardinal): string;

  end;

  procedure LogToFile(aText: string);
  procedure Unzip(srcFile, destDir: string);

  function DelDir(const Source: string): Boolean;
  function ClearDir(const DirName: string; IncludeSub: Boolean = True; ToRecyle: Boolean = false): Boolean;
  function CopyDir(const srcDir, destDir: string; includeDir: boolean = true): boolean;

  procedure LogOut(aText: string; const Args: array of const; aDebug: Boolean = false);

implementation

{将信息写入日志文件}
procedure LogToFile(aText: string);
var
  f: TextFile;
  dir, fileName: string;
begin
  dir := ExtractFilePath(ParamStr(0))+'Log\';
  if not DirectoryExists(dir) then ForceDirectories(dir);
  fileName := dir+FormatDateTime('yyyyMMdd',Now)+'.log';
  try
    try
      AssignFile(F, fileName); {将文件名与变量 F 关联}
      if FileExists(fileName) then
        Append(f) //文件存在，则以追加方式打开
      else
        Rewrite(f); //文件不存在，则创建并打开

      Writeln(F, aText); //在文件末尾添加文字
      //Flush(f); //清空缓冲区，确保字符串已经写入文件之中
    except
    end;
  finally
    CloseFile(f);
  end;
end;

{删除目录}
function DelDir(const Source: string): Boolean;
var
  fo: TSHFileOpStruct;
begin
  try
    FillChar(fo, SizeOf(fo), 0);
    with fo do
    begin
      Wnd := 0;
      wFunc := FO_DELETE;
      pFrom := PChar(Source + #0);
      pTo := #0#0;
      fFlags := FOF_NOCONFIRMATION + FOF_SILENT;
    end;
    Result := (SHFileOperation(fo) = 0);
  except
  end;
end;

{清除目录下的内容}
function ClearDir(const DirName: string; IncludeSub: Boolean; ToRecyle: Boolean): Boolean;
var
  fo: TSHFILEOPSTRUCT;
begin
  try
    FillChar(fo, SizeOf(fo), 0);
    with fo do
    begin
      Wnd := 0;
      wFunc := FO_DELETE;
      pFrom := PChar(DirName + '\*.*' + #0);
      pTo := #0#0;
      fFlags := FOF_SILENT or FOF_NOCONFIRMATION or FOF_NOERRORUI
        or (Ord(not IncludeSub) * FOF_FILESONLY);
      if ToRecyle then
        fFlags := fFlags or FOF_ALLOWUNDO;
    end;
    Result := (SHFileOperation(fo) = 0);
  except
  end;
end;

//把一个目录拷贝到另一个目录
function CopyDir(const srcDir, destDir: string; includeDir: boolean): boolean;
var
  fo: TSHFILEOPSTRUCT;
begin
  Result := False;
  if not DirectoryExists(srcDir) then Exit;
  try
    FillChar(fo, SizeOf(fo), 0);
    with fo do
    begin
      Wnd := 0;
      wFunc := FO_COPY;
      if includeDir then
        pFrom := PChar(srcDir+#0)
      else
        pFrom := PChar(srcDir + '\*.*' + #0);
      pTo := PChar(destDir+#0);
      fFlags := FOF_NOCONFIRMATION or FOF_NOCONFIRMMKDIR;
    end;
    Result := (SHFileOperation(fo) = 0);
  except
  end;
end;

procedure Unzip(srcFile, destDir: string);
var
  zip: TZipFile;
begin
  zip := TZipFile.Create;
  zip.Open(srcFile, TZipMode.zmRead);
  zip.ExtractAll(destDir);
  zip.Close;
  zip.Free;
end;

procedure LogOut(aText: string; const Args: array of const; aDebug: Boolean);
var
  sMsg: string;
begin
  //sMsg := System.SysUtils.Format(aText, Args, FormatSettings);
  //sMsg := '['+FormatDateTime('yyyy-MM-dd HH:mm:ss', Now)+']'+sMsg;
  //{$IFDEF DEBUG}
  //SendMessage(GMainHandle, WM_ADD_LOG, 0, LPARAM(sMsg));
  //{$ENDIF}
  //LogToFile(sMsg);
end;


{ TDmUtils }

procedure TDmUtils.BeginVMP;
begin
  asm
  {$IFDEF _VMP}
  db $EB,$10,'VMProtect begin',0       //标记开始处.
  {$ENDIF}
  end;
end;

procedure TDmUtils.EndVMP;
begin
  asm
  {$IFDEF _VMP}
  db $EB,$0E,'VMProtect end',0       //标记结束处.
  {$ENDIF}
  end;
end;

constructor TDmUtils.Create;
begin
  inherited;
  FDm := CreateDmComObject(CLASS_dmsoft);
  Init;
end;

function TDmUtils.CreateDmComObject(CLSID: TGUID): Idmsoft;
var
  Factory: IClassFactory;
  DllGetClassObject: function(const CLSID, IID: TGUID; var Obj): HResult; stdcall;
  hr: HRESULT;
  AppPath: string;
begin
  Result := nil;
  EnabledDebugPrivilege();
  FDmHandle := LoadLibrary(PWideChar(GAppPath + 'dm.dll'));

  if FDmHandle < 32 then Exit;
  try
    DllGetClassObject := GetProcAddress(FDmHandle, 'DllGetClassObject');

    if Assigned(DllGetClassObject) then
    begin
      hr := DllGetClassObject(CLSID, IClassFactory, Factory);
      if hr = S_OK then
      try
        hr := Factory.CreateInstance(nil, IUnknown, Result);
        if hr = S_OK then
        begin
          //MessageBox(0, '大漠组件加载成功', 0, 0);
        end;
      except
      end;
    end;
  finally
    //FreeLibrary(vHandle);
  end;
end;

destructor TDmUtils.Destroy;
begin
  //
  inherited;
end;

function TDmUtils.FindPicExistOnWindowArea(hWindow: HWND; x1, y1, x2,
  y2: Integer; AImgName: string; ARatio: Single; ADealy: Cardinal): Boolean;
var
  intX, intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
  vRect: TRect;
begin
  BeginVMP;
  Result := False;
  iRet := -1;
  try
    try
      Winapi.Windows.GetClientRect(hWindow, vRect);
      x1 := x1 + vRect.Left;
      y1 := y1 + vRect.Top;
      x2 := x2 + vRect.Left;
      y2 := y2 + vRect.Top;
      dwDealyTimes := GetTickCount;
      while GetTickCount - dwDealyTimes < ADealy * 1000 do
      begin
        if not IsWindow(hWindow) then
        begin
          iRet := -1;
          Break;
        end;
        if IsWindowVisible(hWindow) then
        begin
          SetWindowFront(hWindow);
          iRet := FDm.FindPic(x1, y1, x2, y2, Format('%sBmp\%s', [GAppPath, AImgName]), '000000', ARatio, 0, intX, intY);
          if iRet <> -1 then
            Break;
        end;
        Sleep(100);
      end;
      if iRet = -1 then
      begin
        Result := False;
        Exit;
      end;
      Result := True;
    finally
    end;
  except
  end;
  EndVMP;
end;

//窗口内找字(返回窗口相对坐标)
function TDmUtils.FindWordOnWindow(hWnd: HWND; AText, AColorCast, ADict: string; ARation: Single; ADealy: Cardinal): TPoint;
var
  x1, y1, x2, y2, intX, intY: OleVariant;
  dwDealyTimes: DWORD;
  iRet: Integer;
begin
  Result.X := -1; Result.Y := -1;
  try
    FDm.SetDict(0, GAppPath + '\'+ADict);
    iRet := -1;
    dwDealyTimes := GetTickCount;
    while GetTickCount - dwDealyTimes < ADealy * 1000 do begin
      if not IsWindow(hWnd) then begin iRet := -1; Break; end;
      if IsWindowVisible(hWnd) then begin
        FDm.GetClientRect(hWnd, x1, y1, x2, y2);
        SetWindowFront(hWnd);
        iRet := FDm.FindStrFast(x1, y1, x2, y2, AText, AColorCast, ARation, intX, intY);
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

function TDmUtils.FindWordByColor(hWnd: HWND; x1, y1, x2, y2: Integer; AColorCast: string; ADict: string; ARatio: Single; ADealy: Cardinal): string;
var
  dwDealyTimes: DWORD;
begin
  Result := '';
  FDm.SetDict(0, ADict);
  try
    try
      BindWindow(hWnd);
      if FDm.SetDict(0, GAppPath + '\'+ADict) = 0 then Exit;
      dwDealyTimes := GetTickCount;
      while GetTickCount - dwDealyTimes < ADealy * 1000 do
      begin
        if not IsWindow(hWnd) then Exit;
        if IsWindowVisible(hWnd) then
        begin
          SetWindowFront(hWnd);
          Result := FDm.Ocr(x1, y1, x2, y2, AColorCast, ARatio);
          if Result <> '' then Break;
        end;
        Sleep(100);
      end;
    finally
      UnBindWindow;
    end;
  except
  end;
end;

//绑定窗口
function TDmUtils.BindWindow(hWnd: HWND): Boolean;
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

    iRet := FDm.BindWindow(hWnd, 'normal', 'normal', 'windows', 0);
  except on E: Exception do
    //AddLogMsg('绑定游戏窗口时失败：%s', [e.Message]);
  end;
  Result := iRet = 1;
end;

//解除窗口绑定
function TDmUtils.UnBindWindow: Boolean;
var
  iRet: Integer;
begin
  iRet := 0;
  try
    iRet := FDm.UnBindWindow;
  except
  end;
  Result := iRet = 1;
end;

function TDmUtils.GetAppdataPath: string;
begin
  Result := 'C:\';
  Result := GetPath(CSIDL_APPDATA);
end;

function TDmUtils.GetPath(FID: Integer): string;
var
  pidl: PItemIDList;
  path: array[0..MAX_PATH] of Char;
begin
  SHGetSpecialFolderLocation(0, FID, pidl);
  SHGetPathFromIDList(pidl, path);
  Result := path;
  //if Result[Length(Result)] <> '\' then
  //  Result := Result + '\';
end;

function TDmUtils.Init: Boolean;
var
  path:string;
  stmp:string;
begin
  path := GetAppdataPath;

  with TIniFile.Create(Format('%s\TradeClient\LocalCfg.ini', [path])) do
  try
    try
      GAppPath := ReadString('设置', '发货机路径', '');
      stmp := Copy(GAppPath, Length(GAppPath), 1);
      if (stmp = '\') then
        GAppPath := Copy(GAppPath, 1, Length(GAppPath) - 1);
    finally
      Free;
    end;
  except
  end;
  FDm.SetPath(GAppPath);
  //DIGIT_DICT  SYS_DICT
  FDm.SetDict(0, GAppPath+'\'+DIGIT_DICT);
  //FSysCfgFile := Format('%sConfig\SysCfg.ini', [GAppPath]);
end;

procedure TDmUtils.SetWindowFront(hWindow: HWND);
begin
  BeginVMP;
  ShowWindow(hWindow, SW_RESTORE);
  Sleep(100);
  SetForegroundWindow(hWindow);
  Sleep(100);
  EndVMP;
end;

end.
