imApp.controller('ImPanelCtrl', function($scope, webservice){
    $scope.$on(WEB_EVENT_RECEIVED, function(event, data){
        if(data.delay){
            data.time = data.delay;
        }else{
            data.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }
        var chat = $scope.findChatContext(data.type, data.to, data.from);
        if(chat){
            if(!chat.msglist) chat.msglist=[];
            chat.msglist.push(data);
            if(chat!=$scope.currentChat){
                chat.hasNew=true;
            }
        }
        $scope.$apply();
        $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
    });
    $scope.findChatContext = function(type, to, from){
        var ret = null;
        if(type==CHAT_TYPE_SINGLE){
//          for(var i=0; i<$scope.friendList.length; i++){
//              if($scope.friendList[i].name==from){
//                  ret = $scope.friendList[i];
//                  break;
//              }
//          }
            function getFrientByCName(arr, name){
                for(var i=0; i<arr.length; i++){
                    if(arr[i].name == name){
                        return arr[i];
                    }else{
                        if(arr[i].children && arr[i].children.length && arr[i].children.length>0){
                            return getFrientByCName(arr[i].children, name);
                        }
                    }
                }
                return null;
            }
            ret = getFrientByCName($scope.friendList, from);
        }else if(type == CHAT_TYPE_GROUP){
            for(var i=0; i<$scope.groupList.length; i++){
                if($scope.groupList[i].roomId==to){
                    ret = $scope.groupList[i];
                    break;
                }
            }
        }
        return ret;
    }
    $scope.enterChat = function(chat){
        $scope.currentChat = chat;
        $scope.currentChat.hasNew = false;
        if($scope.currentChat.type==CHAT_TYPE_GROUP){
            webservice.queryGroupInfo($scope.currentChat.roomId, function(settings, members, fields){
                $scope.currentChat.affiliations_count = fields.affiliations;
                $scope.$apply();
            }, function(){})
        }
    }
    $scope.sendMessage = function(){
        if($scope.currentChat && $scope.inputMessage!=''){
            var msg = {
                from: $scope.currentUserName,
                data: $scope.inputMessage,
                time: new Date().Format('yyyy-MM-dd hh:mm:ss')
            }
            if($scope.currentChat.type == CHAT_TYPE_SINGLE){
                msg.to = $scope.currentChat.name
            }else if($scope.currentChat.type == CHAT_TYPE_GROUP){
                msg.to = $scope.currentChat.roomId
            }
            $scope.inputMessage = '';
            webservice.sendMessage($scope.currentChat.type, msg.data, msg.to, function(){
                if(!$scope.currentChat.msglist) $scope.currentChat.msglist=[];
                $scope.currentChat.msglist.push(msg);
                $scope.$apply();
                $('.webim-chatwindow-msg').scrollTop($('.webim-chatwindow-msg')[0].scrollHeight);
            }, function(){});
        }else if(!$scope.currentChat){
            alert('请选择发送到哪个群组或好友');
        }
    }
    $('#memberOption').popover({
        trigger: 'focus',
        placement: 'bottom',
        html: true,
        content: '<div class="member-opt-panel clearfix">'+
                    '<div class="member-opt-item member-opt-btn" data-toggle="model" data-target="#groupModel" onclick="$(\'#groupModel\').modal(\'show\');$(\'#memberOption\').popover(\'toggle\');">+</div>'+
                    '<div class="member-opt-item member-opt-btn" data-toggle="model" data-target="#groupModel" onclick="$(\'#groupModel\').modal(\'show\');$(\'#memberOption\').popover(\'toggle\');">-</div>'+
                    '<div class="member-opt-item"><img src="images/default.png" /><br />局长 张某某</div>'+
                    '<div class="member-opt-item"><img src="images/default.png" /><br />局长 张某某</div>'+
                  '</div>'
    });
    $('#memberOption').click(function(){
        $('#memberOption').popover('toggle');
    })
    
    $scope.showMenu = function($event){
        $('#optMenu').remove().appendTo($('body'));
        $('#optMenu li').click(function(){
            $('#optMenu').hide();
        })
        $('#optMenu').css({
            left: $event.clientX+'px',
            top: $event.clientY+'px'
        });
        $('#optMenu').show();
    }
});