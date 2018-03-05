unit ManSoy.Base64;

//delphi7中EncdDecd单元EncodeString函数好像也是base64编码函数

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  EncdDecd;
  //IdGlobal,Dialogs, StdCtrls;


function StrToBase64(const str: string): string;
function Base64ToStr(const Base64: AnsiString): AnsiString;


implementation

function StrToBase64(const str: string): string;
var
  s:AnsiString;
begin
  s := AnsiString(str);
  Result := string(EncdDecd.EncodeBase64(PAnsiChar(s), Length(s)));
  Result := StringReplace(Result, #13#10, '', [rfReplaceAll]);//去掉回车换行,因为有些系统不支持
end;

function Base64ToStr(const Base64: AnsiString): AnsiString;
var
  vBuf:TBytes;
begin
  vBuf := EncdDecd.DecodeBase64(Base64);
  SetLength(Result, Length(vBuf));
  CopyMemory(PAnsiChar(Result), @vBuf[0], Length(vBuf));
end;

end.
