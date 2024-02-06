let btn = document.querySelector('button');
let inpt = document.querySelector('input');
let searchName = document.getElementById('search-name');
let prono = document.getElementById('search-pro');
let def1 = document.getElementById('definition-1');
let def2 = document.getElementById('definition-2');
let ul = document.getElementById(".under-list");
let micro = document.querySelector('.fa');
let setSearch = document.querySelector('.set-search');
let define = document.querySelector('.definition');

setSearch.classList.add('hide');

let head = document.getElementById('heading');
head.innerText = "Enter a word to search for its meaning...."

let url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let searchClicked = false;

let searchValue = "";

btn.addEventListener("click", async ()=>{
    try{

        let search = inpt.value.trim();

        if (search === "") {
            alert("Please enter a word to search.");
            return;
        }
        searchValue = search;
        let dicWord = await getSearch(search);
        inpt.value = "";

        setSearch.classList.remove('hide');
        head.classList.remove('hide');

        searchName.innerText = getName(dicWord);
        prono.innerText = getPro(dicWord);

        searchClicked = true;

        if (dicWord[0]?.meanings[0]?.definitions.length >= 1) {
            def1.innerText = getDefinition(dicWord);
            def2.innerText = (dicWord[0]?.meanings[0]?.definitions.length > 1) ? getDefinition1(dicWord) : "";

            if (def1.innerText.trim() === "" && def2.innerText.trim() === "") {
                head.innerText = "No Definition found";
            } else {
                head.innerText = "Definition -";
            }

        } else {
            searchName.innerText = "No Search found";
            prono.innerText = "";
            head.innerText = "No Definition found";
            def1.innerText = "";
            def2.innerText = "";
        }
    
    }
    catch(e){
        if (e.message === "Network issue") {
            searchName.innerText = "Nerwork issue";
            prono.innerText = "";
            head.innerText = "Network issue. Please check your internet connection.";
            def1.innerText = "";
            def2.innerText = "";
        } else {
            searchName.innerText = "No Search found";
            prono.innerText = "";
            head.innerText = "No Definition found";
            def1.innerText = "";
            def2.innerText = "";
        }
    }
})


micro.addEventListener("click", async () =>{
    try{

        if (!searchClicked) {
            alert("Please perform a search first."); 
            return;
        }

        let dicWord1 = await getSearch(searchValue);
       
        getAudio(dicWord1)
    }
    catch(e){
        console.log(e)
    }
})


function getAudio(dicWord1) {
    for (let i = 0; i < dicWord1[0].phonetics.length; i++) {
        let audioUrl = dicWord1[0].phonetics[i].audio;
        if (audioUrl) {
            let audio = new Audio(audioUrl);
            audio.play();
            return audioUrl;
        }
    }
    return null;
}


function getDefinition(dicWord){
    return dicWord[0]?.meanings[0].definitions[0].definition || "";
    
}

function getDefinition1(dicWord){
    return dicWord[0]?.meanings[0].definitions[1].definition || "";
}

function getName (dicWord){
        return dicWord[0].word;
}

function getPro(dicWord){
        return dicWord[0].phonetic || "";
    
}

async function getSearch(search){
    try{
        
        let dic = await axios.get(url+search);
        console.log(dic.data);
        return dic.data;
    }
    catch(e){
        if (e.response && e.response.status === 404) {
            throw new Error("No search result");
        } else {
            throw new Error("Network issue");
        }
        
    }
    
}

