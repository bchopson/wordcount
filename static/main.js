(function () {

  'use strict';

  angular.module('WordcountApp', [])

  .controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function ($scope, $log, $http, $timeout) {

      $scope.submitButtonText = 'Submit';
      $scope.loading = false;
      $scope.urlerror = false;

      $scope.getResults = function () {

        var userInput = $scope.url;

        $http.post('/start', { 'url': userInput }).
          success(function (results) {
            $log.log(results);
            getWordCount(results);
            $scope.wordcounts = null;
            $scope.loading = true;
            $scope.urlerror = false;
            $scope.submitButtonText = 'Loading...';
          }).
          error(function (error) {
            $log.log(error);
          });
      };

      function getWordCount(jobID) {
        var timeout = '';

        var poller = function () {
          $http.get('/results/' + jobID).
            success(function (data, status, headers, config) {
              if (status === 202) {
                $log.log(data, status);
              } else if (status === 200) {
                $log.log(data);
                $scope.loading = false;
                $scope.submitButtonText = 'Submit';
                $scope.wordcounts = data;
                $timeout.cancel(timeout);
                return false;
              }

              timeout = $timeout(poller, 2000);
            }).
            error(function (error) {
              $log.log(error);
              $scope.loading = false;
              $scope.submitButtonText = 'Submit';
              $scope.urlerror = true;
            });
        };

        poller();
      }

    }
  ]);
}());
