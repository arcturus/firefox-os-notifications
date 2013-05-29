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

  var getAppReference = function getAppReference(cb) {
    var request = navigator.mozApps.getSelf();
    request.onsuccess = function onApp(evt) {
      cb(evt.target.result);
    };
  };

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

  var createNotification = function createNotification() {
    var notification = navigator.mozNotification.createNotification('My Title',
      'My Description',
      'http://g.etfv.co/http://mozilla.org');

    notification.show();
  };

  var createAdvanceNotification = function createAdvancedNotification() {
    getAppIcon(function onAppIcon(icon) {
      var notification = navigator.mozNotification.createNotification(
        'Advanced notification',
        'My Description',
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

  var forgetNotification = function onForget(not) {
    notifications.splice(notifications.indexOf(not), 1);
  };

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
  var imageUrl = message.imageURL;
  console.log(imageUrl);
  NotificationsTest.getAppReference(function onApp(app) {
    app.launch();
  });
});
