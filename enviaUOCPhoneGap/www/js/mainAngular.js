document.addEventListener("deviceready",onDeviceReady,false);
document.addEventListener("backbutton", backButton, false);

function onDeviceReady() {
}

function onBtnClicked() {
	map.showDialog();
}

function backButton() {
	navigator.app.exitApp();
}

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


var allPedidos = [];


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

function ControladorLogin($scope){ 
	Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");
	
	$scope.validar = function() {
		var email = $scope.email;
		var pass = $scope.password;

		var Usuarios = Parse.Object.extend("Usuarios");
		var query = new Parse.Query(Usuarios);
		query.equalTo("email", email);
		query.find({
			success: function(results){
				if (results.length == 1) {
					var usuarioR = results[0];
					var parsePassword = usuarioR.get('password');
					if (pass == parsePassword) {
						usuarioSession.nombre = usuarioR.get("nombre");
						usuarioSession.apellido1 = usuarioR.get("apellido1");
						usuarioSession.apellido2 = usuarioR.get("apellido2");
						usuarioSession.email = email;
						usuarioSession.username = usuarioR.get("username");
						
						localStorage.setItem("usuario", JSON.stringify(usuarioSession));
						cargarLista();
						window.location.href = "#paginaInicial";
					}
					else {
						document.getElementById("fail").innerHTML = "Contraseña incorrecto";
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
}



function ControladorRegistro($scope) {
	$scope.registrarse = function() {
		Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");
		var Usuarios = Parse.Object.extend("Usuarios");
		var usuarios = new Usuarios();
		var username  = $scope.usernameR;
		var password = $scope.passwordR;
		var email = $scope.emailR;
		var nombre = $scope.nombreR;
		var apellido1 = $scope.apellido1R;
		var apellido2 = $scope.apellido2R;
		
		if(username == null || password == null || email == null || nombre == null || apellido1 == null || apellido2 == null){
			alert("Rellenar todos los campos");
		}
		else {
			usuarios.save({username : username,
							password : password,
							email : email,
							nombre : nombre,
							apellido1 : apellido1,
							apellido2 : apellido2 }, {
				success: function(object) {
					window.location.href = "#pageLogin";
				},
				error: function(model, error) {
					alert(error.message);
				}
			});
		}
	}
}



function cargarLista() {	
	Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");
	var objRetrieved = localStorage.getItem("usuario");
	var usuarioSession = JSON.parse(objRetrieved);
	
	var tabla = document.getElementById("tablaPedidos");

	var PedidosPrueba = Parse.Object.extend("PedidosPrueba");
	var query = new Parse.Query(PedidosPrueba);
	query.equalTo("usuario", usuarioSession.username);
	//query.equalTo("usuario", "joma");	
	query.find({
		success: function(results){
			for (var i = 0; i<results.length; i++){
				var pedidoAux = results[i];
				
				var pedido = new Object();
				pedido.CP = pedidoAux.get('CP');
				pedido.direccion = pedidoAux.get('direccion');	
				pedido.localidad = pedidoAux.get('localidad');	
				pedido.ciudad = pedidoAux.get('ciudad');
				pedido.usuario = pedidoAux.get('usuario');
				pedido.estado = pedidoAux.get('estado');

				allPedidos.push(pedido);
				}
				createTable();
		},
		error: function(error) {
			alert("Error: " + error.message);
		}
	});
}


function createTable(){
	var tabla = document.getElementById("tablaPedidos");

	allPedidos.forEach(function(pedido, i){
		var cp = pedido.CP;
	
		var pedidoFila = tabla.insertRow(i);
		
		var h3 = document.createElement('h3');
		h3.innerHTML = pedido.direccion;
		
		var par = document.createElement('p');
		par.innerHTML = pedido.localidad;
		
		var pedidoNuevo = pedidoFila.insertCell(0);
		pedidoNuevo.appendChild(h3);
		pedidoNuevo.appendChild(par);
		
		var button = pedidoFila.insertCell(1);
		var elementButton = document.createElement("input");
		elementButton.type = "button";	
		elementButton.setAttribute("onclick","viewSelectedRow(document.getElementById('text'+this.id))");
		elementButton.value = "Consultar";
		button.appendChild(elementButton);
	
	});
}



function ControladorPagInicial($scope){
}

function ControladorNuevoPedido($scope){
	Parse.initialize("RoaOckK3OMgnlQSwUMFw3lPLz3VMOnSCAtA8tRso", "jImLW1cRzGVV5ZNFG8cpkGGGNjbYQvZtrPf78AZp");

	$scope.gps = function() {
		navigator.geolocation.getCurrentPosition(onGPSSuccess, onFail);	
	}
	
	$scope.map = function() {
		navigator.geolocation.getCurrentPosition(openMap, onFail);	
		window.location.href = "#pageMap";
	}
	
	
	$scope.savePedido = function() {
		var direccion = document.getElementById("direccion").value;
		var localidad = document.getElementById("localidad").value;
		var cp = document.getElementById("cp").value;
		var ciudad = document.getElementById("ciudad").value;
		var posiblesEstados = ["Salida de la oficina de origen", "En tránsito",
				"Almacén", "Entregado", "Incidencia"];

		var randomEstado = Math.floor((Math.random() * 5));
		var estado = posiblesEstados[randomEstado];

		var objRetrieved = localStorage.getItem("usuario");
		var usuarioSession = JSON.parse(objRetrieved);

		
		if(direccion == null || localidad == null || cp == null || ciudad == null){
			alert("Rellenar todos los campos");
		}
		else {
			var pedido = new Object();
			pedido.CP = cp;
			pedido.direccion = direccion;
			pedido.localidad = localidad;
			pedido.ciudad = ciudad;
			pedido.usuario = usuarioSession.username;
			pedido.estado = estado;
			
			var PedidosPrueba = Parse.Object.extend("PedidosPrueba");
			var pedidos = new PedidosPrueba();
		}
			pedidos.save({CP : cp,
							direccion : direccion,
							localidad : localidad,
							ciudad : ciudad,
							usuario : usuarioSession.username, 
							estado : estado
							}, {
			success: function(object) {
				allPedidos.push(pedido);
				clearValues();
				window.location.href = "#paginaInicial";
				
			},
			error: function(model, error) {
				alert(error.message);
			}
		});	
	}
}


// Called after GPS Alert
function onGPSSuccess(position) {
	var geocoder =  new google.maps.Geocoder();

	var lat = parseFloat(position.coords.latitude);
	var lng = parseFloat(position.coords.longitude);
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				var num;
				var calle;
				var arrAddress = results[0].address_components;
				// iterate through address_component array
				$.each(arrAddress, function (i, address_component) {
					
					if(address_component.types[0] == "street_number"){
						num = address_component.long_name
						//document.getElementById("num").value = address_component.long_name;
					}
					if(address_component.types[0] == "route"){
						calle = address_component.long_name
						//document.getElementById("direccion").value = address_component.long_name;
					}
					if(address_component.types[0] == "locality"){
						document.getElementById("localidad").value = address_component.long_name
					}
					if(address_component.types[0] == "administrative_area_level_2"){
						document.getElementById("ciudad").value = address_component.long_name
					}
					if(address_component.types[0] == "postal_code"){
						document.getElementById("cp").value = address_component.long_name
					}
					
					if(num != null && calle != null){
						document.getElementById("direccion").value = calle + ", " +num;
					}
			});
			clearValues();
		} else {
			alert("No results found");
		}
		} else {
			alert("Geocoder failed due to: " + status);
		}
	});
};


function clearValues() {
	document.getElementById("direccion").value = "";
	document.getElementById("localidad").value = "";
	document.getElementById("cp").value = "";
	document.getElementById("ciudad").value = "";
	
	var tabla = document.getElementById("tablaPedidos");
	var numFiles = tabla.rows.length;
	
	while(tabla.rows.length > 0){
		tabla.deleteRow(0);	
	}
	createTable();	
}



function ControladorMapa(){
	navigator.geolocation.getCurrentPosition(function(position){
		var lat = parseFloat(position.coords.latitude);
		var lng = parseFloat(position.coords.longitude);
		var latlng = new google.maps.LatLng(lat, lng);
	
		var mapOptions = {
			center: latlng,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		
		var map = new google.maps.Map(document.getElementById("mapa"), mapOptions);
		
		setTimeout(function() {
			google.maps.event.trigger(map, 'resize');
		},  100);		
	}, onFail);	

  //map.on(plugin.google.maps.event.MAP_READY, onMapInit);
}


function openMap(position){
	var lat = parseFloat(position.coords.latitude);
	var lng = parseFloat(position.coords.longitude);
	var latlng = new google.maps.LatLng(lat, lng);

	var mapOptions = {
		center: latlng,
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	
	var map = new google.maps.Map(document.getElementById("mapa"), mapOptions);

	setTimeout(function() {
		google.maps.event.trigger(map, 'resize');
	},  100);

}
