cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "WebViewer.webview",
      "file": "plugins/WebViewer/www/webview.js",
      "pluginId": "WebViewer",
      "clobbers": [
        "webview"
      ]
    }
  ];
  module.exports.metadata = {
    "WebViewer": "0.0.1",
    "cordova-plugin-androidx": "1.0.2",
    "cordova-plugin-androidx-adapter": "1.1.3"
  };
});