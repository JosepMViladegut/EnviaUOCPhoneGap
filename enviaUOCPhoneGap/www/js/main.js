// JavaScript Document
document.addEventListener("deviceready",onDeviceReady,false);
// Cordova is ready to be used!
function onDeviceReady() {
console.log("onDeviceReady");
}
// Call camera
function callCamera() {
console.log("callCamera");
navigator.camera.getPicture(onPhotoSuccess, onFail);
}
// Call GPS
function callGPS(){
console.log("callGPS");
navigator.geolocation.getCurrentPosition(onGPSSuccess, onFail);
}
// Call Vibration
function callVibration(){
console.log("callVibration");
navigator.notifcation.vibrate(2000);
}
// Called when a photo is successfully retrieved
function onPhotoSuccess(imageData) {
console.log("Photo done");
}
// Called after GPS Alert
function onGPSSuccess(position) {
console.log("onGPSSuccess");
positionStr='Latitude: ' + position.coords.latitude + '\n' +
'Longitude: ' + position.coords.longitude + '\n' +
'Altitude: ' + position.coords.altitude + '\n' +
'Accuracy: ' + position.coords.accuracy + '\n';
navigator.notifcation.alert(positionStr,alertDismissed,'Posición','Ok');
};
// Callback Alert dismissed
function alertDismissed() {
}
// Callback Error found
function onFail(message) {
alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}