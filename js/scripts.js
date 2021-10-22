//
// Scripts
// 

let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;


const api_url_cat_info = "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1";
const api_url_cat_name= "https://tomatebanane.ch/api/catname/random";

async function getapis(url_info, url_name) {
    
    // Storing response
    //const response = await fetch(url);
    Promise.all([fetch(url_info), fetch(url_name)]).then(function (responses) {
        return Promise.all(responses.map(function (response){
            return response.json(); 
        }));
    }).then(function(data){
        console.log(data);
        showMain(data);
    }).catch(function (error){
        console.log(error);
    });
    
    // Storing data in form of JSON
    //var data = await response.json();
    //console.log(data);
    //show(data);
}

function dislike(){
    getapis(api_url_cat_info, api_url_cat_name);
}

//Set the first cat data
getapis(api_url_cat_info, api_url_cat_name);
console.log(getFromApi());

/**
 * @param mode Like or Favs
 */
function save(mode){
    const request = indexedDB.open("MyListOfCat");
    let db;
    //Get values
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").textContent;
    let img =  document.getElementById("imgCat").src;
    let description = document.getElementById("description").textContent;
    let age = document.getElementById("age").textContent;

    request.onupgradeneeded = () => {
      console.log("ok");
      db = request.result;
      const store = db.createObjectStore("MyListOfCat", {keyPath: "id"});
      let index = store.createIndex('mode_idx', 'mode');
    };
    
    request.onsuccess = () => { 
        db = request.result;
        let tx = db.transaction("MyListOfCat", "readwrite");
        let store = tx.objectStore("MyListOfCat");
        store.put({id: id, name: name, age: age,img: img, description: description, mode: mode});
        getapis(api_url_cat_info, api_url_cat_name);
        saveToApi(id, name, img, description, age, mode );
         };
    
    async function getValue(id) {
      let tx = db.transaction("MyListOfCat", "readwrite");
      let store = tx.objectStore("MyListOfCat");
      return new Promise((resolve, reject) => {
        let value = store.get(id);
        value.onsuccess = () => {
          if (value.result !== undefined) {
            resolve(value.result);
          }
          else {
            reject("impossible to find");
          }
        };
        
      });
    }
}

/* Saving function with local storage
function save(mode){
    let save = [];
    if(localStorage.getItem(mode) != null){
        save = JSON.parse(localStorage.getItem(mode));
    }
    save.push([document.getElementById("id").value,document.getElementById("name").textContent,document.getElementById("imgCat").src,document.getElementById("description").textContent, document.getElementById("age").textContent]);
    localStorage.setItem(mode,JSON.stringify(save));
    getapis(api_url_cat_info, api_url_cat_name);
}
*/

function saveToApi(id, name, img, description, age, mode, url = "http://localhost:3000/cats"){

    
    let data = new URLSearchParams({
        'id': id,
        'name' : name,
        'age' : age,
        'img' : img,
        'description' : description,
        'mode' : mode
    });
    fetch(url,{
        method:"POST",
        body: data
    });
}
//Function to get data from the api
async function getFromApi(url = "http://localhost:3000/cats"){
    let data = await fetch(url).then(res => res.json())

    return data;
}

//Function to generate a description.
function generateDescription(nb, name){
    switch(nb){
        case 0:
            return "Je me nomme " + name + " et je suis vraiment très sympathique";
            break;
        case 1:
            return "Je suis " + name + " et je cherche a rencontrer quelqu'un :)";
            break;
        case 2:
            return "Je m'appelle " + name + " et j'aime bien manger"
            break;
            
    }
}

//Function to display the card where the cats are displayed 
function showMain(data) {
    
    let tab;
    console.log();
        tab = `
        <div class="col-md-6 col-lg-4 mb-5">
        <div class="portfolio-item mx-auto" data-bs-toggle="modal" data-bs-target="#portfolioModal1">

            
            <img id="imgCat" class="img-fluid" src="`+ data[0][0].url +`" alt="..." />
            
        </div>
        </div>
        <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-40 w-100">
        <div class="portfolio-item-caption-content text-center text-black">
        <h4 id="name" class="text-uppercase mb-4">`  + data[1][0].name + `</h4> <h4 id="age" class="text-uppercase mb-4">`+ Math.floor(Math.random()*15 +1) +` years old  </h4>
        <input id="id" type="hidden" value="`+ data[1][0].id  +`"/>
        <button class="btn btn-danger" onclick="dislike()">
        <i class="fas fa-times fa-fw pick"></i>
        
        </button>
        <button class="btn btn-info" onclick="save(&quot;Favs&quot;)" >
        <i class="far fa-star pick"></i>
        
        </button>
        <button class="btn btn-primary" onclick="save(&quot;Like&quot;)">
        <i class="fas fa-heart pick"></i>
        
        </button>
        <div>
        <h4 class="text-uppercase mb-4">Description :</h4>
        <p id="description">`+ generateDescription(Math.floor(Math.random()*3), data[1][0].name)+`</p>
        </div>
        </div>
        
    </div>
        ` ;
    // Setting innerHTML as tab variable
    document.getElementById("cardsGrid").innerHTML = tab;
}


