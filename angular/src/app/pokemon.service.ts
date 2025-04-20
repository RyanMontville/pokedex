import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Pokemon, PokemonType } from './pokemon.model';

export interface PokemonSimple {
    ID: number;
    name: string;
    image: string;
    color: string;
  }

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private pokemonDataCache: Pokemon[] | null = null;
  private pokemonTypesCache: PokemonType[] | null = null;
  pokemonCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/pokemon.csv";
  typeCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/pokemon_types.csv";

  constructor(private http: HttpClient) { }

  private getPokemonDataFromCsv(filePath: string): Observable<Pokemon[]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.parsePokemonDetail(csvData)),
        tap(data => this.pokemonDataCache = data)
      );
  }

  private getTypeDataFromCsv(filePath: string): Observable<PokemonType[]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.parseType(csvData)),
        tap(data => this.pokemonTypesCache = data)
      )
  }

  private parsePokemonDetail(csvData: string): Pokemon[] {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      console.log("can't find headers");
      return [];
    }
    const header = lines[0].split(',').map(h => h.trim());
    const idIndex = header.indexOf('ID');
    const nameIndex = header.indexOf('name');
    const generationIndex = header.indexOf('generation');
    const heightIndex = header.indexOf('height');
    const weightIndex = header.indexOf('weight');
    const baseExperienceIndex = header.indexOf('baseExperience');
    const isDefaultIndex = header.indexOf('isDefault');
    const colorIndex = header.indexOf('color');
    const shapeIndex = header.indexOf('shape');
    const habitatIndex = header.indexOf('habitat');
    const isLegendaryIndex = header.indexOf('isLegendary');
    const imageIndex = header.indexOf('image');

    const pokemonList: Pokemon[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === header.length) {
        console.log(values[nameIndex]);
        const pokemon: Pokemon = {
          ID: +values[idIndex]?.trim() || 0,
          name: values[nameIndex]?.trim() || '',
          generation: values[generationIndex]?.trim() || '',
          height: +values[heightIndex]?.trim() || 0,
          weight: +values[weightIndex]?.trim() || 0,
          baseExperience: +values[baseExperienceIndex]?.trim() || 0,
          isDefault: values[isDefaultIndex]?.trim().toLowerCase() === 'true' || false,
          color: values[colorIndex]?.trim() || '',
          shape: values[shapeIndex]?.trim() || '',
          habitat: values[habitatIndex]?.trim() || '',
          isLegendary: values[isLegendaryIndex]?.trim().toLowerCase() === 'true' || false,
          image: values[imageIndex]?.trim() || '',
        };
        pokemonList.push(pokemon);
      } else {
        console.warn(`Skipping row ${i + 1} due to incorrect number of columns.`);
      }
    }
    console.log("loaded data from csv");
    return pokemonList;
  }

  parseType(csvData: string): PokemonType[] {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      console.log("can't find headers");
      return [];
    }
    //pokemon_id,type_name
  }

  getPokemonByName(name: string): Observable<Pokemon | undefined> {
    if (this.pokemonDataCache) {
      return new Observable(observer => {
        observer.next(this.pokemonDataCache?.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase()));
        observer.complete();
      });
    } else {
      return this.getPokemonDataFromCsv(this.pokemonCSV).pipe(
        map(pokemonList => pokemonList.find(pokemon => pokemon.name.toLowerCase() === name.toLowerCase()))
      );
    }
  }

  getAllPokemon(): Observable<Pokemon[]> {
    if (this.pokemonDataCache) {
      return new Observable(observer => {
        observer.next(this.pokemonDataCache!);
        observer.complete();
      });
    } else {
      return this.getPokemonDataFromCsv(this.pokemonCSV);
    }
  }

  getAllPokemonTypes(): Observable<PokemonType[]> {
    if (this.pokemonTypesCache) {
      return new Observable(observer => {
        observer.next(this.pokemonTypesCache!);
        observer.complete();
      });
    } else {
      return this.getTypeDataFromCsv(this.typeCSV);
    }
  }

  
}