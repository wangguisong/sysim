imApp.controller('ContractListCtrl', function($scope, webservice){
    var self = this;
    this.chatroomReady = false;
    this.friendReady = false;
    this.groupReady = false;
    $scope.tree_data = [];
    $scope.my_tree = tree = {};
    $scope.expanding_property = {
        field: "Name",
        displayName: "Demographic Name",
        cellTemplate: "<i>{{row.branch[expandingProperty.field]}}</i>"
    };
    $scope.col_defs = [
        {
            field: "displayName",
            sortable: true,
            sortingType: "string"
        },
    ];
    $scope.my_tree_handler = function (branch) {
        if(branch.personType == 'app'){
            $scope.enterChat(branch);
        }
        console.log('you clicked on', branch)
    }
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
            $scope.tree_data = friends;
            function editTreedata(item){
                if(item.type=='org'){
                    item.displayName = item.orgName;
                }else if(item.type=='user'){
                    item.displayName = item.realName;
                }else if(item.type=='app'){
                    item.displayName = item.NAME;
                }else{
                    item.displayName = '';
                }
                item.personType = item.type;
                item.type = CHAT_TYPE_SINGLE;
                if(item.communicationId != undefined){
                    item.name = item.communicationId;
                }
                item.to = item.communicationId
                if(item.children && item.children.length && item.children.length>0){
                    for(var i=0; i<item.children.length; i++){
                        editTreedata(item.children[i]);
                    }
                }
            }
            $scope.tree_data.forEach(function(item){
                editTreedata(item);
            })
//          console.log($scope.tree_data);
//          $scope.friendList = friends;
//          $scope.friendList.forEach(function(friend){
//              friend.avatar = 'images/default.png';
//              friend.type = CHAT_TYPE_SINGLE;
//          })
            console.log($scope.tree_data);
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