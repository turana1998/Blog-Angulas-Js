angular
    .module('app', ['ngMaterial','ngMessages','ngAria','ngAnimate','ngRoute'])
    .config(['$routeProvider',($routeProvider)=>{
        $routeProvider
            .when('/',{
                templateUrl:"dashboard/index.html"
            })
            .when('/users',{
                templateUrl:'users/index.html',
                controller:'UsersController'
            })
            .when('/users/:id',{
                templateUrl:'profile/index.html',
                controller:'ProfileController'
            })
            .when('/books',{
                templateUrl:'books/index.html',
                controller:'BooksController'
            })
            .when('/books/:id',{
                templateUrl:'books/books.html',
                controller:'BooksIdController'
            }).otherwise({
            redirectTo:"/"
        })
    }])
    .run(($rootScope)=>{
        
    })
    .factory('common',($mdToast,$log)=>{
        return {
            goPage:(url)=>{
                window.location.href=window.location.origin+url;
            },
            showMessage:(message)=>{
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(message)
                    .hideDelay(3000))
                  .then(function() {
                    $log.log('Toast dismissed.');
                  }).catch(function() {
                    $log.log('Toast failed or was forced to close early by another toast.');
                  });
            }
        }
    })
    .directive('loading',()=>{
        return {
            strict:'E',
            templateUrl:'directives/loading.html'
        }
    })
    .controller('AppCtrl', function ($scope, $mdSidenav,common) {
        $scope.toggleLeft = buildToggler('left');

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }
    }).controller('LeftCtrl',($scope,$location,common)=>{
        $scope.close=()=>{

        }

        $scope.goPage=common.goPage;


    }).controller('UsersController',($scope,$http,$mdToast,$log,$rootScope,common)=>{
        $scope.pagination={current:1,total:0,maxpage:0}
        $scope.fillPages=()=>{
            console.log($scope.pagination);
            $scope.pages=[];
            for(let i=0;i<$scope.pagination.maxpage;i++)
            {
                $scope.pages.push({id:i+1,selected:i==$scope.pagination.current})
            }
        }


        $scope.changePage=(page)=>{
            console.log(page);
            $scope.pagination.current=page;
            $scope.getUsers(page);
        }

        $scope.getUsers=(page)=>{
            $http({
                url:"https://reqres.in/api/users?page="+page,
            }).then((response)=>{
                common.showMessage('Test');
                $scope.users=response.data.data;
                $scope.pagination.total=response.data.total;
                $scope.pagination.maxpage=$scope.pagination.total/6;
                $scope.fillPages();
               
            },(err)=>{
                common.showMessage(err.stack);
                console.log(err);
            })
        }
        $scope.getUsers($scope.pagination.current);

        $scope.showUser=(index)=>{
            $scope.selectedUser=$scope.users[index];
            localStorage.setItem('selectedUser',JSON.stringify($scope.selectedUser));
            common.goPage('#/users/'+$scope.selectedUser.id);
        }
    })
    .controller('ProfileController',($scope,$http,common,$location)=>{
        ($scope.getUserDetails=()=>{
            $http({
                url:"https://reqres.in/api/users/"+$location.url().substring($location.url().lastIndexOf('/')+1),
                timeout:5000
            }).then(response=>{
                $scope.user=response.data.data;
            },(err)=>{
                common.showMessage(err.stack);
                console.log(err);
                $scope.user=JSON.parse(localStorage.getItem('selectedUser'));
            })
        })();
    }).controller('BooksController',($scope,$http,common)=>{
    $scope.getBooks=()=>{
        $http({
            url:"https://fakerestapi.azurewebsites.net/api/Books",
        }).then((response)=>{
            common.showMessage('Test');
            $scope.books=response.data;
        },(err)=>{
            common.showMessage(err.stack);
            console.log(err);
        })
    }
    $scope.getBooks();
    $scope.showBooks=(id)=>{
        alert(id)
        common.goPage('#/books/'+id);
    }
}) .controller('BooksIdController',($scope,$http,common,$location)=>{
    ($scope.getBooksDetails=()=>{
        $http({
            url:"https://fakerestapi.azurewebsites.net/api/Books/"+$location.url().substring($location.url().lastIndexOf('/')+1),
            timeout:5000
        }).then(response=>{
            $scope.books=response.data;
        },(err)=>{
            common.showMessage(err.stack);
            console.log(err);
            $scope.user=JSON.parse(localStorage.getItem('selectedUser'));
        })
    })();
})