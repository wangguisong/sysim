imApp.controller('LoginCtrl', function($scope, user){
    $scope.login_name = 'wgstest123';
    $scope.login_password = 'qaz123';
    $scope.login = function(){
        $scope.currentUserName = $scope.login_name;
        user.login($scope.login_name, $scope.login_password);
    }
});