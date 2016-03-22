var posts=[];
var validacionVersion=true;
angular.module('app.controllers', [])

.run(function($ionicPlatform,$rootScope,$ionicActionSheet,$ionicPopup,$ionicLoading,$state){
   $rootScope.cerrarSession=function(){
       var confirmPopup = $ionicPopup.confirm({
    	   title: 'Salirse de esta jugada',
    	   template: '¿Estás seguro mi vale?'
	   });
	   confirmPopup.then(function(res) {
		   if(res) {
			   $ionicLoading.show({
				   template: '<p>Dejando la peluca...</p><ion-spinner></ion-spinner>'
			   });
			   ws.logout().on('success', function() {
				   terminarSessionCM($ionicLoading,$state);
			   }).on('error',function(){
				   terminarSessionCM($ionicLoading,$state);
			   });
		   }
	   });
   }
})
.controller('postsCtrl', function($scope,$state,$ionicPopup, $timeout,$ionicLoading,$ionicHistory) {
	validarVersion();
	validarUsuario($scope,$state,$ionicHistory);
	listarPosts($scope,$state);
	$scope.actualizar=function(){
		listarPosts($scope,$state);
	}
	$scope.puntuar=function(numero,post){
		puntuar(numero,post.id,$ionicLoading,$scope,$ionicPopup);
	}
	var d=new Date();
	
})
   
.controller('nuevoPostCtrl', function($scope,$ionicPopup,$ionicLoading,$state,$ionicHistory) {
	validarUsuario($scope,$state,$ionicHistory);
	$scope.datos={};
	$scope.registrar=function(){
		console.log(ws);
		
		
		var ingles=$scope.datos.ingles,espanol=$scope.datos.espanol;
		if(ingles!=null && espanol!=null && ingles!="" && espanol!=""){
			var o={
	    		__class__:'Registro',
	    		espanol:espanol,
	    		ingles:ingles,
	    		puntaje:0,
	    		comentarios:[],
	            usuario:localStorage.getItem('nombre'),
	            usuarios:[],
	            usuarioId:localStorage.getItem('id')
	    	};
	    	$ionicLoading.show({
				template: '<p>Guardando esta vaina</p><ion-spinner></ion-spinner>'
			});
	        publico.set(null,o).on('success',function(data,resp){
	        	$scope.datos.espanol="";
	        	$scope.datos.ingles="";
	        	listarPosts($scope,$state);
	        	$ionicLoading.hide();
	        });
		}else{
			$ionicPopup.alert({
			    title: 'Hey men!',
			    template: '¡Faltan datos socio!'
		   	});
		}
	}
	
})

      
.controller('coletoEnglishClassCtrl', function($scope,$state,$ionicPopup, $timeout,$ionicLoading,$ionicHistory) {
	validarVersion();
	$scope.loginDatos={};
	$scope.login=function(){
		
		var correo=$scope.loginDatos.loginCorreo,clave=$scope.loginDatos.loginClave;
		if(correo!=null && clave!=null && correo!="" && clave!=""){
			$ionicLoading.show({
				template: '<p>¡Llegando al vacile!</p><ion-spinner></ion-spinner>'
			});
			loginCM(correo,clave,$ionicLoading,$ionicPopup,function(data){
				$ionicHistory.nextViewOptions({
				     disableBack: true
				});
				
                localStorage.setItem('nombre',data.data.profile.nombre);
                $state.go('principal.posts', {}, {location: "replace", reload: true});
				//$state.transitionTo('principal.posts');
				$ionicLoading.hide();
			});
		}else{
			$ionicPopup.alert({
			    title: 'Oiga!',
			    template: 'Falta el correo o la contraseña'
		   	});
		}
		
	}
})
   
.controller('nuevoUsuarioCtrl', function($scope,$state,$ionicPopup, $timeout,$ionicLoading) {
	$scope.nuevoDatos={};
	$scope.tipo="password";
	$scope.registrar=function(){
		alert("registrar")
		var nombre=$scope.nuevoDatos.nombre,correo=$scope.nuevoDatos.correo,clave=$scope.nuevoDatos.clave;
		if(nombre!=null && correo!=null && clave!=null && nombre!="" && correo!="" && clave!=""){
			$ionicLoading.show({
				template: '<p>Registrando</p><ion-spinner></ion-spinner>'
			});
			ws.createUser(correo, clave).on('success', function(data, response) {
	    		loginCM(correo,clave,$ionicLoading,$ionicPopup,function(data){
	    			ws.updateUser({nombre:nombre}).on('success',function(data,response){
	    				$ionicLoading.hide();
	    				localStorage.setItem('nombre',nombre);
						$state.transitionTo('principal.posts');
	    			});
	    		});
	    	}).on('error',function(data,response){
	    		$ionicLoading.hide();
	    		$ionicPopup.alert({
				    title: 'Zonaaa!',
				    template: 'Papi ya hay un usuario registrado con ese correo'
			   	});
			   	
	    	}); 
		}
	}
	$scope.verClave=function(){
		$scope.tipo=($scope.tipo=="password")?"text":"password";
	}
})
   
