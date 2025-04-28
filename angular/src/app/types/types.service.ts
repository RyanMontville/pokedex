import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PokemonType } from '../pokemon.model';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypesService {
  private pokemonTypesCache: PokemonType[] | null = null;
  private typeCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/pokemon_types.csv";

  constructor(private http: HttpClient) { }

  private getTypeDataFromCsv(filePath: string): Observable<PokemonType[]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.parseType(csvData)),
        tap(data => this.pokemonTypesCache = data)
      )
  }

  parseType(csvData: string): PokemonType[] {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      console.log("can't find headers");
      return [];
    }
    const header = lines[0].split(',').map(h => h.trim());
    const idIndex = header.indexOf('pokemon_id');
    const typeIndex = header.indexOf('type_name');

    const typeList: PokemonType[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === header.length) {
        const type: PokemonType = {
          pokemonID: +values[idIndex]?.trim() || 0,
          type: values[typeIndex]?.trim() || '',
        }
        typeList.push(type);
      } else {
        console.warn(`Skipping row ${i + 1} due to incorrect number of columns.`);
      }
    }
    console.log("loaded types data from csv");
    return typeList;
  }

  getTypesForPokemonID(ID: number): Observable<PokemonType[] | undefined> {
    if (this.pokemonTypesCache) {
      return new Observable(observer => {
        observer.next(this.pokemonTypesCache?.filter(pokemon => pokemon.pokemonID === ID));
        observer.complete();
      });
    } else {
      return this.getTypeDataFromCsv(this.typeCSV).pipe(
        map((typeList: any[]) => typeList.filter((pokemon: { pokemonID: number; }) => pokemon.pokemonID === ID))
      );
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
