let pokemonRespository = (function() {
    let pokemonList = [
        {
            name: "Diglett",
            height: 0.08,
            types: ['ground']
        },
        {
            name: "Lickitung",
            height: 3.11,
            types: ['normal']
        },
        {
            name: "Farfetch\'d",
            height: 2.07,
            types: ['normal', 'flying']
        },
        {
            name: "Jigglypuff",
            height: 1.08,
            types: ['normal', 'fairy']
        },
        {
            name: "Oddish",
            height: 1.08,
            types: ['grass', 'poison']
        }
    ];

    function getAll() {
        return pokemonList;
    }

    function getSpecific(name) {
        return pokemonList.filter(function(pokemon) {
            return name === pokemon.name;
        });
    }

    function add(newPokemon) {
        if (typeof newPokemon === "object" && JSON.stringify(Object.keys(newPokemon)) === JSON.stringify(Object.keys(pokemonList[0]))) {
            return pokemonList.push(newPokemon);
        } else {
            console.log(`The pokémon must be stored as an object with the keys: ${Object.keys(pokemonList[0])}.`);
        }
    }

    // Function to show item details (used for button)
    function showDetails(pokemon) {
        console.log(pokemon);
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

    return {
        getAll,
        add,
        getSpecific,
        addListItem
    };
})();

// Writes the names and heights of each pokémon to the DOM
pokemonRespository.getAll().forEach(function(pokemon) {

    pokemonRespository.addListItem(pokemon);

});