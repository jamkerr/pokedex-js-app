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

// Writes the names and heights of each pokémon to the DOM
pokemonList.forEach(function(pokemon) {
    if (pokemon.height > 3) {
        document.write(`<p>${pokemon.name} (height: ${pokemon.height}) - <em>Crikey, that's a whopper!</em></p>`);
    } else {
        document.write(`<p>${pokemon.name} (height: ${pokemon.height})</p>`);
    }
});