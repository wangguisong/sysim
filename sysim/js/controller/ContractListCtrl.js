imApp.controller('ContractListCtrl', function($scope, webservice){
    var self = this;
    this.chatroomReady = false;
    this.friendReady = false;
    this.groupReady = false;
    this.doCheckPresence = function(){
        if(this.chatroomReady && this.friendReady && this.groupReady){
            webservice.presence();
        }
    }
    $scope.$on(WEB_EVENT_LOGINED, function(event,data){
        webservice.getChatroomList(function(rooms){
            $scope.chatroomList = rooms.data;
            $scope.chatroomList.forEach(function(room){
                room.avatar = 'images/group_user.png';
                room.type == CHAT_TYPE_ROOM;
            })
            $scope.$apply();
            self.chatroomReady = true;
            self.doCheckPresence();
        }, function(){});
        webservice.getFriendList(function(friends){
            $scope.friendList = friends;
            $scope.friendList.forEach(function(friend){
                friend.avatar = 'images/default.png';
                friend.type = CHAT_TYPE_SINGLE;
            })
            $scope.$apply();
            self.friendReady = true;
            self.doCheckPresence();
        }, function(){});
        webservice.getGroupList(function(list){
            $scope.groupList = list;
            $scope.groupList.forEach(function(group){
                group.avatar = 'images/group_user.png';
                group.type = CHAT_TYPE_GROUP;
            })
            $scope.$apply();
            self.groupReady = true;
            self.doCheckPresence();
        }, function(){});
    })
});