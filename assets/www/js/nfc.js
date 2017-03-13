var nfcScanValue = "";
var app = {
    initialize: function () {
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function () {
    
        function failure(reason) {
            navigator.notification.alert(reason, function() {}, "There was a problem");
        }

        nfc.addNdefListener(
            app.onNdef,
            function() {
                console.log("Listening for NDEF tags.");
            },
            failure
        );

        if (getMobileOperatingSystem() == "Android") {

            // Android reads non-NDEF tag. BlackBerry and Windows don't.
            nfc.addTagDiscoveredListener(
                app.onNfc,
                function() {
                    console.log("Listening for non-NDEF tags.");
                },
                failure
            );

            // Android launches the app when tags with mime type text/pg are scanned
            // because of an intent in AndroidManifest.xml.
            // phonegap-nfc fires an ndef-mime event (as opposed to an ndef event)
            // the code reuses the same onNfc handler
            nfc.addMimeTypeListener(
                'text/pg',
                app.onNdef,
                function() {
                    console.log("Listening for NDEF mime tags with type text/pg.");
                },
                failure
            );
        }

        app.compileTemplates();
        app.addTemplateHelpers();
        app.showInstructions();
    },
    onNfc: function (nfcEvent) {
        
        var tag = nfcEvent.tag;
        
        console.log(JSON.stringify(nfcEvent.tag));
        app.clearScreen();

        /*Sales force specific updates*/
        nfcScanValue = numArraytoHex(tag.id);
        force.query("SELECT Id, Name FROM Asset WHERE SerialNumber='" + nfcScanValue + "'", onSuccessSFAssetScan, onErrorSfdc);
        /*Sales force specific updates*/

        tagContents.innerHTML = app.nonNdefTagTemplate(tag);
        //navigator.notification.vibrate(100);
    },
    onNdef: function (nfcEvent) {
        
        console.log(JSON.stringify(nfcEvent.tag));
        app.clearScreen();

        var tag = nfcEvent.tag;

        // BB7 has different names, copy to Android names
        if (tag.serialNumber) {
            tag.id = tag.serialNumber;
            tag.isWritable = !tag.isLocked;
            tag.canMakeReadOnly = tag.isLockable;
        }

        /*Sales force specific updates*/
        nfcScanValue = numArraytoHex(tag.id);
        force.query("SELECT Id, Name FROM Asset WHERE SerialNumber='" + nfcScanValue + "'", onSuccessSFAssetScan, onErrorSfdc);
        /*Sales force specific updates*/

        tagContents.innerHTML = app.tagTemplate(tag);

        //navigator.notification.vibrate(100);
    },
    clearScreen: function () {
        
        tagContents.innerHTML = "";
        
    },
    showInstructions: function () {

        var hidden = document.getElementsByClassName('hidden');
        if (hidden && hidden.length) {
            hidden[0].className = 'instructions';
        }
        
    },
    compileTemplates: function () {

        var source;
                    
        source = document.getElementById('non-ndef-template').innerHTML;
        app.nonNdefTagTemplate = Handlebars.compile(source);

        source = document.getElementById('tag-template').innerHTML;
        app.tagTemplate = Handlebars.compile(source);
        
    },
    addTemplateHelpers: function () {
        
        Handlebars.registerHelper('bytesToString', function(byteArray) { 
            return nfc.bytesToString(byteArray);
        });

        Handlebars.registerHelper('bytesToHexString', function(byteArray) {
            return nfc.bytesToHexString(byteArray); 
        });

        // useful for boolean
        Handlebars.registerHelper('toString', function(value) {  
            return String(value);  
        });

        Handlebars.registerHelper('tnfToString', function(tnf) {  
            return tnfToString(tnf);  
        });

        Handlebars.registerHelper('decodePayload', function(record) {
            return decodePayload(record);
        });
        
        Handlebars.registerHelper('pluralize', function(number, single, plural) {
          if (number === 1) { return single; }
          else { return plural; }
        });     
    }
};

// ideally some form of this can move to phonegap-nfc util
function decodePayload(record) {
    var recordType = nfc.bytesToString(record.type),
        payload;

    // TODO extract this out to decoders that live in NFC code
    // TODO add a method to ndefRecord so the helper 
    // TODO doesn't need to do this

    if (recordType === "T") {
        var langCodeLength = record.payload[0],
        text = record.payload.slice((1 + langCodeLength), record.payload.length);
        payload = nfc.bytesToString(text);

    } else if (recordType === "U") {
        var identifierCode = record.payload.shift(),
        uri =  nfc.bytesToString(record.payload);

        if (identifierCode !== 0) {
            // TODO decode based on URI Record Type Definition
            console.log("WARNING: uri needs to be decoded");
        }
        //payload = "<a href='" + uri + "'>" + uri + "<\/a>";
        payload = uri;

    } else {

        // kludge assume we can treat as String
        payload = nfc.bytesToString(record.payload); 
    }

    return payload;
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

// TODO move to phonegap-nfc util
function tnfToString(tnf) {
    var value = tnf;
    
    switch (tnf) {
    case ndef.TNF_EMPTY:
        value = "Empty";
        break; 
    case ndef.TNF_WELL_KNOWN:
        value = "Well Known";
        break;     
    case ndef.TNF_MIME_MEDIA:
        value = "Mime Media";
        break;     
    case ndef.TNF_ABSOLUTE_URI:
        value = "Absolute URI";
        break;     
    case ndef.TNF_EXTERNAL_TYPE:
        value = "External";
        break;     
    case ndef.TNF_UNKNOWN:
        value = "Unknown";
        break;     
    case ndef.TNF_UNCHANGED:
        value = "Unchanged";
        break;     
    case ndef.TNF_RESERVED:
        value = "Reserved";
        break;     
    }
    return value;
}


function onSuccessSFAssetScan(response) {
    var $j = jQuery.noConflict();
    var logToConsole = cordova.require("com.salesforce.util.logger").logToConsole;
    if (response.totalSize == "1"){
       var data = new Object();
       data.Id =  response.records[0].Id;
       data.SerialNumber = nfcScanValue;
       data.Status = "Serviced";
       data.Last_Service_Date__c = new Date();
       force.update("Asset",data,updateSuccess,onErrorSfdc);
    }else if(response.totalSize == "0"){
            alert("No assets found. " + JSON.stringify(response));
    }else if(response.totalSize != "0"){
        alert("Multiple assets found with the same serial number. " + JSON.stringify(response));
    }else{
        alert("Update Error " + JSON.stringify(response));
    }
}

function updateSuccess(message) {
    nfcScanValue= "";
}

function onErrorSfdc(error) {
    cordova.require("com.salesforce.util.logger").logToConsole("onErrorSfdc: " + JSON.stringify(error));
    alert(JSON.stringify(error));
}

function numArraytoHex(a){
  var b = a.map(function (x) {
        x = x + 0xFFFFFFFF + 1;  // twos complement
        x = x.toString(16); // to hex
        x = ("00"+x).substr(-2); // zero-pad to 8-digits
        return x;
    }).join('');
 return b;
 }