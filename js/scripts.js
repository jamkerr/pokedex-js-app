// Modal behaviour to show pokémon details
let detailsModal = (function() {
    
    // Shows modal to view details
    function showModal(pokemon) {

        let modalTitle = document.querySelector('.modal-title');
        let modalBody = document.querySelector('.modal-body');
        let modalFooter = document.querySelector('.modal-footer');

        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';

        // Create title
        modalTitle.innerText = pokemon.name;

        // Create height content
        let heightElement = document.createElement('p');
        heightElement.innerText = `Height: ${pokemon.height * 10} cm`;

        // Create types element
        let typeElement = document.createElement('p');
        typeElement.innerText = `Type: ${pokemon.types}`;

        // Create image
        let imageElement = document.createElement('img');
        imageElement.src = pokemon.imageUrl;

        // Add title, text, and image to DOM
        modalBody.appendChild(imageElement);
        modalBody.appendChild(typeElement);
        modalBody.appendChild(heightElement);
    }

    return {
        showModal
    }

})();


let pokemonRepository = (function() {
    let pokemonList = [];
    // objectKeys is currently used to check whether entry has expected keys, but NOT used to define the keys. This is brittle and likely to cause future bugs! Is there a better way?
    let objectKeys = ["name", "detailsUrl"];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    // Helper function to check whether required keys are in each pokémon object
    function requiredKeys(pokemon, keys) {
        return keys.some(function (key) {
            return key in pokemon
        });
    }

    // Helper function to capitalize first letter of pokémon names
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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
        if (typeof newPokemon === "object" && requiredKeys(newPokemon, objectKeys)) {
            return pokemonList.push(newPokemon);
        } else {
            console.log(`The pokémon must be stored as an object with the keys: ${objectKeys}.`);
        }
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

    // Loads the name and link to more details for each pokémon
    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl).then(function (response) {
            return response.json();
        })
        .then(function (json) {
            hideLoadingMessage();
            json.results.forEach(function (item) {
                let pokemon = {
                    // How to define these object keys using objectKeys variable? Would that make sense? Ideal would be the other way around, but that's recursive...
                    name: capitalizeFirstLetter(item.name),
                    detailsUrl: item.url
                };
                addEntry(pokemon);
            });
        })
        .catch(function (e) {
            console.error(e);
            hideLoadingMessage();
        })
    }

    // Loads extra details for a pokémon
    function loadDetails(item) {
        showLoadingMessage();
        let url = item.detailsUrl;
        return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (details) {
            hideLoadingMessage();
            // Helper function to extract type info
            function getTypes(typesObject){
                let typesArray = [];
                typesObject.forEach(function(item) {
                    typesArray.push(item.type.name);
                    
                });
                return typesArray;
            }
            item.name = capitalizeFirstLetter(details.name);
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            item.types = getTypes(details.types);
            item.id = details.id;
            item.mainType = item.types[0];
        })
        .catch(function (e) {
            hideLoadingMessage();
            console.error(e);
        });
    }

    // Function to show item details (used for button)
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function() {
            detailsModal.showModal(pokemon);
        });
    }

    // Function to add click event to show item details
    // It's necessary to wrap the called function in an extra "reference" function because it contains a parameter, which causes it to be executed immediately: https://stackoverflow.com/questions/35667267/addeventlistenerclick-firing-immediately
    function addEvent(targetElement, item) {
        targetElement.addEventListener('click', function(){
            showDetails(item);
        });
    }

    // Create the list of buttons for each pokémon
    function addListItem(pokemon) {
        // Select the list element
        let htmlList = document.querySelector('.pokemon-list');

        // Create the button for each entry
        let button = document.createElement('button');
        button.innerText = `${pokemon.name}`;
        button.classList.add(
            'pokemon-list__pokemon-card',
            'btn',
            'col-12',
            'col-md-4',
            'col-lg-3'
            );
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#pokemodal');

        // Add click event to button to show item details.
        addEvent(button, pokemon);

        htmlList.appendChild(button);
    }

    return {
        addListItem,
        loadList,
        getAll,
        loadDetails
    };
})();

// Writes the names of each pokémon to the DOM
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function(pokemon) {

        pokemonRepository.addListItem(pokemon);
    
    });
});



