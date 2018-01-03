
//para usar firebase se pega este código
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAqRUe-CuzmexneLSTEZbeufdbQsfDiFqk",
    authDomain: "red-social-f9af1.firebaseapp.com",
    databaseURL: "https://red-social-f9af1.firebaseio.com",
    projectId: "red-social-f9af1",
    storageBucket: "red-social-f9af1.appspot.com",
    messagingSenderId: "157507274842"
  };
  firebase.initializeApp(config);

window.onload = inicializar;
var formAutenticacion;

function inicializar(){
	formAutenticacion = document.getElementById("form-autenticacion");
	formAutenticacion.addEventListener("submit", autentificar, false);
}

function autentificar(event){
	event.preventDefault();
	var usuario = event.target.email.value;
	var contrasena = event.target.password.value;
	console.log(usuario);
	console.log(contrasena);
	firebase.auth().signInWithEmailAndPassword(usuario, contrasena)
	.then(function(result){
		alert("Autenticación correcta");
	})
	//Esto es en caso de error
	.catch(function(error) {
  		alert("No se ha realizado la autenticación correctamente");
});

}
//código para añadir publicaciones a la página
$(document).ready(function(){
  $('#btn').click(function(){
    var comentario = $('#comment').val();
    $('#comment').val("");
    var contenedor = $('#cont');
    contenedor.append('<div><p>' + comentario + '</p></div>');
  })
})

 //seccion de las publicaciones
 var ref = firebase.database().ref("User1");
 ref.once("value")
  .then(function(snapshot) {
    var key = snapshot.val();
    console.log(key);
    var childKey = snapshot.child("post1/detalle").val();
    console.log(childKey);
  });
