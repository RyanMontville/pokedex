import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PokemonService {
    pokemonCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/pokemon.csv";

    constructor(private http: HttpClient) { }
    getListOfPokemon() {
        
    }


}