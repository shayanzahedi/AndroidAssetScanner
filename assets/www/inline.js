//Sample code for Hybrid REST Explorer
var barcodeScanValue = "";
var barcodeAction = "";
var assetTagSFID="";
function barcodeScan(action){
    cordova.plugins.barcodeScanner.scan(function(result){
    //success callback
    barcodeScanValue = result.text;
    barcodeAction = action;

    if(barcodeScanValue != "" && barcodeAction!= "" )
        force.query("SELECT Id, Name,assetscanner__Parent_Asset__c FROM assetscanner__AssetTag__c WHERE Name='" + result.text + "'", onSuccessSFAssetScan, onErrorSfdc);
    },function(error){
    //error callback
        alert(JSON.stringify(error));
     });
 }

function onSuccessSFAssetScan(response) {
    var $j = jQuery.noConflict();
    var logToConsole = cordova.require("com.salesforce.util.logger").logToConsole;
    if (response.totalSize == "1"){
       assetTagSFID =  response.records[0].Id;
       var data = new Object();
       data.Id =  response.records[0].assetscanner__Parent_Asset__c;
       data.SerialNumber = barcodeScanValue;
       if (barcodeAction == "service"){
            data.Status = "Serviced";
       }else if (barcodeAction == "mark"){
            data.Status = "Marked";
       }else if (barcodeAction == "remove"){
            data.Status = "Decommissioned";
       }
       force.update("Asset",data,updateSuccessAsset,onErrorSfdc);
    }else if(response.totalSize == "0"){
           alert("No assets found matching " + barcodeScanValue);
    }else if(response.totalSize != "0"){
           alert("Multiple assets found with the same serial number. " + barcodeScanValue);
    }else{
           alert("Update Error " + JSON.stringify(response));
    }
}

function onErrorSfdc(error) {
    alert(JSON.stringify(error));
    cordova.require("com.salesforce.util.logger").logToConsole("onErrorSfdc: " + JSON.stringify(error));
}

function updateSuccessAsset(message) {
       var data = new Object();
       data.Id =  assetTagSFID;
       force.update("assetscanner__AssetTag__c",data,updateSuccessAssetTag,onErrorSfdc);
}

function updateSuccessAssetTag(message) {
    barcodeScanValue= "";
    assetTagSFID="";
    barcodeScan(barcodeAction);
}

function nfcScan()
{
         window.location = "nfcscan.html";
}


