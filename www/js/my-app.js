
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
      {path: '/login/', url: 'login.html'},
      {path: '/register/', url: 'register.html'},
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
//inicio de index
$$(document).on('page:init','.page[data-name="index"]', function (e) {
  mainView.router.navigate('/login/')
})
//register init
$$(document).on('page:init', '.page[data-name="register"]', function (e) {
  $$('#register').on('click', addinputlisteners)
})
//login init
$$(document).on('page:init', '.page[data-name="register"]', function (e) {
  $$('#login').on('click', addinputlisteners)
})
//variables

let addinputlisteners=()=>{
    var email = $$('#registerMail').val();
    var clave = $$('#registerIndex').val();
    firebase.auth().createUserWithEmailAndPassword(email, clave)
        .then( ()=> {
            //si no hay errores pasa al index
            console.log('que paso??');
            mainView.router.navigate('/index/');
        })
        .catch( (error)=> {
          //si hay errores podemos mostrarlos
          console.error(error.code);
          if (error.code == "auth/email-already-in-use") {
            //crear dialogo de error
              console.error("el mail ya existe...");
          }
      });
}



