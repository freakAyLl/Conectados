/*
Para entender mejor el codigo sacar commentarios "//" a 
lineas: 47, 57, 76, 81, 87, 91, 94, 101, 108, 111, 131, 134, 140
*/




// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7; //declaro al $$ como palabra reservada.

var app = new Framework7({//defino una nueva instancia de mi framework7 llamada app
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {path:'/index/', url: 'index.html',},
      {path: '/tienda/', url: 'tienda.html'},
      {path: '/favoritos/', url: 'favoritos.html'},
      {path: '/cursos/', url: 'cursos.html'},
      {path: '/clases/', url: 'clases.html'},
      
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
//inicio de index
$$(document).on('page:init','.page[data-name="index"]', function (e) { 

})
//inicio de igamepage
$$(document).on('page:init', '.page[data-name="gamePage"]', function (e) {
})
//variables a usar en el sistema

//FUNCIONES
