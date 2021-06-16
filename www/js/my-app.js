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
  constructor(userName, userSurname, userAge, profilePic, userLevel, userCourses, userActivity, userCV, userType){
    this.userName = userName ||'';
    this.userSurname = userSurname ||'';
    this.userAge = userAge ||'';
    this.profilePic = profilePic ||'';
    this.userLevel = userLevel ||0;
    this.userCourses = userCourses ||[];
    this.userActivity = userActivity ||[];
    this.userCV = userCV ||''; //teachers only
    this.userType = userType || 'Student'
  }
}
class Classes{//class classes create objects classes
  constructor(idClasses,className, creatorMail, classShedule, classOverallSumary, classSumary, classRequirements, classPrice,  classVideoCall,  classDelayAllowed, classPicture){
    this.idClasses = idClasses;
    this.className = className  ||'';
    this.creatorMail = creatorMail  ||'';
    this.classShedule = classShedule  ||'';
    this.classOverallSumary = classOverallSumary  ||'';
    this.classSumary = classSumary  ||'';
    this.classRequirements = classRequirements || [];
    this.classPrice = classPrice  || 0;
    this.classVideoCall = classVideoCall  ||'';
    this.classDelayAllowed = classDelayAllowed  || 10;
    this.classPicture = classPicture  ||'';
  }
}


class Courses{//class courses create objects courses
  constructor(idCourse, creatorMail, lessons, courseSummary, completed, coursePrice, courseMedia, available){
    this.idCourse = idCourse;
    this.creatorMail = creatorMail  ||'';
    this.lessons = lessons  ||'';//it has Lesson names and ids
    this.courseSummary = courseSummary ||'';
    this.completed = completed  || false;
    this.coursePrice = coursePrice || 0;
    this.courseMedia = courseMedia ||[];
    this.available = available  || true;
  }
}
class Content{//class content objects content for each lesson
  constructor(idlesson, contentCompleted, contentVideos, lessonSumary, extraLessonInfo, lessonMedia){
    this.idlesson = idlesson;
    this.contentCompleted = contentCompleted || false;
    this.contentVideos = contentVideos || '';
    this.lessonSumary = lessonSumary || '';
    this.extraLessonInfo = extraLessonInfo ||'';
    this.lessonMedia = lessonMedia || [];
  }
}
/*--------------------------------------------                  ______  ---------------------------------------------------*/
/*--------------------------------------------                 / UGB /  ---------------------------------------------------*/
/*--------------------------------------------                /_____/   ---------------------------------------------------*/
/*--------------------------------------------      (▀̿Ĺ̯▀̿ ̿))  //         ---------------------------------------------------*/
/*--------------------------------------------       |    |-//          ---------------------------------------------------*/
/*--------------------------------------------  USER GLOBAL VARIABLES   ---------------------------------------------------*/
/*--------------------------------------------       |    |/            ---------------------------------------------------*/
/*--------------------------------------------       | || |             ---------------------------------------------------*/
/*--------------------------------------------       ``````             ---------------------------------------------------*/
let currentEmail= '';
let registered=false;
let tab=1;
let name , surname , age
/*-------------------------------------------                   ______  ---------------------------------------------------*/
/*-------------------------------------------                  / DB  /  ---------------------------------------------------*/
/*-------------------------------------------                 /_____/   ---------------------------------------------------*/
/*-------------------------------------------       ┗|｀O′|┛ //         ---------------------------------------------------*/
/*-------------------------------------------        |    |-//          ---------------------------------------------------*/
/*-------------------------------------------    DATABASE RELATED       ---------------------------------------------------*/
/*-------------------------------------------        |    |/            ---------------------------------------------------*/
/*-------------------------------------------        | || |             ---------------------------------------------------*/
/*-------------------------------------------        ``````             ---------------------------------------------------*/
let db= firebase.firestore()
//COLLECTIONS
let usersCol= db.collection('Users')

/*--------------------------------------------                   ______  ---------------------------------------------------*/
/*--------------------------------------------                  /INIT /  ---------------------------------------------------*/
/*--------------------------------------------                 /_____/   ---------------------------------------------------*/
/*--------------------------------------------       (ง •_•)ง)//         ---------------------------------------------------*/
/*--------------------------------------------       |    |  //          ---------------------------------------------------*/
/*--------------------------------------------       |INIT| //            --------------------------------------------------*/
/*--------------------------------------------       |    |//            ---------------------------------------------------*/
/*--------------------------------------------       | || |/             ---------------------------------------------------*/
/*--------------------------------------------       ``````             ----------------------------------------------------*/
//inicio de index

