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
      {path: '/login/', url: 'login.html'},
      {path: '/content/', url: 'content.html'},
      {path: '/create/', url: 'create.html'},
    ]
    // ... other parameters
  });
var mainView = app.views.create('.view-main');

//Clases
class Users{
  constructor(userName, userSurname, userAge, profilePic, userLevel, userCourses, userActivity, userCV, userType){
    this.userName = userName ||'';
    this.userSurname = userSurname ||'';
    this.userAge = userAge ||'';
    this.profilePic = profilePic ||'';
    this.userLevel = userLevel ||0;
    this.userActivity = userActivity ||[];
    this.userCV = userCV ||''; //teachers only
    this.userType = userType || 'Student'
  }
}
class Classes{//class classes create objects classes
  constructor(className, creatorMail, classShedule, classSumary, classRequirements, classPrice,  classVideoCall,  classDelayAllowed, classPicture){
    this.className = className  ||'';
    this.creatorMail = creatorMail  ||'';
    this.classShedule = classShedule  ||'';
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
let name , surname , age, userType // usable just when profile is updated
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
let usersCol = db.collection('Users')
let classesCol = db.collection('Clases')

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
  updateProfile()
  tabOptions()
  if(registered){ createUser()}
  panelOpener()
  $$('#becomeTeacherBtn').on('click',becomeTeacherDialog)
  $$('#profileName').on('click', ()=>{promptGenerator('n')})
  $$('#profileSurname').on('click', ()=>{promptGenerator('s')})
  $$('#profileAge').on('click', ()=>{promptGenerator('a')})
})
//create init
$$(document).on('page:init', '.page[data-name="create"]', function (e) {
  datePicker()
  switchBtn()
  $$('#createClassBtn').on('click', createClass)

})
//login init
$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#register').on('click', fnRegister)
  $$('#login').on('click', fnLogin)
})
//content init
$$(document).on('page:init', '.page[data-name="content"]', function (e) {
  selectedTab()
  getClasses()
  searchBar()
})


/*obtain data from database using doc and calls change compare to the object created locally, then pass the new object to other functions.
IDEA: use to params to select collections and doc*/
let updateProfile = () => {
  usersCol.doc(currentEmail).get()
  .then((object)=>{
    let user= object.data()
    console.log('updating profile' +user)
    let newUser = new Users(name || user.userName , surname || user.userSurname, age || user.userAge, user.profilePic, user.userLevel, user.userCourses, user.userActivity, user.userCV, userType || user.userType)//here i should put my new objects
    console.log('downlodaing data'+ user)
    console.log(newUser)
    colUpdate( usersCol,newUser, currentEmail)
    updateApp(newUser)
  })
  .catch((error)=>{console.log('error: '+error)})
}

/*takes all classes and arrange them by order*/
let getClasses = ()=>{
  classesCol.get()
  .then((clases)=>{
    console.log(clases)
    clases.forEach((doc)=>{
      console.log(doc.id, '=>', doc.data())
    })
  })
  .catch((error)=>console.log('me fui por el error'))
}
/*insert every class in the correct tab*/
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

/*generates prompts for every field, selecting which one was clicked.*/
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
/*switcher to show and hide price field
IDEA: Change based in slider value. Also create something to check price to be positibe and okey. */
let switchBtn = () =>{
  $$('#abono').on('click', ()=>{
    if($$('#priceField').hasClass('visible')){
      $$('#priceField').val('0')
      $$('#priceField').removeClass('visible').addClass('invisible')
    }else{
      $$('#priceField').removeClass('invisible').addClass('visible')
    }
  })
}
/*create a Searchbar diferent for every tab*/
let searchBar=()=>{
  for(let i=0; i<5;i++){
    searchbar = app.searchbar.create({
        el: '.searchbar-'+i,
        searchContainer: '.list-'+i,
        searchIn: '.item-title',
        on: {
          search(sb, query, previousQuery) {
            console.log(query, previousQuery);
          }
        }
      })
  }
}

/*open dialogs and call for become teacher, the last one just set usertype and calls update rpofile */
let becomeTeacherDialog = () =>{app.dialog.confirm('Estas seguro? una vez que te hagas profesor no podras volver para atras!', 'Hazte Profesor', becomeTeacher , almost )}
let becomeTeacher = () =>{
  userType='Teacher'
  updateProfile()
}

/*Open Panels*/
let panelOpener = () =>{
  $$('.open-left-panel').on('click',  (e)=> { app.panel.open('left')});
  $$('.panel-close').on('click', (e)=> { app.closePanel()});
}

