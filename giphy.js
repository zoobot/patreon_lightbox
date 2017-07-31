'use strict'
// bugs and notes
// counter starts from 0, probably annoying for non computer person
// slides dont update if new query

// Set the Settings for getting giphy
// var giphySettings ={
// 'giphyObject': '',
// 'dataLength': 0,
// 'limit': '11',
// 'keyID': 'f222812e2e4c46289fd468a4a4390c74',
// 'searchQuery': document.getElementById("user-input").value || 'Jupiter',
// 'url': `http://api.giphy.com/v1/gifs/search?q=${ this.searchQuery }&api_key=${ this.giphyKey }&limit=${ this.giphyLimit }&fmt=json`,
// 'slideIndex': 0,
// 'imageMedum': this.giphyObject.data[0].images.downsized_medium.url,
// 'imageLarge': this.giphyObject.data[0].images.downsized_large.url,
// 'imageOriginal': this.giphyObject.data[0].images.original.url
// }

var giphyObject = ''
var giphyDataLength = 0
const limit = '11'
const keyID = 'f222812e2e4c46289fd468a4a4390c74'
var searchQuery = document.getElementById("user-input").value || 'Jupiter'
var giphyURL = `http://api.giphy.com/v1/gifs/search?q=${ searchQuery }&api_key=${ keyID }&limit=${ limit }&fmt=json`
var slideIndex = 0;



fetchGiphy()

// input watcher
// change query based on form input

function fetchGiphy() {
  document.getElementById('user-input').onchange = function(){
    searchQuery =  this.value ||'jupiter'
    console.log('searchQuery',searchQuery)
    giphyURL = `http://api.giphy.com/v1/gifs/search?q=${ searchQuery }&api_key=${ keyID }&limit=${ limit }&fmt=json`
  fetchGiphy()
  }

  fetch(giphyURL)
  .then(data => data.json() )
  .then(json => {
    console.log(json)
    giphyObject = json
    giphyDataLength = giphyObject.data.length
    console.log('searchQuery in fetch',searchQuery)
  })
  .catch(error => console.log('fetch fail: ' + error.message))
  .then(() => createFrontPageImage(giphyObject))
}

  // Create a Lightbox start button
function createFrontPageImage(giphyObject) {
  console.log(searchQuery)
  if (searchQuery !== 'Jupiter') {
    var randomColor = "#000000".replace(/0/g,()=> (~~(Math.random()*16)).toString(16));
    console.log(randomColor)
    document.body.style.backgroundColor = randomColor
  }


  document.getElementsByTagName('header')[0].getElementsByTagName('h1')[0].innerHTML = searchQuery;
  var foundFrontPage = document.getElementById("front-page")

  // console.log('foundFrontPage',foundFrontPage)
  var img = document.createElement("img")
  img.src = giphyObject.data[0].images.original.url
  foundFrontPage.innerHTML = `<img src="${img.src}" />`
  // open the slide show Lightbox window onclick of column element
  console.log('searchQuery in front',searchQuery)
  foundFrontPage.onclick = () =>{
    openLightbox()
    createSlides()
  }
}

// display Lightbox by changing style to display block
function openLightbox() {
  document.getElementById('front-page').style.display = "none";
  document.getElementById('my-lightbox').style.display = "block";
}

// disappear Lightbox by changing style to display none
function closeLightbox() {
  document.getElementById('my-lightbox').style.display = "none";
  document.getElementById('front-page').style.display = "block";
}

// Create the slides
function createSlides() {
  console.log('searchQuery in slides',searchQuery)
  console.log('giphyObject.data[j].slug in slides',giphyObject.data[0].slug)
  console.log('giphyObject.data[j].slug in slides',giphyObject.data[0].images.original.url)

  var slides = document.getElementsByClassName("my-slides")[0];
  var captionText = document.getElementsByClassName("caption");
  // console.log('slides',slides)


  if (slides.length === undefined) {
    for (var j = 0;j <= giphyDataLength - 1;j++) {
      var divCaption = document.createElement('p')
      divCaption.className = "caption"
      var img = document.createElement("img")
      img.className = "slider"
      img.src = giphyObject.data[j].images.original.url
      if (slides.length === undefined) {
        divCaption.appendChild(document.createTextNode(giphyObject.data[j].slug));
        divCaption.appendChild(document.createTextNode(' ' + j +  '/' + (giphyDataLength - 1)))
        slides.appendChild(divCaption)
        slides.appendChild(img)
      } else {
        divCaption.innerHTML =
        divCaption.appendChild(document.createTextNode(' ' + j +  '/' + (giphyDataLength - 1)))
        slides.appendChild(divCaption)
        slides.appendChild(img)
      }
    }
  }
  showHide(slideIndex)
}

function showHide(n) {
  // find the dom elements created in createSlides function
  var captionText = document.getElementsByClassName("caption")
  var sliders = document.getElementsByClassName("slider")

  // Around the world navigation using the saved object
  if (n >= giphyDataLength) {
    slideIndex = 0
  }
  if (n < 0) {
    slideIndex = giphyDataLength - 1
  }

  // show and tag the active slide using css block, hide the rest with display none
  for (var i = 0; i < sliders.length; i++) {
    if (i === slideIndex) {
      captionText[i].className = "caption active";
      sliders[i].className = "slider active";
      captionText[i].style.display = "block"
      sliders[i].style.display = "block"
    } else {
      captionText[i].className = "caption";
      sliders[i].className = "slider";
      captionText[i].style.display = "none"
      sliders[i].style.display = "none"
    }
  }
}

// find the dom elements for next, prev, and close
var foundprev = document.getElementsByClassName("prev")[0];
var foundnext = document.getElementsByClassName("next")[0];
var closer = document.getElementsByClassName("close")[0];
// listeners for next, prev, and close
foundprev.onclick = () => onclick=showHide(slideIndex -= 1)
foundnext.onclick = () => onclick=showHide(slideIndex += 1)
closer.onclick = () => onclick=closeLightbox()