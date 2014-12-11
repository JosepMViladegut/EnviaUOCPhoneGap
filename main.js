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
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;
	var Usuarios = Parse.Object.extend("Usuarios");
	var query = new Parse.Query(Usuarios);
	query.equalTo("email", email);
	query.find({
		success: function(results){
			if (results.length == 1) {
				var usuarioR = results[0];
				var parsePassword = usuarioR.get("password");
				if (password == parsePassword) {
					usuarioSession.nombre = usuarioR.get("nombre");
					usuarioSession.apellido1 = usuarioR.get("apellido1");
					usuarioSession.apellido2 = usuarioR.get("apellido2");
					usuarioSession.email = usuarioR.get("email");
					usuarioSession.username = usuarioR.get("username");
					
					localStorage.setItem("usuario", JSON.stringify(usuarioSession));
					
					window.location = "index.html";
				}
				else {
					document.getElementById("fail").innerHTML = "Contraseña incorrecta";
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

	var objRetrieved = localStorage.getItem("usuario");
	var usuarioSession = JSON.parse(objRetrieved);

	var ul = document.getElementById("pedidos");
	var PedidosPrueba = Parse.Object.extend("PedidosPrueba");
	var query = new Parse.Query(PedidosPrueba);
	//query.equalTo("usuario", usuarioSession.username);
	query.equalTo("usuario", "jo");
	query.find({
		success: function(results){
			for (var i = 0; i<results.length; i++){
				var pedidoAux = results[i];
				var li = document.createElement('li');
				var info = pedidoAux.get("direccion");
				info += ", (" + pedidoAux.get("ciudad") +")";
				li.appendChild(document.createTextNode(info));
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