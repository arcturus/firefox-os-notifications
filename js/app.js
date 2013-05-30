var NotificationsTest = function NotificationsTest() {

  var app,
      notifications;

  var init = function init() {
    notifications = [];
    initUI();
  };

  var initUI = function initUI() {
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', handleEvent);
    }
  };


  var handleEvent = function onEvent(evt) {
    switch (evt.target.id) {
      case 'closeButton':
        window.close();
        break;
      case 'createButton':
        createNotification();
        break;
      case 'createAdvanceButton':
        createAdvanceNotification();
        break;
      case 'createWithParamsButton':
        createWithParamsNotifications();
        break;
      default:
        break;
    }
  };

  /*
    Uses the mozApps api to get a reference to the an app
    object representing the current application.

    We will use this to build the icon url and as well
    to call the method 'launch' over the application object
    that will bring our application to foreground 
  */
  var getAppReference = function getAppReference(cb) {
    var request = navigator.mozApps.getSelf();
    request.onsuccess = function onApp(evt) {
      cb(evt.target.result);
    };
  };

  /*
    Build the icon full url for this app
  */
  var getAppIcon = function getAppIcon(cb) {
    function buildIconURI(a) {
      var icons = a.manifest.icons;
      return a.installOrigin + icons['60'];
    }

    if (app != null) {
      cb(buildIconURI(app));
      return;
    }

    getAppReference(function onsuccess(a) {
      app = a;
      cb(buildIconURI(app));
    });
  };

  // Creates a simple notification with no actions and external icon
  var createNotification = function createNotification() {
    var notification = navigator.mozNotification.createNotification('My Title',
      'My Description',
      'http://g.etfv.co/http://mozilla.org');

    notification.show();
  };

  // Creates a notification using our app icon and adding some actions when clicking or closing
  var createAdvanceNotification = function createAdvancedNotification() {
    getAppIcon(function onAppIcon(icon) {
      var data = new Date();
      var notification = navigator.mozNotification.createNotification(
        'Advanced notification',
        'My Description',
        icon);

      notification.onclick = function onclick() {
        console.log(data);
        forgetNotification();
        app.launch();
      };

      notification.onclose = function onclose() {
        console.log('Notification closed');
        forgetNotification();
      };

      notification.show();
      notifications.push(notification);
    });
  };

  var forgetNotification = function onForget(not) {
    notifications.splice(notifications.indexOf(not), 1);
  };

  /*
    Creates a notification like the previous one but add a huge and ugly
    hack to add parameters via get parameters in the icon url
  */
  var createWithParamsNotifications = function createWithParamsNotifications() {
    getAppIcon(function onAppIcon(icon) {
      var data = new Date();
      icon += '?data=' + data;

      var notification = navigator.mozNotification.createNotification(
        'Notification',
        'Notification with params',
        icon);

      notification.onclick = function onclick() {
        forgetNotification();
        app.launch();
      };

      notification.onclose = function onclose() {
        console.log('Notification closed');
        forgetNotification();
      };

      notification.show();
      notifications.push(notification);
    });
  };

  return {
    'init': init,
    'getAppReference': getAppReference
  };


}();

NotificationsTest.init();

window.navigator.mozSetMessageHandler('notification', function onNotification(message) {
  NotificationsTest.getAppReference(function onApp(app) {
    app.launch();
  });
});
