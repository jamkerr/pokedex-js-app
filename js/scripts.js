let pokemonRespository = (function() {
    let pokemonList = [];
    // objectKeys is currently used to check whether entry has expected keys, but NOT used to define the keys. This is brittle and likely to cause future bugs! Is there a better way?
    let objectKeys = ["name", "detailsUrl"];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll() {
        return pokemonList;
    }

    function getSpecific(name) {
        return pokemonList.filter(function(pokemon) {
            return name === pokemon.name;
        });
    }

    // Adds pokémon entry to pokemonList
    function addEntry(newPokemon) {
        // Checks whether the entry is an object and includes the expected keys
        if (typeof newPokemon === "object" && JSON.stringify(Object.keys(newPokemon)) === JSON.stringify(objectKeys)) {
            return pokemonList.push(newPokemon);
        } else {
            console.log(`The pokémon must be stored as an object with the keys: ${Object.keys(pokemonList[0])}.`);
        }
    }

    // Function to show item details (used for button)
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function() {
            console.log(pokemon);
        });
    }

    // Function to add click event to show item details
    // It's necessary to wrap the called function in an extra "reference" function because it contains a parameter, which causes it to be executed immediately: https://stackoverflow.com/questions/35667267/addeventlistenerclick-firing-immediately
    function addEvent(targetElement, item) {
        targetElement.addEventListener('click', function(){
            showDetails(item);
        });
    }

    function addListItem(pokemon) {
        let htmlList = document.querySelector('ul');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        if (pokemon.height > 3) {
            button.innerText = `${pokemon.name}\nCrikey, that's a whopper!`;
        } else {
            button.innerText = `${pokemon.name}`;
        }
        button.classList.add('pokemon-list__pokemon-card');
        // Add click event to button to show item details.
        addEvent(button, pokemon);

        listItem.appendChild(button);
        htmlList.appendChild(listItem);
    }

    // Loads the name and link to more details for each pokémon
    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            hideLoadingMessage();
            json.results.forEach(function (item) {
                let pokemon = {
                    // How to define these object keys using objectKeys variable? Would that make sense? Ideal would be the other way around, but that's recursive...
                    name: item.name,
                    detailsUrl: item.url
                };
                addEntry(pokemon);
            });
        }).catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        })
    }

    // Loads extra details for each pokémon
    function loadDetails(item) {
        showLoadingMessage();
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            hideLoadingMessage();
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        }).catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        });
    }

    // Shows loading message when entry or details are being fetched
    function showLoadingMessage() {
        let mainContent = document.querySelector('main');
        let messageElement = document.createElement('p');
        messageElement.innerText = `Loading the Pokédex`;
        messageElement.classList.add('loading-message');
        // Add click event to button to show item details.
        mainContent.appendChild(messageElement);
    }

    // Hides loading message after entry or details have been fetched
    function hideLoadingMessage() {
        let messageElement = document.querySelector('.loading-message');
        messageElement.parentElement.removeChild(messageElement);
    }

    return {
        getAll,
        addEntry,
        getSpecific,
        addListItem,
        loadList,
        loadDetails
    };
})();

// Writes the names of each pokémon to the DOM
pokemonRespository.loadList().then(function () {
    pokemonRespository.getAll().forEach(function(pokemon) {

        pokemonRespository.addListItem(pokemon);
    
    });
})