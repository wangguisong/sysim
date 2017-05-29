/**
 * 警情详情
 */
imApp.controller('NewsDetailCtrl', function($scope){
    $scope.currentNew;
    //显示警情详情
    $scope.showNewDetail = function(item){
        $scope.currentNew = item;
    }
    
    //发送警情
    $scope.sendNewMessage = function(){
        $scope.inputMessage = '这是警情详情';
    }
});