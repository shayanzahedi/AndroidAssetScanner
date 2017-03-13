//Sample code for Hybrid REST Explorer
var barcodeScanValue = "";
var barcodeAction = "";
function barcodeScan(action){
    cordova.plugins.barcodeScanner.scan(function(result){
    //success callback
    barcodeScanValue = result.text;
    barcodeAction = action;

    if(barcodeScanValue != "" && barcodeAction!= "" )
        force.query("SELECT Id, Name FROM Asset WHERE SerialNumber='" + result.text + "'", onSuccessSFAssetScan, onErrorSfdc);
    },function(error){
    //error callback
        alert(JSON.stringify(error));
     });
 }

function onSuccessSFAssetScan(response) {
    var $j = jQuery.noConflict();
    var logToConsole = cordova.require("com.salesforce.util.logger").logToConsole;
    if (response.totalSize == "1"){
       var data = new Object();
       data.Id =  response.records[0].Id;
       data.SerialNumber = barcodeScanValue;
       if (barcodeAction == "service"){
            data.Status = "Serviced";
       }else if (barcodeAction == "mark"){
            data.Status = "Marked";
       }else if (barcodeAction == "remove"){
            data.Status = "Decommissioned";
       }
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

function onErrorSfdc(error) {
    cordova.require("com.salesforce.util.logger").logToConsole("onErrorSfdc: " + JSON.stringify(error));
    alert(JSON.stringify(error));
}

function updateSuccess(message) {
    barcodeScanValue= "";
    barcodeScan(barcodeAction);
}

function nfcScan()
{
         window.location = "nfcscan.html";
}


