let pkmnId = 1

const pkmnImage = document.querySelector('.pkmn__image');
const pkmnNumber = document.querySelector('.pkmn__number');
const pkmnName = document.querySelector('.pkmn__name');
const pkmnEntry = document.querySelector('.pkmn__entry');

const form = document.querySelector('.form')
const inputSearch = document.querySelector('.input__search')

const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')

let pkmnSpecies
const fetchPokemon = async (pokemon) => {
    
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)

    if(APIResponse.status == 200){
        const data = await APIResponse.json()
    
        pkmnSpecies = await getPokemonSpecies(data.id)
        return data
    }
}

const getPokemonSpecies = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
    
    if(APIResponse.status == 200){
        pkmnSpecies = await APIResponse.json()
        return pkmnSpecies
    }
}

const renderPokemon = async (pokemon) => {
    pokemon = pokemon.toString().toLowerCase()
    pkmnNumber.innerHTML = ''
    pkmnName.innerHTML = 'Loading...'
    synth.cancel();

    const data = await fetchPokemon(pokemon)

    if(data){

        pkmnImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        pkmnId = data.id
        pkmnNumber.innerHTML = data.id + ' - '
        pkmnName.innerHTML = data.name
        pkmnEntry.innerHTML = pkmnSpecies['flavor_text_entries'][0]['flavor_text'].replace(/(\r\n|\n|\r)/gm, " ").replace("\f", " ")

    }else{

        pkmnImage.src = "./images/missignno.png"
        pkmnId = 0
        pkmnNumber.innerHTML = ''
        pkmnName.innerHTML = 'Not found'
        pkmnEntry.innerHTML = ''

    }

    //speech(pkmnId)

    inputSearch.value = ''
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    renderPokemon(inputSearch.value)
})

btnPrev.addEventListener('click', (event) => {
    if(pkmnId > 1){
        renderPokemon(pkmnId -1)
    }
})

btnNext.addEventListener('click', (event) => {
    renderPokemon(pkmnId +1)
})

// Voice
let synth = window.speechSynthesis;

let intervalSpeeching

const btnStartSpeech = document.querySelector('.btn-start-speech')
const btnStopVoice = document.querySelector('.btn-stop-speech')

function speech(_pkmnId) {
    synth.cancel();

    speechStarted();

    if(pkmnId != 0){
        
        if(pkmnSpecies){
            var speech = `${pkmnName.innerHTML}. ${pkmnEntry.innerHTML}`
            
            synth.addEventListener('speaking', function(){
                speechStarted()
            });
            
            var utterance = new SpeechSynthesisUtterance(speech);
            utterance.lang = 'en-US'
            utterance.addEventListener('end', function(){
                speechStopped()
            });
            synth.speak(utterance);
        }

    }
}

function speechStarted(){
    speechStopped()
    intervalSpeeching = setInterval(function() {
        var element = document.querySelector(".speecher-light");
        element.classList.toggle("speecher-light-on");
     },200);
}

function speechStopped(){
    clearInterval(intervalSpeeching)
    var element = document.querySelector(".speecher-light");

    if(document.querySelector(".speecher-light-on")){
        element.classList.toggle("speecher-light-on");
    }
    //document.querySelector(".speecher-light").display = "none";
}

btnStartSpeech.addEventListener('click', () =>{
    speech(pkmnId)
})

btnStopVoice.addEventListener('click', () => {
    synth.cancel();
    speechStopped()
})
//

renderPokemon(pkmnId)