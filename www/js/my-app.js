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


class Users{
  constructor(userName, userSurname, userAge, profilePic, userLevel, userCourses, userActivity, userCV){
    this.userName = userName;
    this.userSurname = userSurname;
    this.userAge = userAge;
    this.profilePic = profilePic;
    this.userLevel = userLevel;
    this.userCourses = userCourses;
    this.userActivity = userActivity;
    this.userCV = userCV; //teachers only
  }
}
class Classes{//class classes create objects classes
  constructor(idClasses,className, creatorMail, classShedule, classOverallSumary, classSumary, classRequirements, classPrice,  classVideoCall,  classDelayAllowed, classPicture){
    this.idClasses = idClasses;
    this.className = className;
    this.creatorMail = creatorMail;
    this.classShedule = classShedule;
    this.classOverallSumary = classOverallSumary;
    this.classSumary = classSumary;
    this.classRequirements = classRequirements;
    this.classPrice = classPrice;
    this.classVideoCall = classVideoCall;
    this.classDelayAllowed = classDelayAllowed;
    this.classPicture = classPicture;
  }
}


class Courses{//class courses create objects courses
  constructor(idCourse, creatorMail, lessons, courseSummary, completed, coursePrice, courseMedia, available){
    this.idCourse = idCourse;
    this.creatorMail = creatorMail;
    this.lessons = lessons;//it has Lesson names and ids
    this.courseSummary = courseSummary;
    this.completed = completed;
    this.coursePrice = coursePrice;
    this.courseMedia = courseMedia;
    this.available = available;
  }
}
class Content{//class content objects content for each lesson
  constructor(idlesson, contentCompleted, contentVideos, lessonSumary, extraLessonInfo, lessonMedia){
    this.idlesson = idlesson;
    this.contentCompleted = contentCompleted;
    this.contentVideos = contentVideos;
    this.lessonSumary = lessonSumary;
    this.extraLessonInfo = extraLessonInfo;
    this.lessonMedia = lessonMedia;
  }
}
//USER GLOBAL VARIABLES
let currentEmail= '';
let registered=false;
let tab=1;
//DATABASE VARIABLES
let db= firebase.firestore()
//COLLECTIONS
let usersCol= db.collection('Users')

//INIT EVENTS
//inicio de index
$$(document).on('page:init','.page[data-name="index"]', function (e) {
  checkLogin()
  tabOptions()
  if(registered){ createUser()}
})
//login init
$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#register').on('click', fnRegister)
  $$('#login').on('click', fnLogin)
})
//content init
$$(document).on('page:init', '.page[data-name="content"]', function (e) {
  selectedTab()
  updateProfile()
})

//DATABASE RELATED

//when a new person Registers, this functions add a new person to de collection
let createUser = () =>{
  let user = firebase.auth().currentUser;
  let newUser = new Users(user.userName ||'', user.userSurname ||'', user.userAge||'', user.profilePic ||'', user.userLevel ||'', user.userCourses ||'', user.userActivity ||'', user.userCV ||'')
  console.log('Cree un User: '+ newUser) 
  changeUsers(newUser, currentEmail)
}
//When someone clicks on update profile button (to develop) he can update his profile
let updateProfile = () => {
  let user = usersCol.doc(currentEmail).get()
  .then(()=>{
    let newUser = new Users(user.userName ||'', user.userSurname ||'', user.userAge||'', user.profilePic ||'', user.userLevel ||'', user.userCourses ||'', user.userActivity ||'', user.userCV ||'')//here i should put my new objects
    changeUsers( newUser, currentEmail)
  })
  .catch((error)=>{console.log('error: '+error)})
}
//Asign changes or new variables to collections
//IDEA: use a third argument to choose between collections to manage them with just one function. (collection, changes, id)
let changeUsers = ( changes, id) => {
  usersCol.doc(id).set(Object.assign({}, changes))
  .then(()=>{registered=false})
  .catch(()=>{console.log('no se creo con el id'+docRef)})
}


//FUNCTIONS
let selectedTab=()=>{app.tab.show('#tab-'+tab)}
let tabOptions =()=>{
  let options=document.querySelectorAll('.home-options')
  options.forEach((e)=>{
    e.addEventListener('click',()=>{
      mainView.router.navigate('/content/')
      if(e.classList.contains('home-clases')){tab=1}
      if(e.classList.contains('home-fav')){tab=2}
      if(e.classList.contains('home-courses')){tab=3}
      if(e.classList.contains('home-store')){tab=4}
    })
  })
}
let fnRegister = () =>{
  currentEmail = $$('#registerMail').val();
  var password = $$('#registerPass').val();
  firebase.auth().createUserWithEmailAndPassword(currentEmail, password)
      .then(()=> {
          console.log('voy a ir al index');
          mainView.router.navigate('/index/');
          console.log(currentEmail)
          registered=true
          console.log(registered)
      })
      .catch((error)=>{
        console.log('tambien ejecute el catch')
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
let fnLogin = () =>{
  currentEmail = $$('#loginMail').val();
  var password = $$('#loginPass').val();
  firebase.auth().signInWithEmailAndPassword(currentEmail, password)
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



