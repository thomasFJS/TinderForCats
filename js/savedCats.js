let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
//To know on which page we are (Liked cats or Favs)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function getCats(mode){
    const openRequest = indexedDB.open("MyListOfCat");
    let db;
    let result

    openRequest.onsuccess = () => { 
        db = openRequest.result;
        let transaction = db.transaction("MyListOfCat"); // readonly
        let cats = transaction.objectStore("MyListOfCat");
        let priceIndex = cats.index("mode_idx");
        let request = priceIndex.getAll(mode);
        request.onsuccess = function() {

            if (request.result !== undefined) {
                console.log("MyListOfCat", request.result); // array of cats with mode=mode (In param Like or Fav)
                showSaved(mode, request.result);
                
            } else {
                console.log("No such cats");
            }
            };
    };
    return result;
}
function showSaved(mode, data){
    let tab = "";
    data.forEach(element => {
        tab += `
        <div class="col-md-6 col-lg-4 mb-5">
        <div class="portfolio-item mx-auto" data-bs-toggle="modal" data-bs-target="#portfolioModal1">

            
            <img id="imgCat" class="img-fluid" src="`+ element.img +`" alt="..." />
            
        </div>
        </div>
        <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-40 w-100">
        <div class="portfolio-item-caption-content text-center text-black">
        <h4 id="name" class="text-uppercase mb-4">`  + element.name + `</h4> <h4 id="age" class="text-uppercase mb-4">`+element.age +` </h4>
        <input id="id" type="hidden" value="`+ element.id  +`"/>
        <div>
        <h4 class="text-uppercase mb-4">Description :</h4>
        <p id="description">`+ element.description +`</p>
        </div>
        </div>
        
    </div>
        `;
    });
    document.getElementById("likedCatsGrid").innerHTML = tab;
}

if(urlParams.get('page') == "liked"){
    getCats("Like");
}
else if(urlParams.get('page') == "favs"){
    getCats("Favs");
}