cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "pluginId": "phonegap-plugin-barcodescanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "id": "phonegap-nfc.NFC",
        "file": "plugins/phonegap-nfc/www/phonegap-nfc.js",
        "pluginId": "phonegap-nfc",
        "runs": true
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "phonegap-plugin-push.PushNotification",
        "file": "plugins/phonegap-plugin-push/www/push.js",
        "pluginId": "phonegap-plugin-push",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "id": "com.salesforce.plugin.oauth",
        "file": "plugins/com.salesforce/www/com.salesforce.plugin.oauth.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.plugin.network",
        "file": "plugins/com.salesforce/www/com.salesforce.plugin.network.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.plugin.sdkinfo",
        "file": "plugins/com.salesforce/www/com.salesforce.plugin.sdkinfo.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.plugin.smartstore",
        "file": "plugins/com.salesforce/www/com.salesforce.plugin.smartstore.js",
        "pluginId": "com.salesforce",
        "clobbers": [
            "navigator.smartstore"
        ]
    },
    {
        "id": "com.salesforce.plugin.smartstore.client",
        "file": "plugins/com.salesforce/www/com.salesforce.plugin.smartstore.client.js",
        "pluginId": "com.salesforce",
        "clobbers": [
            "navigator.smartstoreClient"
        ]
    },
    {
        "id": "com.salesforce.plugin.sfaccountmanager",
        "file": "plugins/com.salesforce/www/com.salesforce.plugin.sfaccountmanager.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.plugin.smartsync",
        "file": "plugins/com.salesforce/www/com.salesforce.plugin.smartsync.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.util.bootstrap",
        "file": "plugins/com.salesforce/www/com.salesforce.util.bootstrap.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.util.event",
        "file": "plugins/com.salesforce/www/com.salesforce.util.event.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.util.exec",
        "file": "plugins/com.salesforce/www/com.salesforce.util.exec.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.util.logger",
        "file": "plugins/com.salesforce/www/com.salesforce.util.logger.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.util.promiser",
        "file": "plugins/com.salesforce/www/com.salesforce.util.promiser.js",
        "pluginId": "com.salesforce"
    },
    {
        "id": "com.salesforce.util.push",
        "file": "plugins/com.salesforce/www/com.salesforce.util.push.js",
        "pluginId": "com.salesforce"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.1",
    "cordova-plugin-compat": "1.1.0",
    "phonegap-plugin-barcodescanner": "6.0.5",
    "phonegap-nfc": "0.6.6",
    "cordova-plugin-device": "1.0.1",
    "phonegap-plugin-push": "1.5.0",
    "com.salesforce": "5.0.1"
};
// BOTTOM OF METADATA
});