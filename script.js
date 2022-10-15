const nav   = document.getElementById('main-nav');
const line  = document.getElementById('line');
const list  = [document.getElementById('main-nav').getElementsByTagName('a')];
const data  = JSON.parse('{"cities":[{"section":"cupertino","label":"Cupertino"},{"section":"new-york-city","label":"New York City"},{"section":"london","label":"London"},{"section":"amsterdam","label":"Amsterdam"},{"section":"tokyo","label":"Tokyo"},{"section":"hong-kong","label":"Hong Kong"},{"section":"sydney","label":"Sydney"}]}');

//generate Nav based on JSON data
function makeNav(){
   for (var i = 0; i < data.cities.length; i++) {

      var city = data.cities[i];
      var li = document.createElement('li');
      var a  = document.createElement('a');

      a.id = city.section;
        a.appendChild(document.createTextNode(city.label));
        li.appendChild(a);
        nav.appendChild(li);
   }
}

//function to move line, and check active state, active clock
function lineMove(e){
  var theID = document.getElementById(e.srcElement.id);
  var positionInfo = e.srcElement.getBoundingClientRect();

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
  var findActive = document.getElementsByClassName('active');
  if(findActive){
    positionInfo = findActive[0].getBoundingClientRect();
    line.style.width = positionInfo.width +'px';
    line.style.transform = 'translateX('+ ((positionInfo.right -  positionInfo.width)-10) +'px)';
  }
}

// I know this is nuts, I was trying to stay fully vanilla JS and don't know how to do this
// without an API and library. I could have hard coded the times and offset the UTC,
// then just switched clocks on and off according to the 'active' nav item. But that
// feels bad too, because I am getting the city names dynamically, and should be fed into an API.
function stealTime(e){
  var theID = document.getElementById(e.srcElement.id);
  var timeString = theID.innerHTML;
  var url = new URL('https://time.is/'+ timeString);

  document.getElementById('clock-iframe').src = url;
}



//init
const init = () =>{
  makeNav();

  nav.addEventListener('click', (e) => {
    lineMove(e);
    stealTime(e);
  });

  onresize = () => {
    setTimeout(function(){
      recalculateOnResize();
    },1000)
  };

}

init();
