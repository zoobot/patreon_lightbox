/*
Patreon Lightbox - shows an image from giphy.com request

*/

let giphy = {
'savedData': '',
'dataLength': 0,
'limit': '11',
'keyID': 'f222812e2e4c46289fd468a4a4390c74',
'searchQuery': 'Jupiter',
'slideIndex': 0
}

giphy.url = `http://api.giphy.com/v1/gifs/search?q=${ giphy.searchQuery }&api_key=${ giphy.keyID }&limit=${ giphy.limit }&fmt=json`


fetchGiphy()

function fetchGiphy() {
  // input watcher
  // change query based on form input
  document.getElementById('user-input').onchange = function(){
    giphy.searchQuery =  this.value || giphy.queryDefault
    giphy.url = `http://api.giphy.com/v1/gifs/search?q=${ giphy.searchQuery }&api_key=${ giphy.keyID }&limit=${ giphy.limit }&fmt=json`
    fetchGiphy()
  }

  var fetchURL = giphy.url
  // Actual fetch, for real
  fetch(fetchURL)
  .then(data => data.json() )
  .then(json => {
    giphy.savedData = json
    giphy.dataLength = giphy.savedData.data.length
  })
  .catch(error => console.log('fetch fail: ' + error.message))
  .then(() => createFrontPageImage())
}

function generateRandomColor() {
  var randomColorBody = '#000000'.replace(/0/g,()=> (~~(Math.random()*16)).toString(16));
  var randomColorHeader = '#000000'.replace(/0/g,()=> (~~(Math.random()*16)).toString(16));
  document.body.style.backgroundColor = randomColorBody
  document.getElementsByTagName('header')[0].style.backgroundColor = randomColorHeader
}

// Create a Lightbox start button
function createFrontPageImage() {
  // Set the header text
  document.getElementsByTagName('header')[0].getElementsByTagName('h1')[0].innerHTML = giphy.searchQuery;

  // Find the front-page element
  var foundFrontPage = document.getElementById('front-page')

  // Add a front page image to the dom
  var img = document.createElement('img')
  img.src = giphy.savedData.data[0].images.original.url
  foundFrontPage.innerHTML = `<img src='${img.src}' id='front-image'/>`

  if (giphy.searchQuery !== 'Jupiter') {
    generateRandomColor()
  } else {
    img.className = 'jupiter'
  }

  var foundFrontPageImage = document.getElementById('front-image')
  foundFrontPageImage.onclick = () => {
    openLightbox()
    createSlides()
  }
}

// display Lightbox by changing style to display block
function openLightbox() {
  document.getElementById('front-page').style.display = 'none'
  document.getElementById('my-lightbox').style.display = 'block'
}

// disappear Lightbox by changing style to display none
function closeLightbox() {
  document.getElementById('my-lightbox').style.display = 'none'
  document.getElementById('front-page').style.display = 'block'
}

// Create the slides
function createSlides() {
  document.getElementsByClassName('lightbox-slides')[0].innerHTML = '';
  giphy.slideIndex = 0

  var slides = document.getElementsByClassName('lightbox-slides')[0];

  giphy.savedData.data.map((e, i) => {
    var divCaption = document.createElement('p')
    divCaption.className = 'caption'
    var img = document.createElement('img')
    img.className = 'slider'
    img.src = e.images.original.url
    // var image = JSON.parse('e.imageOriginal');
    // img.src = image
    divCaption.appendChild(document.createTextNode(e.slug));
    divCaption.appendChild(document.createTextNode(` ${i + 1}/${giphy.dataLength}`))
    slides.appendChild(divCaption)
    slides.appendChild(img)
  })
  // Call showHide with slide index parameter. This shows only the active slide.
  showHide(giphy.slideIndex )
}

// showHide controls which slide is visible and active in the dom
// Also deals with the slide counter
function showHide(n) {
  // find the dom elements created in createSlides function
  var captionText = document.getElementsByClassName('caption')
  var sliders = document.getElementsByClassName('slider')

  // Around the world navigation using the saved object
  if (n >= giphy.dataLength) {
    giphy.slideIndex = 0
  }
  if (n < 0) {
    giphy.slideIndex = giphy.dataLength - 1
  }

  // show and tag the active slide using css block, hide the rest with display none
  for (var i = 0; i < sliders.length; i++) {
    if (i === giphy.slideIndex) {
      captionText[i].className = 'caption active';
      sliders[i].className = 'slider active';
      captionText[i].style.display = 'block'
      sliders[i].style.display = 'block'
    } else {
      captionText[i].className = 'caption';
      sliders[i].className = 'slider';
      captionText[i].style.display = 'none'
      sliders[i].style.display = 'none'
    }
  }
}
// var giphy.slideIndex = giphy.giphy.slideIndex
// find the dom elements for next, prev, and close
var foundprev = document.getElementsByClassName('prev')[0];
var foundnext = document.getElementsByClassName('next')[0];
var closer = document.getElementsByClassName('close')[0];
// listeners for next, prev, and close
foundprev.onclick = () => onclick=showHide(giphy.slideIndex -= 1)
foundnext.onclick = () => onclick=showHide(giphy.slideIndex += 1)
closer.onclick = () => onclick=closeLightbox()