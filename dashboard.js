/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils', 'ojs/ojcontext', 'ojs/ojbutton', 'ojs/ojinputtext'],
  function (ko, app, moduleUtils, accUtils, Context) {

    function DashboardViewModel() {
      var self = this;
      self.filename = ko.observable("");
      // Wait until header show up to resolve
      var resolve = Context.getPageContext().getBusyContext().addBusyState({
        description: "wait for header"
      });
      // Header Config
      self.headerConfig = ko.observable({
        'view': [],
        'viewModel': null
      });
      moduleUtils.createView({
        'viewPath': 'views/header.html'
      }).then(function (view) {
        self.headerConfig({
          'view': view,
          'viewModel': app.getHeaderModel()
        })
        resolve();
      })

      self.cameraSrcTypeSelector = function (e) {
        var eventSrc = e.target;
        var classListName = eventSrc.classList;
        var srcType;
        if (classListName.contains('camera')) {
          srcType = Camera.PictureSourceType.CAMERA;
        } else if (classListName.contains('gallery')) {
          srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        }
        pictureManager(srcType);
      };

      self.getFile = function (e) {
        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (result) {
          var directoryReader = result.createReader();
          directoryReader.readEntries(function (entries) {
            var names = "";
            for (var i = 0; i < entries.length; i++) {
              if (entries[i].isFile) {
                if(!self.filename()) {
                  self.filename(entries[i].name);
                }
    
                names += entries[i].name + ", ";
              }
            }
            alert("name" + names);

          }, function (e) {
            alert(e);
          });
        }, function (error) {
          alert("error" + error);
          throw new Error("");
        });
      }

      self.downloadFile = function(e) {
        window.resolveLocalFileSystemURL(
          cordova.file.cacheDirectory + self.filename(),
          function(fileEntry){
                newFileUri  = cordova.file.externalRootDirectory;
                oldFileUri  = fileEntry.nativeURL;
                fileExt     = ".jpg";

                newFileName = "test" + fileExt;
                window.resolveLocalFileSystemURL(newFileUri,
                        function(dirEntry) {
                            // move the file to a new directory and rename it
                            fileEntry.moveTo(dirEntry, newFileName, successCallback, errorCallback);
                        },
                        errorCallback);
          },
          errorCallback);

      }

      function successCallback(a, b) {
        alert("success" + a);
      }

      function errorCallback(e) {
        alert(e);
      }

      function setCameraOptions(srcType) {
        var options = {
          // Some common settings are 20, 50, and 100
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          // Dynamically set the picture source, Camera or photo gallery
          sourceType: srcType,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          allowEdit: false,
          correctOrientation: true, //Corrects Android orientation quirks
          direction: 0, // Ensure back camera is set by default
          saveToPhotoAlbum: true
        }
        return options;
      };

      function pictureManager(srcType) {
        var options = setCameraOptions(srcType);
        navigator.camera.getPicture(
          function cameraSuccess(imageUri) {
            // Adapt visibility properties
            // Base64/jpeg ready to display
            alert(imageUri);
            var img = document.getElementById('myImage');
            img.src = imageUri;
          },
          function cameraError(error) {
            console.error("Something went wrong. An error occured:" + "'" + error + "'." + " Please contact Helpdesk");
          }, options)

        return '';
      };

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
