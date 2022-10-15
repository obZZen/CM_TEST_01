const request = new XMLHttpRequest();
  request.open("GET", "navigation.json", false);
  request.send(null);
const data  = JSON.parse(request.responseText);

const nav   = document.getElementById('main-nav');
const line  = document.getElementById('line');
const list  = [document.getElementById('main-nav').getElementsByTagName('a')];
let timeUpdate;

//generate Nav based on JSON data
function makeNav(){
   for (var i = 0; i < data.cities.length; i++) {

      let city = data.cities[i];
      let li = document.createElement('li');
      let a  = document.createElement('a');

        a.id = city.section; // set id
        a.setAttribute('timezone', city.timezone); // set timezone
        a.appendChild(document.createTextNode(city.label)); // set label text
        li.appendChild(a);
        nav.appendChild(li);
   }
}

//function to move line, and check active state, active clock
function lineMove(e){
  let theID = document.getElementById(e.srcElement.id);
  let positionInfo = e.srcElement.getBoundingClientRect();

  //check and set active states
  for (var i = 0; i < list[0].length; i++){
    if(theID == list[0][i]){
      list[0][i].classList.add('active');
    }else{
      list[0][i].classList.remove('active');
    }
  }

  //transform line
  line.classList.remove('hide');
  line.style.width = positionInfo.width +'px';
  line.style.transform = 'translateX('+ ((positionInfo.right -  positionInfo.width)-10) +'px)';

  //clicking the nav, but not a navitem, reset line
  if(positionInfo.width > 1000){
    line.classList.add('hide');
  }

}

//re-calibrate line, based on which nav item is active
function recalculateOnResize(){
  let findActive = document.getElementsByClassName('active');
  if(findActive){
    positionInfo = findActive[0].getBoundingClientRect();
    line.style.width = positionInfo.width +'px';
    line.style.transform = 'translateX('+ ((positionInfo.right -  positionInfo.width)-10) +'px)';
  }
}


// grab timezone attribute from clicked
function resetTime(e){
   let theID = document.getElementById(e.srcElement.id);
   let zone  = theID.getAttribute('timezone');
   let localTime = getTimeByZone(zone);
}



function getTimeByZone(timeZone){
    let now = new Date(Date.now());
    let printTime = document.getElementById('clock');
    let printDate = document.getElementById('date');

    if(now != null){
      timeUpdate = setInterval(function(){
        if(timeZone != null){
          let now = new Date(Date.now());
          let month = now.toLocaleDateString('en-US',{timeZone,month:'long'}).substring(0,3);
          let localDateString =  now.toLocaleDateString('en-US',{timeZone});

          let date = new Date(localDateString).getDate();
          let year = new Date(localDateString).getFullYear();
          let customTimeString = date + ' ' + month + ', '+ year;

          let time = now.toLocaleTimeString('en-US',{timeZone,hour12:false});

          printTime.innerHTML = time;
          printDate.innerHTML = customTimeString;

          return {date:customTimeString,time}

      } else {
        //reset clock if clicked off city
        printTime.innerHTML = '';
        printDate.innerHTML = '';
      }
    },1000)
  }

}


//init
const init = () =>{
  makeNav();

  nav.addEventListener('click', (e) => {
    lineMove(e);
    clearInterval(timeUpdate);
    resetTime(e);
  });

  onresize = () => {
    setTimeout(function(){
      recalculateOnResize();
    },1000)
  };

}

init();
