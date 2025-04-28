import { Injectable } from '@angular/core';
import { Stat } from '../pokemon.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statsCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/pokemon_stats.csv";
  private statDataCache: Stat[] | null = null;

  constructor(private http: HttpClient) { }

  getStatsDataFromCsv(filePath: string): Observable<Stat[]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.parseStat(csvData)),
        tap(data => this.statDataCache = data)
      )
  }

  parseStat(csvData: string): Stat[] {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      console.log("can't find headers");
      return [];
    }
    const header = lines[0].split(',').map(h => h.trim());
    const pokemonIDIndex = header.indexOf('pokemonID');
    const statNameIndex = header.indexOf('statName');
    const baseStatIndex = header.indexOf('baseStat');
    const effortIndex = header.indexOf('effort');
    const isBattleOnlyIndex = header.indexOf('isBattleOnly');

    const statsList: Stat[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === header.length) {
        const stat: Stat = {
          pokemonID: +values[pokemonIDIndex]?.trim() || 0,
          statName: values[statNameIndex]?.trim() || '',
          baseStat: +values[baseStatIndex]?.trim() || 0,
          effort: +values[effortIndex]?.trim() || 0,
          isBattleOnly: values[isBattleOnlyIndex]?.trim().toLowerCase() === 'true' || false,
        }
        statsList.push(stat);
      } else {
        console.warn(`Skipping row ${i + 1} due to incorrect number of columns.`);
      }
    }
    console.log("loaded stats data from csv");
    return statsList;
  }

  getStatsForPokemonID(ID: number): Observable<Stat[] | undefined> {
    if (this.statDataCache) {
      return new Observable(observer => {
        observer.next(this.statDataCache?.filter(pokemon => pokemon.pokemonID === ID));
        observer.complete();
      });
    } else {
      return this.getStatsDataFromCsv(this.statsCSV).pipe(
        map((statsList: any[]) => statsList.filter((pokemon: { pokemonID: number; }) => pokemon.pokemonID === ID))
      );
    }
  }
}
