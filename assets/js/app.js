//$( document ).ready(function() {
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
var imgDataPerfil = firebase.database().ref('usuarios');
var followData = firebase.database().ref('seguimientos');
//Esto es para autenticar un usuario registrado
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
	//console.log(usuario);
	//console.log(contrasena);
	firebase.auth().signInWithEmailAndPassword(usuario, contrasena)
	.then(function(result){
		//alert("Autenticación correcta");
		$('.first-screen').addClass('hidden');
  	$('.newsfeed').removeClass('hidden');
    userLoged = usuario;
    //para cargar los seguidos del usuario
    followData.orderByChild("seguidor").equalTo(userLoged).on("value", function(snapshot){
      $('#div-follow').html(''); //limpiamos el contenedor
      snapshot.forEach(function(e){
        var Objeto = e.val();
        //console.log(Objeto.seguido);
        if(Objeto.seguido!=null){
        $('#div-follow').append('<div class="col-xs-12"><p>' + Objeto.seguido + '</p></div>')
        }
      });
    });
    //añadir los datos al perfil
    imgDataPerfil.orderByChild("user").equalTo(userLoged).on("value", function(snapshot){
      $('#profile').html(''); //limpiamos el contenedor
      snapshot.forEach(function(e){
        var Objeto = e.val();
        //console.log(Objeto.seguido);
        if(Objeto.imgProfile!=null){
          $("#profile").append('<img class="col-xs-12 img-circle imgProfile center-block" src="' + Objeto.imgProfile + '"/><p class="col-xs-12 color-user text-center">' + Objeto.description + '</p>')
        }
      });
    });
	})
	//Esto es en caso de error
	.catch(function(error) {
  		alert("No se ha realizado la autenticación correctamente");
});
}

//Esto es para crear un usuario
var imgProfile = 'none';
function registrar(){
	var emailReg = document.getElementById("emailRegistro").value;
	var passwordReg = document.getElementById("passwordRegistro").value;
  var description = document.getElementById("description").value;
	firebase.auth().createUserWithEmailAndPassword(emailReg, passwordReg)
		.then(function(result){
      imgDataPerfil.push({
        imgProfile:imgProfile,
        description:description,
        user:emailReg
      })
  		//alert("Autenticación correcta");
  		$('#myModal').modal('hide');
  		$('.first-screen').addClass('hidden');
    	$('.newsfeed').removeClass('hidden');
      userLoged = emailReg;
      //añadir los datos al perfil
      $("#profile").append('<img class="col-xs-12 img-circle imgProfile center-block" src="' + imgProfile + '"/><p class="col-xs-12 color-user">' + description + '</p>')
	})
	//Esto es en caso de error
	.catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  // ...
});

}
//imagen de perfil
$('#upload-profile').change(function(){
  if(this.files && this.files[0]){
    var archivo = new FileReader();
    archivo.onload = function(e){
    imgProfile = e.target.result;
    //console.log(perfilImg);
    };
    archivo.readAsDataURL(this.files[0]);
  }
})
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
      $("#divImg").append('<div class="col-xs-12 box-post"><p class="col-xs-12 col-md-6 color-user">' + Objeto.user + '</p><button class="col-xs-3 col-md-3 btnSeguir" type="button" value="' + Objeto.user + '">Seguir</button><h4 class="col-xs-12">' + Objeto.comentario + '</h4><img class="col-xs-12 img-thumbnail margen-img" src="' + Objeto.urlLarge + '"/></div>')
    }
    })
})
//para añadir Seguidos
  followData.orderByChild("seguidor").equalTo(userLoged).on("value", function(snapshot){
    $('#div-follow').html(''); //limpiamos el contenedor
    snapshot.forEach(function(e){
      var Objeto = e.val();
      //console.log(Objeto.seguido);
      if(Objeto.seguido!=null){
      $('#div-follow').append('<div class="col-xs-12"><p>' + Objeto.seguido + '</p></div>')
      }
    });
  });
//capturar el valor del boton de seguir
  $('#divImg').on("click", ".btnSeguir", function(){
    var valor = $(this).val(); //valor usuario seguido
    followData.push({
      seguido:valor,
      seguidor: userLoged
    })
  });
//filtro por region
$("#region-menu").on('input', function(){
  var selectRegion = $("#region-menu option:selected").val();
  if(selectRegion == "Seleccion"){
    imgData.on('value', function(snapshot){
      $('#divImg').html(''); //limpiamos el contenedor
        snapshot.forEach(function(e){
        var Objeto = e.val();
        //console.log(Objeto.urlLarge);
        if(Objeto.urlLarge!=null){
          $("#divImg").append('<div class="col-xs-12 box-post"><p class="col-xs-12 col-md-6 color-user">' + Objeto.user + '</p><button class="col-xs-3 col-md-3 btnSeguir" type="button" value="' + Objeto.user + '">Seguir</button><h4 class="col-xs-12">' + Objeto.comentario + '</h4><img class="col-xs-12 img-thumbnail margen-img" src="' + Objeto.urlLarge + '"/></div>')
        }
        })
    })
  }else{
    imgData.orderByChild("region").equalTo(selectRegion).on("value", function(snapshot){
      //console.log(snapshot.key);
      $('#divImg').html(''); //limpiamos el contenedor
      snapshot.forEach(function(e){
        var Objeto = e.val();
        console.log(Objeto.urlLarge);
        if(Objeto.urlLarge!=null){
          $('#divImg').append('<div class="col-xs-12"><p>' + Objeto.user + '</p><h3>' + Objeto.comentario + '</h3><img class="col-xs-12 img-thumbnail" height="10%" width="10%" src="' + Objeto.urlLarge + '"/></div>')
        }
      })
    });
  }
});
//cambiar de pantalla segun el icono
$('#userLink').click(function(){
  $('.newsfeed').addClass('hidden');
  $('.userProfileMovil').removeClass('hidden');
})
$('#homeLink').click(function(){
  $('.userProfileMovil').addClass('hidden');
  $('.newsfeed').removeClass('hidden');
})
$('#homeLinkFollow').click(function(){
  $('.follow').addClass('hidden');
  $('.newsfeed').removeClass('hidden');
})
$('#followLink').click(function(){
  $('.newsfeed').addClass('hidden');
  $('.follow').removeClass('hidden');
})
//});
