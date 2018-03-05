unit uPublic;

interface

uses Windows, Messages;

type
  TCommType = (
    ctNone,             //--无类型
    ctResult,           //--返回结果
    ctGroupName,        //--设备端告诉中间服自己的组标识
    ctSendMsg,          //--发送短信
    ctRecvMsg           //--接收短信，设备端收到短信后返回给服务端
    );

  //--处理结果
  TResultState = (
    rsSuccess,          //--成功
    rsFail              //--失败
  );

  //--记录设备链接信息
  PDeviceInfo = ^TDeviceInfo;
  TDeviceInfo = record
    IsDevice: Boolean;      //--标识是设备端， 还是客户端，
    ConnectID: DWORD;       //--Socket
    GroupName: string[50];
    IP: string[20];
    Port: Word;
  end;

//  //--设置分组标识
//  PGroupData = ^TGroupData;
//  TGroupData = packed record
//    CommType : TCommType;
//    GroupName: TGroupName;
//  end;

var
  GFrmMainHwnd: HWND;

const
  WM_ADD_LOG    = WM_USER + 1001;
  WM_ADD_DEVICE = WM_USER + 1002;

implementation

end.
