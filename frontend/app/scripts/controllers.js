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

                twitterService.getLatestTweets().then(function(data) {
                    var user_tweet;
                    var tweet_list = [];
                    user_tweet = data;
                    // for(var i = 0; i < data.length; i++) {
                    //     tweet_list[i] = data[i]["text"]
                    // }
                    twitterService.getUserInfo().then(function(data) {
                            var user_name = data["name"];
                            for (var i = 0; i < user_tweet.length; i++) {
                                tweet_list.push({
                                    "content": user_tweet[i]["text"],
                                    "contenttype": "text/plain",
                                    "created": 1447639154000,
                                    "id": user_tweet[i]["id"],
                                    "language": "en",
                                    "sourceid": "Twitter API",
                                    "userid": user_name
                                })
                            }
                            user_tweet = angular.toJson(tweet_list)
                            $.ajax({
                                url: 'http://localhost:5000/users/' + user_name,
                                type: "get",
                                data: {"usertweet": user_tweet}, 
                                success: function(response) {
                                    $scope.recommended_users = response.data;
                                },
                                error: function(xhr, err, errmsg) {
                                    console.log(errmsg)
                                }
                            })
                            console.log(user_tweet);
                    });


                })

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