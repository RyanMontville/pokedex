import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Evolution } from '../pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class EvolutionsService {
  private evolutionDataCache: Evolution[] | null = null;
  private evolutionCSV: string = "";

  constructor(private http: HttpClient) { }
}
