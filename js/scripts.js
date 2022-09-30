// Modal behaviour to show pokémon details
let detailsModal = (function() {
    // Hides modal to close details
    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }
    
    // Shows modal to view details
    function showModal(pokemon) {
        let modalContainer = document.querySelector('#modal-container');

        let modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = '';

        // Create title
        let titleElement = document.createElement('h1');
        titleElement.innerText = pokemon.name;

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
        modalContent.appendChild(titleElement);
        modalContent.appendChild(imageElement);
        modalContent.appendChild(typeElement);
        modalContent.appendChild(heightElement);
    
        modalContainer.classList.add('is-visible');

        // Event listener to close modal when "close" button is pressed
        let closeButtonElement = document.querySelector('.modal-close');
        closeButtonElement.addEventListener('click', hideModal);

        // Event listener to close modal when clicking outside the modal
        modalContainer.addEventListener('click', (e) => {
            let target = e.target;
            if (target === modalContainer) {
                hideModal();
            }
        });
    }

    // Event listener to hide modal when it's open and the escape key is pressed
    window.addEventListener('keydown', (e) => {
        let modalContainer = document.querySelector('#modal-container');
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    return {
        showModal,
        hideModal
    }

})();


let pokemonRespository = (function() {
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
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = getTypes(details.types);
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

    // Creates the button for each pokémon
    function addListItem(pokemon) {
        let htmlList = document.querySelector('ul');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = `${pokemon.name}`;
        button.classList.add('pokemon-list__pokemon-card');
        // Add click event to button to show item details.
        addEvent(button, pokemon);

        listItem.appendChild(button);
        htmlList.appendChild(listItem);
    }

    return {
        addListItem,
        loadList,
        getAll
    };
})();

// Writes the names of each pokémon to the DOM
pokemonRespository.loadList().then(function () {
    pokemonRespository.getAll().forEach(function(pokemon) {

        pokemonRespository.addListItem(pokemon);
    
    });
});



