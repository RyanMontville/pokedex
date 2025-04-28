import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Move } from '../pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class MovesService {
  private movesCSV: string = "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/data/pokemon_moves.csv";
  private moveDataCache: Move[] | null = null;

  constructor(private http: HttpClient) { }

  getMovesDataFromCsv(filePath: string): Observable<Move[]> {
    return this.http.get(filePath, { responseType: 'text' })
      .pipe(
        map(csvData => this.parseMove(csvData)),
        tap(data => this.moveDataCache = data)
      )
  }

  parseMove(csvData: string): Move[] {
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) {
      console.log("can't find headers");
      return [];
    }
    const header = lines[0].split(',').map(h => h.trim());
    const pokemonIDIndex = header.indexOf('pokemonID');
    const nameIndex = header.indexOf('moveName');
    const typeInsex = header.indexOf('type');
    const powerIndex = header.indexOf('power');
    const accuracyIndex = header.indexOf('accuracy');

    const movesList: Move[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === header.length) {
        const move: Move = {
          pokemonID: +values[pokemonIDIndex]?.trim() || 0,
          moveName: values[nameIndex]?.trim() || '',
          type: values[typeInsex]?.trim() || '',
          power: +values[powerIndex]?.trim() || 0,
          accuracy: +values[accuracyIndex]?.trim() || 0
        }
        movesList.push(move);
      } else {
        console.warn(`Skipping row ${i + 1} due to incorrect number of columns.`);
      }
    }
    console.log("loaded moves data from csv");
    return movesList;
  }

  getMovesForPokemonID(ID: number): Observable<Move[] | undefined> {
    if (this.moveDataCache) {
      return new Observable(observer => {
        observer.next(this.moveDataCache?.filter(pokemon => pokemon.pokemonID === ID));
        observer.complete();
      });
    } else {
      return this.getMovesDataFromCsv(this.movesCSV).pipe(
        map(movesList => movesList.filter((pokemon: { pokemonID: number; }) => pokemon.pokemonID === ID))
      );
    }
  }
}
