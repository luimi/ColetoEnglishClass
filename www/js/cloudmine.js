var ws = new cloudmine.WebService({
  appid: 'dfea1806410d764b8cba0e76c99d8128',
  apikey: '15e3e2086938423cb969efe2b9b39137',
  session_token: (window.localStorage ? localStorage.getItem('cm_session') : null)
});
var publico = new cloudmine.WebService({
  appid: 'dfea1806410d764b8cba0e76c99d8128',
  apikey: '15e3e2086938423cb969efe2b9b39137'
});
var nombre =(window.localStorage ? localStorage.getItem('nombre') : null);
var posts;
var postsIds=[];
var idSeleccionado;

$(document).ready(function(){
    $('#btnRegistrar').click(function(){
    	ws.createUser($('#txtNuevoCorreo').val(), $('#txtNuevoClave').val()).on('success', function(data, response) {
    		login($('#txtNuevoCorreo').val(),$('#txtNuevoClave').val(),function(data){
    			ws.updateUser({nombre:$('#txtNuevoNombre').val()}).on('success',function(data,response){
    				localStorage.setItem('nombre',$('#txtNuevoNombre').val());
    				nombre=$('#txtNuevoNombre').val();
					principal();
    			});
    		});
    	}); 
    });
    $('#btnLogin').click(function(){
        login($('#txtLoginUsario').val(),$('#txtLoginClave').val(),function(data){
        	localStorage.setItem('nombre',data.data.profile.nombre);
        	nombre=data.data.profile.nombre;
        	principal();
        });
    });
    $('#btnAgregarRegistrar').click(function(){
    	var o={
    		__class__:'Registro',
    		espanol:$('#txtAgregarEspanol').val(),
    		ingles:$('#txtAgregarIngles').val(),
    		puntaje:0,
    		comentarios:[],
            usuario:nombre,
            usuarios:[]
    	};
        publico.set(null,o).on('success',function(data,resp){
        	$('#txtAgregarEspanol').val("");
        	$('#txtAgregarIngles').val("");
        	listarPosts();
        });
    });
    $('#btnPrincipalCerrar').click(function(){
        ws.logout().on('success', function() {
			window.localStorage && localStorage.removeItem('cm_session');
			$.mobile.changePage('#login');
		});
    });
    $('#btnComentarioEnviar').click(function(){
    	ws.run('comentario',{'id':idSeleccionado,nombre:nombre,comentario:$("#txtComentarioComentario").val()},{}).on('result',function(res){
            
    		posts[idSeleccionado]=res;
    		$("#txtComentarioComentario").val("");
            listarComentarios();
    	});
    	
    });
    $('#btnComentarioPositivo').click(function(){
        puntuar(1);
    });
    $('#btnComentarioNegativo').click(function(){
        puntuar(-1);
    });
})
//realiza una accion si hace click en algun elemento de la lista
$(document).on('vclick', '#listaPosts li a', function(){  
    idSeleccionado = $(this).attr('data-id');
    $.mobile.changePage( "#detallePost");
    $(".ui-header .ui-title").text(posts[idSeleccionado].ingles);
    $('#txtComentarioPuntaje').text(posts[idSeleccionado].puntaje);
    listarComentarios();
});
function login(correo,clave,callback){
	ws.login(correo, clave).on('success', function(data, response) {
		localStorage.setItem('cm_session', data.session_token);
		callback(response);
	}).on('error',function(data,response){
		dialogMensaje("Error","Usuario y/o contraseña incorrectos");
	});
}
function principal(){
	$.mobile.changePage('#principal');
	$(".ui-header .ui-title").text(nombre);
	listarPosts();
}
function listarPosts(){
    publico.search('[__class__="Registro", puntaje>-4]' ).on('success',function(data,resp){
        posts=data;
        postsIds=Object.keys(data).sort();
        $("#listaPosts").empty()
        for(var i=0;i<postsIds.length;i++){
            var obj=posts[postsIds[i]];
            $('#listaPosts').append('<li><a href="" data-id="' + postsIds[i] + '"><h2>' + obj.ingles + '</h2><p>' + obj.espanol + '</p><p class="ui-li-aside">'+obj.usuario+'</p></a></li>');
        }
        $('#listaPosts').listview('refresh');
        /*
        *   <li><a>
                <h2>Agregar objetos</h2>
                <p>Insertar objetos en la base de datos</p>
                <p class="ui-li-aside">usuario</p></a>
            </li>
        */
	});
}
function listarComentarios(){
	var comentarios= posts[idSeleccionado].comentarios;
    $("#listaComentarios").empty()
    for (var i = 0; i <comentarios.length; i++) {
    	$('#listaComentarios').append('<li><h2>' + comentarios[i].nombre + '</h2><p>' + comentarios[i].comentario + '</p></li>');
	}
    $('#listaComentarios').listview('refresh');
}
function dialogMensaje(titulo,mensaje){
    $('<div>').simpledialog2({
        mode: 'blank',
        headerText: titulo,
        headerClose: false,
        transition: 'flip',
        themeDialog: 'a',
        zindex: 2000,
        blankContent : 
          "<div style='padding: 15px;'><p>"+mensaje+"</p>"+
          "<a rel='close' data-role='button' href='#'>Ok</a></div>"
      });
}
function puntuar(numero){
    ws.run('puntuar',{id:idSeleccionado,numero:numero},{}).on('result',function(res){
        if(res.success){
            $('#txtComentarioPuntaje').text(res.puntaje);
        }
        dialogMensaje(res.success?"¡Que bien!":"Error",res.msg);
    	});
}