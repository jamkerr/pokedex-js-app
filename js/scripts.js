// Modal behaviour to show pokémon details
let detailsModal = (function() {
    
    // Shows modal to view details
    function showModal(pokemon) {

        let modalTitle = document.querySelector('.modal-title');
        let modalTypeTags = document.querySelector('.tags__modal-type');
        let modalBody = document.querySelector('.modal-body');
        let modalFooter = document.querySelector('.modal-footer');

        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';
        modalTypeTags.innerHTML = '';

        // Create ID number
        let idElement = document.querySelector('.modal-id-number');
        idElement.innerText = `#${pokemon.id}`;

        // Fill title
        modalTitle.innerText = pokemon.name;

        // Create types element
        let typeElement = document.querySelector('.tags__modal-type');

        pokemon.types.forEach((type) => {
            const typeTag = document.createElement('p');
            typeTag.classList.add('modal-tag', type);
            typeTag.innerText = type;
            typeElement.appendChild(typeTag);
          });

        // Set image background
        modalBody.className = 'modal-body';
        modalBody.classList.add(`gradient--${pokemon.mainType}`);

        // Create image
        let imageElement = document.createElement('img');
        imageElement.src = pokemon.imageUrl;

        // Create height content
        let heightElement = document.createElement('p');
        heightElement.innerText = `Height: ${pokemon.height * 10} cm`;

        //Create weight content
        let weightElement = document.createElement('p');
        weightElement.innerText = `Weight: ${pokemon.weight / 10} kg`;

        // Add title, text, and image to DOM
        modalBody.appendChild(imageElement);
        modalFooter.appendChild(heightElement);
        modalFooter.appendChild(weightElement);
    }

    return {
        showModal
    }

})();


let pokemonRepository = (function() {
    let pokemonList = [];
    // objectKeys is currently used to check whether entry has expected keys, but NOT used to define the keys. This is brittle and likely to cause future bugs! Is there a better way?
    let objectKeys = ['name', 'detailsUrl'];
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

    // Adds pokémon entry to pokemonList
    function addEntry(newPokemon) {
        // Checks whether the entry is an object and includes the expected keys
        if (typeof newPokemon === 'object' && requiredKeys(newPokemon, objectKeys)) {
            return pokemonList.push(newPokemon);
        } else {
            console.log(`The pokémon must be stored as an object with the keys: ${objectKeys}.`);
        }
    }
    
    // Shows loading message when entry or details are being fetched
    function showLoadingMessage() {
        let mainContent = document.querySelector('main');
        let messageElement = document.createElement('p');
        messageElement.innerText = 'Loading the Pokédex';
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
            return fetch(apiUrl)
            .then((response) => response.json())
            .then((json) => {
                json.results.forEach(({name, url}) => {
                    addEntry({
                        name: capitalizeFirstLetter(name),
                        detailsUrl: url
                    })
                });
            })
            .catch(function (e) {
                console.error(e);
            })
        }

    // Helper function to extract type info
    function getTypes(typesObject){
        let typesArray = [];
        typesObject.forEach(function(item) {
            typesArray.push(item.type.name);
        });
        return typesArray;
    }

    // Loads extra details for a pokémon
    function loadDetails(item) {
        return fetch(item.detailsUrl)
        .then((response) => response.json())
        .then(function (details) {
            item.name = capitalizeFirstLetter(details.name);
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            item.types = getTypes(details.types);
            item.id = details.id;
            item.mainType = item.types[0];
            // return item;
        })
        .catch(function (e) {
            console.error(e);
        })
    }

    // Function to show item details (used for button)
    function showDetails(pokemon) {
        detailsModal.showModal(pokemon);
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
        let button = document.createElement('div');
        button.classList.add(
            'pokemon-list__pokemon-card',
            'btn',
            'shadow',
            'col-12',
            'col-md-4',
            'col-lg-3',
            `id-${pokemon.id}`,
            `gradient--${pokemon.mainType}`
            );
        button.setAttribute('id', pokemon.name);
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#pokemodal');

        // Create flex element to hold name and id elements
        let buttonTextWrapper = document.createElement('div');
        buttonTextWrapper.classList.add('pokemon-list__pokemon-card--text');

        // Create name element to include in button
        let buttonName = document.createElement('p');
        buttonName.innerText = `${pokemon.name}`;

        // Create image element to include in button
        let buttonId = document.createElement('p');
        buttonId.innerText = `#${pokemon.id}`;

        // Create image element to include in button
        let buttonImage = document.createElement('img');
        buttonImage.setAttribute('src', pokemon.imageUrl);

        // Add click event to button to show item details.
        addEvent(button, pokemon);

        buttonTextWrapper.appendChild(buttonName);
        buttonTextWrapper.appendChild(buttonId);
        button.appendChild(buttonTextWrapper);
        button.appendChild(buttonImage);
        htmlList.appendChild(button);
    }

  // Search through pokémon by item name
  let searchValue = document.getElementById('searchBar');

  searchValue.addEventListener('keyup', function (e) {
    let searchString = e.target.value.toLowerCase();

    let itemsToHide = pokemonList.filter(function (item) {
      // Find non-matching names
      if (
        !item.name.toLowerCase().includes(searchString)
      ) {
        return item;
      }
    });
    let itemsToShow = pokemonList.filter(function (item) {
      // Find matching names
      if (
        item.name.toLowerCase().includes(searchString)
      ) {
        return item;
      }
    });

    itemsToHide.map((item) => {
      document.getElementById(item.name).classList.add('d-none');
    });
    itemsToShow.map((item) => {
      document.getElementById(item.name).classList.remove('d-none');
    });
  });

    // Toggle search bar by clicking the search icon
    let searchButton = document.querySelector('.search-button');
    $(document).ready(function () {
        $(searchButton).click(function () {
            $('.search-bar').toggleClass('d-none');
        });
    });

    return {
        addListItem,
        loadList,
        getAll,
        loadDetails,
        showLoadingMessage,
        hideLoadingMessage
    };
})();

// Load all the data and create the card list
pokemonRepository.showLoadingMessage();
pokemonRepository.loadList().then(function () {
    pokemonRepository.hideLoadingMessage();
    pokemonRepository.getAll().forEach(function(pokemon) {

        pokemonRepository.loadDetails(pokemon)
        .then(function() {
            pokemonRepository.addListItem(pokemon)
        });
    
    });
});


