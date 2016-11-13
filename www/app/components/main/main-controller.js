"use strict";

angular.module("ngapp").controller("MainController", function(shared, $state, $scope, $mdSidenav, $mdComponentRegistry, $http, $mdDialog) {

  var that = this;

  this.title = $state.current.title;

  this.light = {};
  this.light.adress = "192.168.178.36";

  this.liveMode = {};
  this.liveMode.enabled = false;
  this.liveMode.lastUpdate = 0;

  this.color = {};
  this.color.red = 255;
  this.color.green = 75;
  this.color.blue = 0;

  this.turnOffDuration = 30;

  this.setColor = function(duration) {
    var command = "fadeto";
    if (typeof duration === 'undefined') {
      duration = 0.5;
    } else {
      if (duration <= 0) {
        command = "set";
      }
    }

    var commandUrl = "http://" + that.light.adress + "/?cmd=" + command + "&duration=" + duration + "&r=" + that.color.red + "&g=" + that.color.green + "&b=" + that.color.blue;
    console.log("Set color: " + commandUrl);

    $http({
      method: 'GET',
      url: commandUrl
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
    });
  };

  this.colorUpdate = function() {
    if (!that.liveMode.enabled) {
      return;
    }

    var currentTime = Date.now();
    if (currentTime - that.liveMode.lastUpdate > 250) {
      console.log('Set Color');
      that.liveMode.lastUpdate = currentTime;
      that.setColor(0);
    }
  };

  this.turnOff = function(duration) {
    if (typeof duration === 'undefined') {
      duration = that.turnOffDuration;
    }
    duration = Math.max(1, duration);

    var commandUrl = "http://" + that.light.adress + "/?cmd=fade&duration=" + duration;
    console.log("Turn off: ", commandUrl);

    $http({
      method: 'GET',
      url: commandUrl
    });

    if (duration > 1) {
      $mdDialog
        .show($mdDialog.alert({
          title: 'Turned Off',
          textContent: 'The light is dimmed down in the next ' + duration + ' minutes!',
          ok: 'Close'
        }));
    }
  };
});