.controller('detallePostCtrl', function($scope,$stateParams,$ionicLoading,$state,$ionicPopup,$filter) {
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
	  viewData.enableBack = true;
	  
	});
	$scope.campos={};
	$scope.propietario=posts[$stateParams.id].usuarioId==localStorage.getItem('id')?true:false;
	$scope.puntaje=posts[$stateParams.id].puntaje;
	$scope.comentarios=posts[$stateParams.id].comentarios;
	$scope.campos.ingles=posts[$stateParams.id].ingles;
	$scope.campos.espanol=posts[$stateParams.id].espanol;
	$scope.enviar=function(){
		if($scope.comentario!=null && $scope.comentario.trim!=""){
			$ionicLoading.show({
				template: '<p>Enviando tu comentario</p><ion-spinner></ion-spinner>'
			});
			ws.run('comentario',{
					'id':$stateParams.id,
					nombre:localStorage.getItem('nombre'),
					comentario:$scope.comentario,
					hora:$filter('date')(new Date(),'yyyy-MM-dd h:mma')},{}).on('result',function(res){
	            $ionicLoading.hide();
	    		$scope.comentarios=res.comentarios;
	    		$scope.comentario="";
	    		$state.go($state.current, {}, {reload: true});
	    	});
		}
	}
	$scope.modificar=function(nuevo){
		posts[$stateParams.id].ingles=$scope.campos.ingles;
		posts[$stateParams.id].espanol=$scope.campos.espanol;
		$ionicLoading.show({
			template: '<p>Modificando</p><ion-spinner></ion-spinner>'
		});
		publico.set($stateParams.id,posts[$stateParams.id]).on('success',function(data,resp){
			$ionicLoading.hide();
        });
	}
})
.controller('acercaDeCtrl', function($scope) {
	
})
function validarVersion(){
	if(validacionVersion){
		publico.search('[__class__= "version", version>'+version+']').on('success',function(data,response){
			var v;
	    	for (var id in data) {
	    		v=data[id];
	    	};
	    	if(v!=null){
	    		$ionicPopup.alert({
	    		    title: "New versiooon!",
	    		    template: "Nueva version de android, quieres descargarla? ",
	    		    buttons:[
	    		    	{text:'No'},{text:'si',type:'button-positive',onTap:function(e){
	    		    		if(ionic.Platform.isAndroid()){
	    		    			window.open("https://www.dropbox.com/s/4pb0q6xj6y9nfxh/android-debug.apk?dl=0", '_system');
	    		    		}//por si hay otra plataforma
	    		    		
	    		    	}}
	    		    ]
	    	   	});
	    	}
	    });
	}
	validacionVersion=false;
}
function validarLogin($state){
	if(localStorage.getItem('cm_session') && localStorage.getItem('nombre')){
		$state.transitionTo('principal.posts');
	}
}
function validarUsuario($scope,$state,$ionicHistory){
	$scope.$on('$ionicView.beforeEnter', function(){
		$ionicHistory.clearHistory();
		if(!localStorage.getItem('cm_session') && !localStorage.getItem('nombre')){
			$state.transitionTo('coletoEnglishClass');
		}
	});
}
function loginCM(correo,clave,$ionicLoading,$ionicPopup,callback){
	ws.login(correo, clave).on('success', function(data, response) {
		localStorage.setItem('cm_session', data.session_token);
		localStorage.setItem('id', data.profile.__id__);
		callback(response);
	}).on('error',function(data,response){
		$ionicLoading.hide();
		$ionicPopup.alert({
		    title: 'Huyyy!',
		    template: 'Usuario o contraseña fallucos'
	   	});
	   	
	});
}
function terminarSessionCM($ionicLoading,$state){
    $ionicLoading.hide();
    window.localStorage && localStorage.removeItem('cm_session');
    window.localStorage && localStorage.removeItem('nombre');
    $state.transitionTo('coletoEnglishClass');
}

function puntuar(numero,id,$ionicLoading,$scope,$ionicPopup){
	$ionicLoading.show({
		template: '<p>Mandando el voto...</p><ion-spinner></ion-spinner>'
	});
	ws.run('puntuar',{id:id,numero:numero},{}).on('result',function(res){
		if(res.success){
			posts[id].puntaje=res.puntaje;
		}
		$ionicPopup.alert({
		    title: res.success?"¡Firmeee!":"¡Eche hey!",
		    template: res.msg
	   	});
		$ionicLoading.hide();
	});
}
function listarPosts($scope,$state){
	publico.search('[__class__="Registro", puntaje>-4]' ).on('success',function(data,resp){
        posts=data;
        $scope.posts=[];
        var p;
    	for (var id in data) {
    		p=data[id];
    		p['id']=id;
    		$scope.posts.push(p)
    	};
    	$scope.posts=$scope.posts.reverse();
        $state.go($state.current, {}, {reload: true});
        $scope.$broadcast('scroll.refreshComplete');
	});
}
