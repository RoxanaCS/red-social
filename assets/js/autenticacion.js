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

	firebase.auth().createUserWithEmailAndPassword(usuario, contrasena)
	.then(function(result){
		alert("Autenticación correcta");
	})
	//Esto es en caso de error
	.catch(function(error) {
  		alert("No se ha realizado la autenticación correctamente");
});

}