'use strict'
angular.module('recommenderApp')
.controller('recommenderController', function($scope, $http, $q, twitterService) {
    $scope.tweets = []; //array of tweets

    twitterService.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function(maxId) {
        twitterService.getLatestTweets(maxId).then(function(data) {
            $scope.tweets = $scope.tweets.concat(data);
        }, function() {
            $scope.rateLimitError = true;
        });
    }

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function() {
        twitterService.connectTwitter().then(function() {
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                $('#connectButton').fadeOut(function() {
                    $('#signOut').fadeIn();
                    $scope.connectedTwitter = true;
                });

                twitterService.getLatestTweets(20).then(function(data) {
                    tweet_list = angular.toJson(data);
                    $http({
                        url: ,//todo
                        method: "GET",
                        data: {tweet: tweet_list}
                    }).then(function success(response) {
                        $scope.recommended_users = response.data;
                    }, function error(response) {
                        $scope.recommended_users = response.statusText;
                    })
                }

            } else {

            }
        });
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function() {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        $('#signOut').fadeOut(function() {
            $('#connectButton').fadeIn();
            $scope.$apply(function() {
                $scope.connectedTwitter = false
            })
        });
    }

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#signOut').show();
        $scope.connectedTwitter = true;
    }
});