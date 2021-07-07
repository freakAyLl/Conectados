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
  constructor(userName, userSurname, userAge, profilePic, userLevel, userCourses, userFavoriteTeacher, userFavoriteClass, userCV, userType){
    this.userName = userName ||'';
    this.userSurname = userSurname ||'';
    this.userAge = userAge ||'';
    this.profilePic = profilePic ||'';
    this.userLevel = userLevel ||0;
    this.userCourses = userCourses || []
    this.userFavoriteTeacher = userFavoriteTeacher ||[];
    this.userFavoriteClass= userFavoriteClass ||[];
    this.userCV = userCV ||''; //teachers only
    this.userType = userType || 'Student'
  }
}
class Classes{//class classes create objects classes
  constructor(className, creatorMail, classShedule, classSumary, classDuration, classPrice,  classVideoCall,  classDelayAllowed, classPicture){
    this.className = className  ||'';
    this.creatorMail = creatorMail  ||'';
    this.classShedule = classShedule  ||'';
    this.classSumary = classSumary  ||'';
    this.classDuration = classDuration || 0;
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
let name , surname , age, userType, userFavoriteClass,userFavoriteTeacher// usable just when profile is updated
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
  $$('#createClassBtn').on('click', createClass)
  $$('#newMeet').on('click', ()=>cordova.InAppBrowser.open('https://meet.google.com/new'))
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

$$(document).on('card:open', '.page[data-name="content"]', function (e){ 
  $$('.searchbar').addClass('searchInvisible')
})
$$(document).on('card:close', '.page[data-name="content"]', function (e){ 
  $$('.searchbar').removeClass('searchInvisible')
})
/*--------------------------------------------        ____               ---------------------------------------------------*/
/*--------------------------------------------      __|00|__     ______  ---------------------------------------------------*/
/*--------------------------------------------      |______|    / FN  /  ---------------------------------------------------*/
/*--------------------------------------------    ＼（〇_ｏ）／ /_____/   ---------------------------------------------------*/
/*--------------------------------------------      \|    |/             ---------------------------------------------------*/
/*--------------------------------------------      FUNCTIONS            ---------------------------------------------------*/
/*--------------------------------------------       |    |              ---------------------------------------------------*/
/*--------------------------------------------       | || |              ---------------------------------------------------*/
/*--------------------------------------------     ````````              ---------------------------------------------------*/

/*obtain data from database using doc and calls change compare to the object created locally, then pass the new object to other functions.
IDEA: use to params to select collections and doc*/
let updateProfile = () => {
  usersCol.doc(currentEmail).get()
  .then((object)=>{
    let user= object.data()
    console.log('updating profile' +user)
    let newUser = new Users(name || user.userName , surname || user.userSurname, age || user.userAge, user.profilePic, user.userLevel, user.userCourses, userFavoriteTeacher ||user.userFavoriteTeacher, userFavoriteClass, user.userCV, userType || user.userType)//here i should put my new objects
    console.log('downlodaing data'+ user)
    console.log(newUser)
    colUpdate( usersCol,newUser, currentEmail)
    updateApp(newUser)
  })
  .catch((error)=>{console.log('error: '+error)})
}

/*takes all classes and arrange them by order*/
let getClasses = ()=>{
  let classArray=[]
  classesCol.get()
  .then((clases)=>{
    clases.forEach((doc)=>{
      console.log(doc.data().classShedule)
      if(checkDate(doc.data().classShedule)){
        classArray.push(doc.data())} //filter to push just future clases IDEA: add a param to show the classes with dellay alowed also
    })
    console.log(classArray)
    classInsert(classArray)
  })
  .catch((error)=>console.log('me fui por el error'))
}

/*Check if the date is correct while creating a new class*/
let checkDate=(str)=>{
  let now = new Date()
  let classDate = new Date(str)
  console.log('classdate '+classDate.getTime())
  console.log('ahora '+now)
  let timePast = now.getTime()>classDate.getTime()
  console.log(timePast)
  if (timePast){
    console.log('tu clase ya paso')
    return false
  }else{
    console.log('tu clase no paso')
    return true
  }
}

/*sort by date Classes and insert them as cards in tab
IDEA: Change the code below to make a better looking card when expanded*/
let classInsert = (arr) =>{
  arr.sort((a,b)=>{return new Date(a.classShedule) - new Date(b.classShedule)}) //sort by date 
  let parent = document.getElementById('classTabContainer')
  parent.innerHTML= ''
  let i=0, j=0, toErrase='', toFav=''
  arr.forEach((eachClass)=>{
    usersCol.doc(eachClass.creatorMail).get()
    .then((teacher)=>{
      let classTeacher=teacher.data()
      let name= classTeacher.userName + ' ' + classTeacher.userSurname
      let cv = classTeacher.userCV
      let link = eachClass.classVideoCall
      let price = 'gratis!'
      //console.log('creator'+eachClass.creatorMail)
      if(eachClass.classPrice!=0){[price= 'por $'+eachClass.classPrice+'!']}
      let li= document.createElement('li')
      let cSh = eachClass.classShedule
      let index = cSh.indexOf('-')
      let index2 = cSh.indexOf(' ')
      let time = cSh[index+1]+cSh[index+2]+'-'+ cSh.substring(0,index)+ ' | '+cSh.substring(index2, cSh.length)+'hs' 
      console.log(cSh)
      console.log(time)
      console.log('consegui el '+li.innerHTML)
      if(eachClass.creatorMail == currentEmail){
        cardBtn=`<div class="fab fab-left-bottom card-btn color-red erraseVideocall open-confirm" id="erraseVideocall${j}">
        <a href="#">
          <span class="material-icons ">delete_forever</span>
        </a>
      </div>
      <div class="fab fab-extended fab-right-bottom color-blue joinVideocall" id="JoinVideocall${i}">
          <a href="#">
            <span class="material-icons margin-left">video_call</span>
            <div class="fab-text">Unirse ${price}</div>
          </a>
        </div>`
      }else{
        cardBtn=`
      <div class="fab fab-left-bottom card-btn color-yellow favTeacher" >
        <a href="#">
          <i class="icon material-icons md-only">star</i>
          <i class="icon material-icons md-only">close</i>
        </a>
        <div class="fab-buttons fab-buttons-top">
          <a class="fab-label-button" id="favTeacher${j}" href="#"><span>1</span><span class="fab-label" >Profesor</span></a>
          <a class="fab-label-button" id="favClass${j}" href="#"><span>2</span><span class="fab-label" >Clase</span></a>
        </div>
      </div>
      <div class="fab fab-extended fab-right-bottom color-blue joinVideocall" id="JoinVideocall${i}">
        <a href="#">
          <span class="material-icons margin-left">
            video_call
            </span>
          <div class="fab-text">Unirse ${price}</div>
        </a>
      </div>`
      }
      li.innerHTML=`<li class="item-content card card-expandable lazy lazy-fade-in demo-laz item-inner">
      <div class="card-content">
        <div class="" style="height: 30vh">
          <img src="/img/zumba.jpg" class="card-image" alt="">
          <i class='shape1'></i>
          <div class="card-header item-title text-color-white display-block no-margin-bottom">${eachClass.className}<br />
            <small class="sub-title-card"> ${time} <br/> ${name}</small>
          </div>
          <a href="#" class="link card-close card-opened-fade-in color-white"
            style="position: absolute; right: 15px; top: 15px">
            <i class="icon f7-icons">xmark_circle_fill</i>
          </a>
        </div>
        <div class="card-content-padding">
          <div class="block-title text-align-center text-color-black ">Clase</div>
          <p>${eachClass.classSumary}</p>
          <div class="block-title text-align-center text-color-black">Profesor:</div>
          <p>${cv}</p>
      </div>
      ${cardBtn} 
    </li>`
      parent.appendChild(li)
      $$('#JoinVideocall'+i).on('click',function(e){
        console.log(e)
        //join videocall
        console.log("link: "+link)
        console.log(link.includes('https://'))
        if(link.includes('https://')){
          console.log('all okay')
          cordova.InAppBrowser.open(link)
        }else{
          console.log("i'll open new with https")
          cordova.InAppBrowser.open('https://'+link)
        }

        
      })
      $$('#erraseVideocall'+j).on('click',function(e){
        toErrase = currentEmail+' '+ cSh
        app.dialog.confirm('Estas seguro que deseas borrar esta clase?', 'Borrar clase', function (){erraseClass(toErrase)})
      })
      $$('#favTeacher'+j).on('click',function(e){
        console.log('favedTeacher'+e)
        //fav the teacher
        TeacherToFav = eachClass.creatorMail
        favTeacher(TeacherToFav)
      })
      $$('#favClass'+j).on('click',function(e){
        console.log('favedClass'+e)
        ClassToFav = eachClass.creatorMail + " " + eachClass.classShedule
        favTeacher(ClassToFav)
      })
      j++
      i++
    })
    .catch((error)=>{console.log(error)})
  })
}
/*take current user class, delete it from database*/
let erraseClass = (toErrase)=>{
  console.log('I will errase '+toErrase)
  classesCol.doc(toErrase).delete()
  .then(()=>{
    getClasses()
    app.card.close()
    app.dialog.alert('Clase borrada')
    console.log('borradaso pa')
  })
  .catch((error)=>{
    console.log(error)
  })
}
/*take class teacher and fav it*/
let favTeacher = (toFav) => {
  console.log('to fav:'+toFav)
  usersCol.doc(currentEmail).get()
  .then((currUser)=>{
    let actualUs = currUser.data()
    console.log(typeof(actualUs.userFavoriteClass))
    if(actualUs.userFavoriteClass.includes(toFav)){
      app.dialog.alert('Este profesor ya es tu favorito', 'Ups')
      return
    }
    userFavoriteClass = actualUs.userFavoriteClass
    console.log(actualUs.userFavoriteClass)
    updateProfile()
  })
  .catch((error)=>console.log(error))
}

let favClass = (toFav) => {
  console.log('to fav:'+toFav)
  usersCol.doc(currentEmail).get()
  .then((currUser)=>{
    let actualUs = currUser.data()
    if(actualUs.userFavoriteTeacher.includes(toFav)){
      app.dialog.alert('Esta clase ya es tu favorita', 'Ups')
      return
    }
    actualUs.userFavoriteTeacher.push(toFav)
    userFavoriteTeacher = actualUs.userFavoriteTeacher
    console.log(actualUs.userFavoriteTeacher)
    updateProfile()
  })
  .catch((error)=>console.log(error))
}
/*takes one object called changes, and one id and then uploads it to database
IDEA: use a third argument to choose between collections to manage them with just one function. (collection, changes, id)*/
let colUpdate = (colection,changes, id) => {//
  colection.doc(id).set(Object.assign({}, changes))
  .then(()=>{registered=false})
  .catch(()=>{console.log('no se creo con el id'+docRef)})
}

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
    mainView.router.navigate('/create/');
  })
}
/*Update every screen off the app*/
let updateApp= (newUser)=>{
  if(newUser.userType=='Teacher'){
    $$('#becomeTeacherBtn').remove()
    $$('#lateralPanel').html(`
    <p class='block-title'>Menu de profesores</p>
    <div id="createClass" class="home-fav  text-color-black button button-fill panel-close  margin-vertical">Crear Clase</div>
    <div id="uploadCourse" class="home-courses text-color-black button button-fill panel-close margin-vertical">Subir Curso</div>
    <div id="createClass" class="home-store text-color-black button button-fill panel-close  margin-vertical">Subir Curriculum</div>
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
  let classDelayAllowed = $$('#creation-class-dellay').val()
  let classPicture = ''
  let classDuration = $$('#creation-class-duration').val()
  let className =$$('#creation-class-title').val()
  let classLink = $$('#creation-class-link').val()
  let classSumary = $$('#creation-class-summary').val()
  let classShedule = $$('#demo-calendar-date-time').val()
  console.log(classShedule)
  if($$('#creation-class-price').val() != '' ){
    if(isNaN($$('#creation-class-price').val())){
      app.dialog.alert('Precio Invalido, por favor inserte un numero')
      return
    }else{
      price = $$('#creation-class-price').val() 
    }
  }
  let id =currentEmail+ ' '+ classShedule
  console.log('collecting data')
  if(className=='' || classLink==''|| classSumary=='' || classDelayAllowed==''|| classDuration==''){ 
    app.dialog.alert('Por favor complete todos los campos')
    return
  }
  if(classShedule=='' || checkDate(classShedule)!= true){ 
    app.dialog.alert('Por favor Inserte una fecha valida')
    return
  }
  let newClass= new Classes(className, mail, classShedule, classSumary, classDuration , price,  classLink,  classDelayAllowed, classPicture|| '');
  colUpdate(classesCol, newClass, id)
  tab=1 
  app.dialog.alert('Clase creada exitosamente!')
  mainView.router.navigate('/index/')
}

/*creates new user from class users and excecute change users with its new object and current email*/
let createUser = () =>{
  let user = firebase.auth().currentUser;
  let newUser = new Users(user.userName , user.userSurname, user.userAge, user.profilePic, user.userLevel, user.userCourses, user.userFavoriteTeacher, user.userFavoriteClass, user.userCV, user.userType)
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
  let calendarDateTime = app.calendar.create({
    inputEl: '#demo-calendar-date-time',
    timePicker: true,
    dateFormat: 'mm-dd-yyyy HH::mm'
  });
}

/*just used to not write console.log during each test*/
let allOk =() =>{ console.log('All ok')}
let almost =() =>{ console.log('almost XD')}