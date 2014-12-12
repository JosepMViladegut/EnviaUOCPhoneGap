// JavaScript Document
document.addEventListener("deviceready",onDeviceReady,false);
document.addEventListener("backbutton", backButton, false);
// Cordova is ready to be used!
function onDeviceReady() {
	console.log("onDeviceReady");
}

function backButton() {
	navigator.app.exitApp();
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
	var positionStr='Latitude: ' + position.coords.latitude + '\n' +
	'Longitude: ' + position.coords.longitude + '\n' +
	'Altitude: ' + position.coords.altitude + '\n' +
	'Accuracy: ' + position.coords.accuracy + '\n';
	document.getElementById("localizacion").innerHTML = positionStr;
	//navigator.notifcation.alert(positionStr,alertDismissed,'Posición','Ok');
};
// Callback Alert dismissed
function alertDismissed() {
}
// Callback Error found
function onFail(message) {
	document.getElementById("locate").innerHTML = "error";
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}





var usuarioSession = new Object();
usuarioSession.nombre = '';
usuarioSession.apellido1 = '';
usuarioSession.apellido2 = '';
usuarioSession.email = '';
usuarioSession.username = '';

/*var usuario = {
	username: '',
	nombre: '',
	apellido1: '',
	apellido2: '',
	email: '',
	fullName : function(){
		return this.apellido2 + " " + this.apellido1 + ", " + this.nombre;
	}
};
*/
function saveParse() {
	Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");
	var TestObject = Parse.Object.extend("TestObject");
	var testObject = new TestObject();
	  testObject.save({foo: "bar"}, {
	  success: function(object) {
	    $(".success").show();
	  },
	  error: function(model, error) {
	    $(".error").show();
	  }
	});
}

function validate() {
	Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");
	var email = document.getElementById("emailInput").value;
	var contra = document.getElementById("passInput").value;
	
	var Usuarios = Parse.Object.extend("Usuarios");
	var query = new Parse.Query(Usuarios);
	query.equalTo("email", email);
	query.find({
		success: function(results){
			if (results.length == 1) {
				var usuarioR = results[0];
				var parsePassword = usuarioR.get('password');
				if (contra == parsePassword) {
					usuarioSession.nombre = usuarioR.get("nombre");
					usuarioSession.apellido1 = usuarioR.get("apellido1");
					usuarioSession.apellido2 = usuarioR.get("apellido2");
					usuarioSession.email = usuarioR.get("email");
					usuarioSession.username = usuarioR.get("username");
					
					localStorage.setItem("usuario", JSON.stringify(usuarioSession));
					
					cargarLista();
					window.location.href = "#paginaInicial";
				}
				else {
					document.getElementById("fail").innerHTML = "Password incorrecto";
				}
			}
			else {
				document.getElementById("fail").innerHTML = "Usuario no existente";
			}
		},
		error: function(error) {
			alert("Error: " + error.message);
		}
	});
	
}

function cargarLista(){
	Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");
	history.go(-(history.length - 1));
	var objRetrieved = localStorage.getItem("usuario");
	var usuarioSession = JSON.parse(objRetrieved);

	var ul = document.getElementById("listPedidos");
	var PedidosPrueba = Parse.Object.extend("PedidosPrueba");
	var query = new Parse.Query(PedidosPrueba);
	query.equalTo("usuario", usuarioSession.username);
	//query.equalTo("usuario", "joma");
	query.find({
		success: function(results){
			for (var i = 0; i<results.length; i++){
				var pedidoAux = results[i];
				//ul.innerHTML = "<li><a href=\"#\"><h3>"+pedidoAux.get('direccion')+"</h3></a></li>";
				
				var info = pedidoAux.get('direccion');
				var infociudad = pedidoAux.get('ciudad');
				var li = document.createElement('li');
				var h = document.createElement('H3');
				var direccion = document.createTextNode(info);
				h.appendChild(direccion);
				var p = document.createElement('P')
				var ciudad = document.createTextNode(infociudad);

				//var h3 = "<h3>"+info+"</h3>";
				//var par = "<p>"+direccion+"</p>";
				//var href = "<a href=\"#\">"+h3+"</a>";

				//ul.innerHTML = href;
				p.appendChild(ciudad);
				li.appendChild(h);
				li.appendChild(p);
				
				ul.appendChild(li);
				
			}
		},
		error: function(error) {
			alert("Error: " + error.message);
		}
	});
}

function nuevoPedido() {
	Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");

	//Obtenim el usuari
	var objRetrieved = localStorage.getItem("usuario");
	var usuarioSession = JSON.parse(objRetrieved);
	var direccionP = document.getElementById("direccion").value;
	var localidadP = document.getElementById("localidad").value;
	var CPP = document.getElementById("CP").value;
	var ciudadP = document.getElementById("ciudad").value;

	if (direccionP == "" || localidadP == "" || CPP == "" || ciudadP == "") {
		document.getElementById("fail").innerHTML = "Campos vacios";
	}
	
	var PedidosPrueba = Parse.Object.extend("PedidosPrueba");
	var pedidosPrueba = new PedidosPrueba();
	pedidosPrueba.save({
		direccion : direccionP,
		localidad : localidadP,
		CP : CPP,
		ciudad : ciudadP,
		estado : "No conocido",
		usuario : usuarioSession.username
		}, {
	  success: function(object) {
		window.location = "index.html";
	    $(".success").show();
	  },
	  error: function(model, error) {
	    $(".error").show();
	  }
	});
	
	
}