let newButtons=()=>{
  $$('#createClass').on('click', (e) =>{
    console.log('click')
    mainView.router.navigate('/create/');
    console.log('clicky')
  })
}
/*Update every screen off the app*/
let updateApp= (newUser)=>{
  console.log(newUser)
  console.log(newUser)
  if(newUser.userType=='Teacher'){
    $$('#becomeTeacherBtn').remove()
    $$('#lateralPanel').html(`
    <p class='block-title'>Menu de profesores</p>
    <div id="createClass" class="button button-fill panel-close  margin-vertical">Crear Clase</div>
    <div id="uploadCourse" class="button button-fill panel-close margin-vertical">Subir Curso</div>
    `)
    newButtons()
  }
  if(newUser.userName!=''){$$('#profileName').html(newUser.userName)}else{$$('#profileName').html('Inserte su Nombre')}
  if(newUser.userSurname!=''){$$('#profileSurname').html(newUser.userSurname)}else{$$('#profileSurname').html('Inserte su apellido')}
  if(newUser.userAge!=''){$$('#profileAge').html(newUser.userAge)}else{$$('#profileAge').html('Inserte su edad')}
}
/* create a object class from form info, and calls colUpdate with the object
and an id generated by mail + date
IDEA: Separate Checkers*/
let createClass = () =>{
  let mail = currentEmail
  let price = 0
  let classDelayAllowed = ''
  let classPicture = ''
  let classRequirements = ''
  let className =$$('#creation-class-title').val()
  let classLink = $$('#creation-class-link').val()
  let classSumary = $$('#creation-class-summary').val()
  let classShedule = $$('#demo-picker-date').val()
  if($$('#creation-class-price').val() != '' ){
    if(isNaN($$('#creation-class-price').val())){
      app.dialog.alert('Precio Invalido, por favor inserte un numero')
      return
    }else{
      price = $$('#creation-class-price').val() 
      console.log(price)
    }
  }
  let id =currentEmail+ ' '+ classShedule
  console.log('collecting data')
  if(className=='' || classLink==''|| classSumary==''){ 
    app.dialog.alert('Por favor complete todos los campos')
    return
  }
  console.log(classShedule)
  if(checkDate(classShedule)!= true){ 
    app.dialog.alert('Por favor Inserte una fecha valida')
    return
  }
  console.log(classShedule)
  let newClass= new Classes(className, mail, classShedule, classSumary, classRequirements , price,  classLink,  classDelayAllowed, classPicture|| '');
  colUpdate(classesCol, newClass, id)
  tab=1 
  app.dialog.alert('Clase creada exitosamente!')
  mainView.router.navigate('/index/')
}
/*Check if the date is correct when creating a new class*/
let checkDate=(str)=>{
  let now= new Date()
  let classDate = new Date(str)
  let timePast = now.getTime()>classDate.getTime()
  console.log(classDate.getTime())
  console.log(now.getTime())
  console.log(timePast)
  if (timePast){
    return false
  }else{
    classShedule = classDate.getTime()
    return true
  }
}

/*takes one object called changes, and one id and then uploads it to database
IDEA: use a third argument to choose between collections to manage them with just one function. (collection, changes, id)*/
let colUpdate = (colection,changes, id) => {//
  colection.doc(id).set(Object.assign({}, changes))
  .then(()=>{
    console.log(changes)
    registered=false//prevent catch to excecute
  })
  .catch(()=>{console.log('no se creo con el id'+docRef)})
}


/*creates new user from class users and excecute change users with its new object and current email*/
let createUser = () =>{
  let user = firebase.auth().currentUser;
  let newUser = new Users(user.userName , user.userSurname, user.userAge, user.profilePic, user.userLevel, user.userCourses, user.userActivity, user.userCV, user.userType)
  console.log('Cree un User: '+ newUser) 
  colUpdate(usersCol ,newUser, currentEmail)
}

/*show selected tab*/
let selectedTab=()=>{app.tab.show('#tab-'+tab)}
/*add tab buttons*/
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

/*register new Users and updates their profile to look like others*/
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

/*check if the current user is loged in*/
let checkLogin = () =>{ 
  var user = firebase.auth().currentUser;
  user?app.loginScreen.close():mainView.router.navigate('/login/');
}

/*log in and Updates profile*/
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

/*generates date picker on create view*/
let datePicker=()=>{
  var today = new Date();
  var pickerInline = app.picker.create({
    containerEl: '#demo-picker-date-container',
    inputEl: '#demo-picker-date',
    toolbar: false,
    rotateEffect: true,
    value: [
      today.getMonth(),
      today.getDate(),
      today.getFullYear(),
      today.getHours(),
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
    ],
    formatValue: function (values, displayValues) {
      return displayValues[0] + ' ' + values[1] + ' ' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [
      // Months
      {
        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
        displayValues: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      },
      // Years
      {
        values: (function () {
          var arr = [];
          for (var i = 2021; i <= 2030; i++) { arr.push(i); }
          return arr;
        })(),
      },
      // Space divider
      {
        divider: true,
        content: '&nbsp;&nbsp;'
      },
      // Hours
      {
        values: (function () {
          var arr = [];
          for (var i = 0; i <= 23; i++) { arr.push(i); }
          return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function () {
          var arr = [];
          for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
          return arr;
        })(),
      }
    ],
    on: {
      change: function (picker, values, displayValues) {
        var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
        if (values[1] > daysInMonth) {
          picker.cols[1].setValue(daysInMonth);
        }
      },
    }
  });
}

/*just used to not write console.log during each test*/
let allOk =() =>{ console.log('All ok')}
let almost =() =>{ console.log('almost XD')}