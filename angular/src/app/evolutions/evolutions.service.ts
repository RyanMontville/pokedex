import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Evolution } from '../pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class EvolutionsService {
  private evolutionDataCache: Evolution[] | null = null;
  private evolutionCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/evolutions.csv";

  constructor(private http: HttpClient) { }

  private getEvolutionDataFromCsv(filePath: string): Observable<Evolution[]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.parseEvolution(csvData)),
        tap(data => this.evolutionDataCache = data)
      )
  }

  parseEvolution(csvData: string): Evolution[] {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      console.log("can't find headers");
      return [];
    }
    const header = lines[0].split(',').map(h => h.trim());
    const firstIndex = header.indexOf('first');
    const secondIndex = header.indexOf('second');
    const thirdIndex = header.indexOf('third');

    const evolutionList: Evolution[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === header.length) {
        const evolution: Evolution = {
          first: values[firstIndex]?.trim() || '',
          second: values[secondIndex]?.trim() || '',
          third: values[thirdIndex]?.trim() || ''
        }
        evolutionList.push(evolution);
      } else {
        console.warn(`Skipping row ${i + 1} due to incorrect number of columns.`);
      }
    }
    console.log("loaded evolutions data from csv");
    return evolutionList;
  }

  getEvolutionsForPokemonName(name: string): Observable<Evolution[] | undefined> {
    if (this.evolutionDataCache) {
      return new Observable(observer => {
        observer.next(this.evolutionDataCache?.filter((pokemon) => {
          return name.toLowerCase() === pokemon.first.toLowerCase() || name.toLowerCase() === pokemon.second.toLowerCase() || name.toLowerCase() === pokemon.third.toLowerCase();
        }));
        observer.complete();
      });
    } else {
      return this.getEvolutionDataFromCsv(this.evolutionCSV).pipe(
        map((evolutionList: any[]) => evolutionList.filter((pokemon) => {
          return name.toLowerCase() === pokemon.first.toLowerCase() || name.toLowerCase() === pokemon.second.toLowerCase() || name.toLowerCase() === pokemon.third.toLowerCase();
        }))
      )
    }
  }
}
