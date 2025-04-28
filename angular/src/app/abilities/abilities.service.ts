import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Ability } from '../pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class AbilitiesService {
  private abilitiesCache: Ability[] | null = null;
  private abilityCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/pokemon_abilities.csv";

  constructor(private http: HttpClient) { }

  private getAbilitiesFromCsv(filePath: string): Observable<Ability[]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.parseAbility(csvData)),
        tap(data => this.abilitiesCache = data)
      )
  }

  parseAbility(csvData: string): Ability[] {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      console.log("can't find headers");
      return [];
    }
    const header = lines[0].split(',').map(h => h.trim());
    const pokemonIdIndex = header.indexOf('pokemonID');
    const abilityIndex = header.indexOf('ability');
    const isHiddenIndex = header.indexOf('isHidden');

    const abilityList: Ability[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === header.length) {
        const type: Ability = {
          pokemonID: +values[pokemonIdIndex]?.trim() || 0,
          ability: values[abilityIndex]?.trim() || '',
          isHidden: values[isHiddenIndex]?.trim().toLowerCase() === 'true' || false,
        }
        abilityList.push(type);
      } else {
        console.warn(`Skipping row ${i + 1} due to incorrect number of columns.`);
      }
    }
    console.log("loaded data from csv");
    return abilityList;
  }

  getAbilitesForPokemonID(ID: number): Observable<Ability[] | undefined> {
    if (this.abilitiesCache) {
      return new Observable(observer => {
        observer.next(this.abilitiesCache?.filter(pokemon => pokemon.pokemonID === ID));
        observer.complete();
      });
    } else {
      return this.getAbilitiesFromCsv(this.abilityCSV).pipe(
        map(abilityList => abilityList.filter(pokemon => pokemon.pokemonID === ID))
      );
    }
  }

  getAllAbilities(): Observable<Ability[]> {
    if (this.abilitiesCache) {
      return new Observable(observer => {
        observer.next(this.abilitiesCache!);
        observer.complete();
      });
    } else {
      return this.getAbilitiesFromCsv(this.abilityCSV);
    }
  }
}
