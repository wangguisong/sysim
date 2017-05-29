var imApp = angular.module('imApp',[]);

//登录状态
const LOGIN_STATUS_DEACTIVE = -1;//未登录
const LOGIN_STATUS_ACTIVE = 1;//已登录

//聊天类型
const CHAT_TYPE_SINGLE = 'chat';//单聊
const CHAT_TYPE_GROUP = 'groupchat';//群组
const CHAT_TYPE_ROOM = 'chatroom';//聊天室

imApp.controller('IndexCtrl', function($scope, user){
    $scope.user = user;
    $scope.logout = function(){
        user.logout();
    }
    $scope.$on(WEB_EVENT_LOGINED, function(event, data){
        $scope.$apply();
    })
    $scope.$on(WEB_EVENT_LOGOUTED, function(event, data){

    })
});

imApp.directive('newsList', function(){
    return {
        templateUrl: 'view/newslist.html',
        controller: 'NewsListCtrl',
        replace: true
    }
});
imApp.directive('newsDetail', function(){
    return {
        templateUrl: 'view/newsdetail.html',
        controller: 'NewsDetailCtrl',
        replace: true
    }
});
imApp.directive('contractList', function(){
    return {
        templateUrl: 'view/contractlist.html',
        controller: 'ContractListCtrl',
        replace: true
    }
});
imApp.directive('imPanel', function(){
    return {
        templateUrl: 'view/impanel.html',
        controller: 'ImPanelCtrl',
        replace: true
    }
});
imApp.directive('login', function(){
    return {
        templateUrl: 'view/login.html',
        controller: 'LoginCtrl',
        replace: true
    }
});
Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}