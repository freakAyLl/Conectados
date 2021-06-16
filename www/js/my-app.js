
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
      {path: '/content/', url: 'content.html'},
    ]
    // ... other parameters
  });
var mainView = app.views.create('.view-main');
//Objetos


//inicio de index
$$(document).on('page:init','.page[data-name="index"]', function (e) {
  checkLogin()
  tabOptions()
})
//login init
$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#register').on('click', fnRegister)
  $$('#login').on('click', fnLogin)
})
$$(document).on('page:init', '.page[data-name="content"]', function (e) {selectedTab()})

//variables
let tab=1

let selectedTab=()=>{app.tab.show('#tab-'+tab)}

let tabOptions =()=>{
  let options=document.querySelectorAll('.home-options')
  console.log(options)
  options.forEach((e)=>{
    e.addEventListener('click',()=>{
      if(e.classList.contains('home-clases')){
        mainView.router.navigate('/content/')
        tab=1
      }
      if(e.classList.contains('home-fav')){
        mainView.router.navigate('/content/')
        tab=2
      }
      if(e.classList.contains('home-courses')){
        mainView.router.navigate('/content/')
        tab=3
      }
      if(e.classList.contains('home-store')){
        mainView.router.navigate('/content/')
        tab=4
      }
    })
  })
}
let fnRegister=()=>{
  var email = $$('#registerMail').val();
  var password = $$('#registerPass').val();
  firebase.auth().createUserWithEmailAndPassword(email, password)
      .then( ()=> {
          console.log('voy a ir al index');
          mainView.router.navigate('/index/');
      })
      .catch( (error)=> {
        console.error(error.code);
        switch (error.code){
          case 'auth/email-already-in-use':
            app.dialog.alert('Su Email ya se encuentra en uso.')
            break
          case 'auth/invalid-email':
            app.dialog.alert('Email invalido, por favor ingrese uno valido.')
            break
          case 'auth/weak-password':
            app.dialog.alert('Contraseña debil, por favor cambiela.')
            break
          default:
            app.dialog.alert('Ups, algo salio mal')
        }
    });
}
let checkLogin = () =>{ 
  var user = firebase.auth().currentUser;
    if (user) {
      app.loginScreen.close()
    } else {
      mainView.router.navigate('/login/')
    }
}
let fnLogin=()=>{
  var email = $$('#loginMail').val();
  var password = $$('#loginPass').val();
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    var user = userCredential.user;
    mainView.router.navigate('/index/')
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    switch (errorCode){
      case 'auth/invalid-email':
        app.dialog.alert('Error, email incorrecto')
        break
      case 'auth/user-disabled':
      app.dialog.alert('Usuario baneado, por favor contactenos si cree esto que es un error.')
        break
      case 'auth/user-not-found':
        app.dialog.alert('Error, Usuario no encontrado')
        break
      case 'auth/wrong-password':
        app.dialog.alert('Error, Contraseña incorrecta')
        break
      default:
        app.dialog.alert('Ups, algo salio mal')
    }
  });
}




