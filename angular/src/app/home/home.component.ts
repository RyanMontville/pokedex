import { Component, OnInit } from '@angular/core';
import { PokemonService } from './pokemon.service';
import { Router } from '@angular/router';
import { PokemonDetailComponent } from "./pokemon-detail/pokemon-detail.component";
import { Pokemon } from '../pokemon.model';
import { trigger, state, style, transition, animate, useAnimation } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [PokemonDetailComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      state('out', style({ opacity: 0, transform: 'translateY(100%)' })),
      transition('void => in', [ // Animate in from the left
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('300ms ease-in')
      ]),
      transition('in => out', [
        animate('300ms ease-out')
      ]),
      transition('void => *', animate('0ms')),
    ]),
  ],
})

export class HomeComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  filteredPokemonList: Pokemon[] = [];
  showFiltered: boolean = false;
  currentStart: number = 0;
  currentEnd: number = 100;
  currentPokemon: Pokemon[] = [];
  errorMessage: string | null = null;
  shouldShowDetail: boolean = false;
  pokemonDetailState: string = 'out';
  pokemonToShowDetail: string = "";
  pages: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  currentPage: number = 1;
  searchTerm: string = "";

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
          this.currentPokemon = this.pokemonList.slice(this.currentStart, this.currentEnd);
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
    this.pokemonDetailState = 'in';
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
    this.pokemonDetailState = 'out';
    setTimeout(() => {
      this.shouldShowDetail = false;
      this.pokemonToShowDetail = "";
    }, 300);
  }

  nextPage() {
    this.currentPage += 1;
    this.currentStart += 100;
    this.currentEnd += 100;
    this.currentPokemon = this.pokemonList.slice(this.currentStart, this.currentEnd);
  }

  previousPage() {
    this.currentPage -= 1;
    this.currentStart -= 100;
    this.currentEnd -= 100;
    this.currentPokemon = this.pokemonList.slice(this.currentStart, this.currentEnd);
  }
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    let end = pageNumber * 100;
    let start = end - 100
    this.currentStart = start;
    this.currentEnd = end
    this.currentPokemon = this.pokemonList.slice(this.currentStart, this.currentEnd);
  }

  filterResults(text: string) {
    this.errorMessage = "";
    if (!text) {
      this.errorMessage = "Please enter a pokemon to search"
      setTimeout(() => {
        this.errorMessage = "";
      }, 1000);
    }
    this.filteredPokemonList = this.pokemonList.filter((pokemon) => pokemon.name.toLowerCase().includes(text.toLowerCase()));
    if (this.filteredPokemonList.length === 0) {
      this.errorMessage = `No Pokemon matching '${text}'`;
      this.showFiltered = false;
      this.searchTerm = "";
    } else {
      this.showFiltered = true;
    }
  }
  clear() {
    this.showFiltered = false;
    this.searchTerm = "";
    this.filteredPokemonList = [];
  }

}
