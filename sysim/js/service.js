const WEB_EVENT_LOGINED = 'logined';
const WEB_EVENT_LOGOUTED = 'logouted';
const WEB_EVENT_RECEIVED = 'received';
imApp.service('webservice', function($rootScope){
    window.Connection = this.connection = new WebIM.connection({
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
        url: WebIM.config.xmppURL,
        heartBeatWait: WebIM.config.heartBeatWait,
        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
        autoReconnectInterval: WebIM.config.autoReconnectInterval,
        apiUrl: WebIM.config.apiURL,
        isHttpDNS: WebIM.config.isHttpDNS,
        isWindowSDK: WebIM.config.isWindowSDK,
        isAutoLogin: false
    });
    
    window.Connection.listen({
        onOpened: function ( message ) {          //连接成功回调
            // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
            // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
            // 则无需调用conn.setPresence();             console.log(message);
            $rootScope.$broadcast(WEB_EVENT_LOGINED, message);
        },  
        onClosed: function ( message ) {
            $rootScope.$broadcast(WEB_EVENT_LOGOUTED, message);
        },         //连接关闭回调
        onTextMessage: function ( message ) {
            $rootScope.$broadcast(WEB_EVENT_RECEIVED, message);
        },    //收到文本消息
        onEmojiMessage: function ( message ) {},   //收到表情消息
        onPictureMessage: function ( message ) {}, //收到图片消息
        onCmdMessage: function ( message ) {},     //收到命令消息
        onAudioMessage: function ( message ) {},   //收到音频消息
        onLocationMessage: function ( message ) {},//收到位置消息
        onFileMessage: function ( message ) {},    //收到文件消息
        onVideoMessage: function (message) {
            
        },   //收到视频消息
        onPresence: function ( message ) {},       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
        onRoster: function ( message ) {},         //处理好友申请
        onInviteMessage: function ( message ) {},  //处理群组邀请
        onOnline: function () {},                  //本机网络连接成功
        onOffline: function () {
            $rootScope.$broadcast(WEB_EVENT_LOGOUTED, message);
        },                 //本机网络掉线
        onError: function ( message ) {
            console.log(message);
        },          //失败回调
        onBlacklistUpdate: function (list) {       //黑名单变动
            // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
            console.log(list);
        }
    });
    
    //登录
    this.login = function(username, password){
        var options = { 
          apiUrl: WebIM.config.apiURL,
          appKey: WebIM.config.appkey,
          user: username,
          pwd: password,
        };
        this.connection.open(options);
    }
    
    //登出
    this.logout = function(){
        this.connection.close();
    }
    //上线，接收消息
    this.presence = function(){
        this.connection.setPresence();
    }
    
    //获取好友列表
    this.getFriendList = function(successCallback, failCallback){
        this.connection.getRoster({
            success: function(roster){
                var ret = [];
                for(var i=0; i<roster.length; i++){
                    var ros = roster[i];
                    if(ros.subscription === 'both' || ros.subscription === 'to'){
                        ret.push(ros);
                    }
                }
                successCallback(ret);
            }
        })
    }
    
    //获取群组列表
    this.getGroupList = function(successCallback, failCallBack){
        var option = {
            apiUrl: WebIM.config.apiURL,
            success: function (rooms) {
                successCallback(rooms);
            },
            error: function () {
                failCallBack();
            }
        };
        this.connection.listRooms(option);
    }
    
    //获取聊天室列表
    this.getChatroomList = function(successCallback, failCallback){
        var option = {
            apiUrl: WebIM.config.apiURL,
            pagenum: 1,                                 // 页数
            pagesize: 20,                               // 每页个数
            success: function (list) {
                successCallback(list);
            },
            error: function () {
                failCallback();
            }
        };
        this.connection.getChatRooms(option);
    }
    
    //发送消息
    this.sendMessage = function(type, data, to, successCallback, failCallback){
        var id = this.connection.getUniqueId();
        var msg = new WebIM.message('txt', id);
        var option = {
            msg: data,
            to: to,
            success: function(){
                successCallback();
            },
            fail: function(){
                
            }
        }
        if(type==CHAT_TYPE_SINGLE){
            option.roomType = false;
            msg.body.chatType = 'singleChat';
            msg.set(option);
        }else if(type==CHAT_TYPE_GROUP){
            option.roomType = false;
            option.chatType = 'groupChat';
            msg.set(option);
            msg.setGroup('groupchat');
        }else if(type==CHAT_TYPE_ROOM){
            option.roomType = true;
            option.chatType = 'chatRoom';
            msg.set(option);
            msg.setGroup('groupchat');
        }
        this.connection.send(msg.body);
    }
    
    //获取群组信息
    this.queryGroupInfo = function(groupId, successCallback, failCallback){
        this.connection.queryRoomInfo({
            roomId: groupId,
            success: function(settings, members, fields){
                successCallback(settings, members, fields);
            },
            error: function(){
                failCallback();
            }
        });
    }
})