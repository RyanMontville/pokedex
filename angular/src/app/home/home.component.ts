import { Component, OnInit } from '@angular/core';
import { PokemonService, PokemonSimple } from '../pokemon.service';
import { Router } from '@angular/router';
import { PokemonDetailComponent } from "../pokemon-detail/pokemon-detail.component";

@Component({
  selector: 'app-home',
  imports: [PokemonDetailComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  pokemonList: PokemonSimple[] = [];
  errorMessage: string | null = null;
  shouldShowDetail: boolean = false;
  pokemonToShowDetail: string = "";

  constructor(
    private pokemonService: PokemonService,
    private router: Router) {}

  ngOnInit(): void {
    this.loadPokemonData();
  }

  loadPokemonData(): void {
    this.pokemonService.getAllPokemon()
      .subscribe({
        next: (data) => {
          this.pokemonList = data;
        },
        error: (error) => {
          this.errorMessage = 'Error loading pokemon data: ' + error;
          console.error(this.errorMessage);
        }
      });
  }

  goToPokemon(pokemonName: string) {
    this.router.navigate(['/pokemon', pokemonName])
  }

  showPokemonDetail(pokemonName: string) {
    this.pokemonToShowDetail = pokemonName;
    this.shouldShowDetail = true;
  }

  colorStyles(style: string, color: string) {
    if (style == 'text') {
      switch (color) {
        case "black": return "white";
        case "blue": return "white";
        case "brown": return "White";
        case "gray": return "white";
        case "green": return "white";
        case "pink": return "black";
        case "purple": return "white";
        case "red": return "white";
        case "white": return "black";
        case "yellow": return "black";
        default: return "white";
      }
    } else {
      return "green";
    }
  }

  resetPokemonDetails() {
    this.shouldShowDetail = false;
    this.pokemonToShowDetail = "";
  }

}
