
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
var userLoged = 'none';

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
    userLoged = usuario;
	})
	//Esto es en caso de error
	.catch(function(error) {
  		alert("No se ha realizado la autenticación correctamente");
});

}
//para subir imagenes a la web
var urlLarge = 'none';
$('#upload-file-selector').change(function(){
  if(this.files && this.files[0]){
    var archivo = new FileReader();
    archivo.onload = function(e){
    //var imgSmall = redimencionarImg(e.target.result,165,165);
    urlLarge = e.target.result;
    //visualizar la imagen en la etiqueta img
    $('#imgLoad').attr('src',urlLarge);
    $('#imgLoad').attr('class','img-thumbnail');
    };
    archivo.readAsDataURL(this.files[0]);
  }
})
//cargando imagenes a firebase
var imgData = firebase.database().ref('imagenes');
$('.btnData').click(function(){
  if(urlLarge != 'none'){
    var region = $("#region-menu-modal option:selected").val();
    var comentario = $('#comment').val();
    imgData.push({
      urlLarge:urlLarge,
      comentario:comentario,
      region:region,
      user:userLoged
    })
    $('#modal-post').modal('hide');
    $('#imgLoad').attr('src', 'img/no-image.png');
    $('#imgLoad').removeClass('img-thumbnail');
    $('#comment').val("");
    urlLarge = 'none';
  }
});

//añadir publicaciones a la web
imgData.on('value', function(snapshot){
  $('#divImg').html(''); //limpiamos el contenedor
  snapshot.forEach(function(e){
    var Objeto = e.val();
    //console.log(Objeto.urlLarge);
    if(Objeto.urlLarge!=null){
      $("#divImg").append('<div class="col-xs-12"><p>' + Objeto.user + '</p><h4>' + Objeto.comentario + '</h4><img class="col-xs-12 img-thumbnail" height="10%" width="10%" src="' + Objeto.urlLarge + '"/></div>')
    }
  })
})
//filtro por region
$("#region-menu").on('input', function(){
  var selectRegion = $("#region-menu option:selected").val();
  //if ()
  imgData.orderByChild("region").equalTo(selectRegion).on("value", function(snapshot){
    //console.log(snapshot.key);
    $('#divImg').html(''); //limpiamos el contenedor
    snapshot.forEach(function(e){
      var Objeto = e.val();
      console.log(Objeto.urlLarge);
      if(Objeto.urlLarge!=null){
        $("#divImg").append('<div class="col-xs-12"><p>' + Objeto.user + '</p><h3>' + Objeto.comentario + '</h3><img class="col-xs-12 img-thumbnail" height="10%" width="10%" src="' + Objeto.urlLarge + '"/></div>')
      }
    })
  });
});

//código para añadir publicaciones a la página
/*$(document).ready(function(){
  $('#btn').click(function(){
    var comentario = $('#comment').val();
    $('#comment').val("");
    var contenedor = $('#cont');
    contenedor.append('<div><p>' + comentario + '</p></div>');
  })
})*/

 //seccion de las publicaciones
/* var ref = firebase.database().ref("User1");
 ref.once("value")
  .then(function(snapshot) {
    var key = snapshot.val();
    console.log(key);
    var childKey = snapshot.child("post1/detalle").val();
    console.log(childKey);
  });
  */