$$(document).on('page:init','.page[data-name="index"]', function (e) {
  checkLogin()
  tabOptions()
  if(registered){ createUser()}
  panelOpener()
  $$('#becomeTeacherBtn').on('click',becomeTeacherDialog)
  $$('#profileName').on('click', ()=>{promptGenerator('n')})
  $$('#profileSurname').on('click', ()=>{promptGenerator('s')})
  $$('#profileAge').on('click', ()=>{promptGenerator('a')})

})
//login init
$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#register').on('click', fnRegister)
  $$('#login').on('click', fnLogin)
})
//content init
$$(document).on('page:init', '.page[data-name="content"]', function (e) {
  selectedTab()
})

 /*
 Teacher related to do.
  1. Obtain current user.
  2. Change user type.
  3. function to detect if is a teacher and show teacher options.
  */

/*--------------------------------------------        ____               ---------------------------------------------------*/
/*--------------------------------------------      __|00|__     ______  ---------------------------------------------------*/
/*--------------------------------------------      |______|    / FN  /  ---------------------------------------------------*/
/*--------------------------------------------    ＼（〇_ｏ）／ /_____/   ---------------------------------------------------*/
/*--------------------------------------------      \|    |/             ---------------------------------------------------*/
/*--------------------------------------------      FUNCTIONS            ---------------------------------------------------*/
/*--------------------------------------------       |    |              ---------------------------------------------------*/
/*--------------------------------------------       | || |              ---------------------------------------------------*/
/*--------------------------------------------     ````````              ---------------------------------------------------*/
let promptGenerator = (key)=>{
  console.log('ejecutado')
  switch (key){
    case 'n':
      app.dialog.prompt('Inserte su nombre', 'Actualizando Perfil', function (value){
        name=value;
        updateProfile()
      })
      break;
    case 's':
      app.dialog.prompt('Inserte su Apellido', 'Actualizando Perfil', function (value){
        surname=value;
        updateProfile()
      })
      break;
    case 'a':
      app.dialog.prompt('Inserte su edad', 'Actualizando Perfil', function (value){
        age=value;
        updateProfile()
      })
      break;
  }
}

let updateApp= (newUser)=>{
    console.log(newUser)
    console.log(newUser)
    if(newUser.userName!=''){$$('#profileName').html(newUser.userName)}else{$$('#profileName').html('Inserte su Nombre')}
    if(newUser.userSurname!=''){$$('#profileSurname').html(newUser.userSurname)}else{$$('#profileSurname').html('Inserte su apellido')}
    if(newUser.userAge!=''){$$('#profileAge').html(newUser.userAge)}else{$$('#profileAge').html('Inserte su edad')}
}
let updateProfile = () => {
  usersCol.doc(currentEmail).get()
  .then((object)=>{
    let user= object.data()
    console.log('updating profile' +user)
    let newUser = new Users(name ||user.userName , surname || user.userSurname, age || user.userAge, user.profilePic, user.userLevel, user.userCourses, user.userActivity, user.userCV, user.userType)//here i should put my new objects
    console.log('downlodaing data'+ user)
    console.log(newUser)
    changeUsers( newUser, currentEmail)
    updateApp(newUser)
  })
  .catch((error)=>{console.log('error: '+error)})
}
let becomeTeacherDialog = () =>{app.dialog.confirm('Estas seguro? una vez que te hagas profesor no podras volver para atras!', 'Hazte Profesor', becomeTeacher , almost )}
let becomeTeacher = () =>{}
let changeUsers = ( changes, id) => {
  usersCol.doc(id).set(Object.assign({}, changes))
  .then(()=>{registered=false})
  .catch(()=>{console.log('no se creo con el id'+docRef)})
}

//when a new person Registers, this functions add a new person to de collection
let createUser = () =>{
  let user = firebase.auth().currentUser;
  let newUser = new Users(user.userName , user.userSurname, user.userAge, user.profilePic, user.userLevel, user.userCourses, user.userActivity, user.userCV, user.userType)
  console.log('Cree un User: '+ newUser) 
  changeUsers(newUser, currentEmail)
}

//When someone clicks on update profile button (to develop) he can update his profile

let panelOpener = () =>{
  $$('.open-left-panel').on('click', function (e) {
    // 'left' position to open Left panel
    app.panel.open('left');
 });
 $$('.panel-close').on('click', function (e) {
  app.closePanel();
});
}
//Asign changes or new variables to collections
//IDEA: use a third argument to choose between collections to manage them with just one function. (collection, changes, id)

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
          updateProfile()
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
  user?app.loginScreen.close():mainView.router.navigate('/login/');
}
let fnLogin = () =>{
  currentEmail = $$('#loginMail').val();
  var password = $$('#loginPass').val();
  firebase.auth().signInWithEmailAndPassword(currentEmail, password)
  .then((userCredential) => {
    var user = userCredential.user;
    updateProfile()
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

let allOk =() =>{ console.log('All ok')}
let almost =() =>{ console.log('almost XD')}