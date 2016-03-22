angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('principal.posts', {
    url: '/posts',
    views: {
      'tab1': {
        templateUrl: 'templates/posts.html',
        controller: 'postsCtrl'
      }
    }
  })

  .state('principal.nuevoPost', {
    url: '/nuevoPost',
    views: {
      'tab2': {
        templateUrl: 'templates/nuevoPost.html',
        controller: 'nuevoPostCtrl'
      }
    }
  })
  .state('principal.acercaDe', {
    url: '/acercaDe',
    views: {
      'tab3': {
        templateUrl: 'templates/acercaDe.html',
        controller: 'acercaDeCtrl'
      }
    }
  })
  .state('principal', {
    url: '/principal',
    templateUrl: 'templates/principal.html',
    abstract:true
  })

  .state('coletoEnglishClass', {
    url: '/login',
    templateUrl: 'templates/coletoEnglishClass.html',
    controller: 'coletoEnglishClassCtrl'
  })

  .state('nuevoUsuario', {
    url: '/nuevoUsuario',
    templateUrl: 'templates/nuevoUsuario.html',
    controller: 'nuevoUsuarioCtrl'
  })

  .state('detallePost', {
    url: '/detallePost/{id}',
    templateUrl: 'templates/detallePost.html',
    controller: 'detallePostCtrl'
  })

if(localStorage.getItem('nombre')){
    $urlRouterProvider.otherwise('/principal/posts')
}else{
    $urlRouterProvider.otherwise('/login')
}


  

});