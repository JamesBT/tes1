var fitnessTypeArea = document.querySelector('#jenis-fitness');

function clearCards() {
  while(fitnessTypeArea.hasChildNodes()) {
    fitnessTypeArea.removeChild(fitnessTypeArea.lastChild);
  }
}

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.id = data.id;
  cardWrapper.className = 'jenis-fitness-card mdl-card mdl-shadow--2dp';
  var cardImage = document.createElement("img")
  cardImage.src = data.image;
  cardImage.backgroundSize = 'Cover';
  cardImage.style.height = '180px';
  cardImage.style.width = '300px';
  cardWrapper.append(cardImage);
  var cardTitle = document.createElement('p');
  cardTitle.className = 'mdl-card__title';
  cardTitle.textContent = data.title;
  cardWrapper.appendChild(cardTitle);
  var cardOverlay = document.createElement('div');
  cardOverlay.className = 'overlay';
  cardWrapper.appendChild(cardOverlay);
  var cardButton = document.createElement('div');
  cardButton.className = "button";
  cardButton.id = data.id;
  cardButton.textContent = "Read detail";
  
  // ambil id
  cardButton.addEventListener('click', function(event){
    var clickedCardId = event.currentTarget.id.replace('card-', '');
    console.log('Clicked card with id:', clickedCardId);
    // ambil data dari indexDB
    readDataById('posts', data.id)
        .then(function(data) {
          console.log(data)
            if (data) {
            // data dengan spesifik id ditemukan
              var url = '/detail.html?id=' + encodeURIComponent(data.id) +
              '&image=' + encodeURIComponent(data.image) +
              '&title=' + encodeURIComponent(data.title) +
              '&detail=' + encodeURIComponent(data.detail);
              console.log(url);
              window.location.href = url;
            } else {
              console.log('Data not found.');
            }
        })
        .catch(function(error) {
            console.error('Error reading data:', error);
        });
    
      
  })
  cardWrapper.append(cardButton);
  fitnessTypeArea.appendChild(cardWrapper);
  componentHandler.upgradeElement(cardWrapper);

  
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://ambw-tes1-c14210026-44961-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    writeData('posts', data)
      .then(() => {
        console.log('Data written successfully to IndexedDB');
      })
      .catch((error) => {
        console.error('Error writing data to IndexedDB:', error);
      });
      readAllData('posts')
        .then(function(data){
          console.log('baca indexed DB',data)
        })
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
    readAllData('posts')
        .then(function(data) {
        if (!networkDataReceived) {
            console.log('From cache', data);
            updateUI(data);
        }
        });
}
