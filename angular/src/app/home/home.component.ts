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
  pokemonList: Pokemon[] = []; //All pokemon, do not change
  listToShow: Pokemon[] = [];
  showFiltered: boolean = false;
  currentStart: number = 0;
  currentEnd: number = 100;
  currentPokemon: Pokemon[] = [];
  errorMessage: string | null = null;
  shouldShowDetail: boolean = false;
  pokemonDetailState: string = 'out';
  pokemonToShowDetail: string = "";
  pages: number[] = [];
  currentPage: number = 1;
  searchTerm: string = "";
  message: string = "";
  showAdvancedSearch: boolean = false;
  showingAdvancedResults: boolean = false;
  searchPlaceholder: string = "Search all Pokemon...";
  advancedTerm: string | null = null;

  constructor(
    private pokemonService: PokemonService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadPokemonData();
  }

  loadPokemonData(): void {
    this.pokemonService.getAllPokemon()
      .subscribe({
        next: (data) => {
          this.pokemonList = data;
          this.listToShow = data;
          this.calculatePages();
          this.currentPokemon = this.listToShow.slice(this.currentStart, this.currentEnd);
          this.message = `Showing ${this.pokemonList.length} Pokemon`;
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
    this.currentPokemon = this.listToShow.slice(this.currentStart, this.currentEnd);
  }

  previousPage() {
    this.currentPage -= 1;
    this.currentStart -= 100;
    this.currentEnd -= 100;
    this.currentPokemon = this.listToShow.slice(this.currentStart, this.currentEnd);
  }
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    let end = pageNumber * 100;
    let start = end - 100
    this.currentStart = start;
    this.currentEnd = end
    this.currentPokemon = this.listToShow.slice(this.currentStart, this.currentEnd);
  }

  calculatePages() {
    this.pages = [];
    let listLenght = this.listToShow.length;
    console.log(`Length of list: ${listLenght}`);
    let numPages = Math.ceil(listLenght / 100);
    console.log(`number of pages: ${numPages}`);
    for (let i = 1; i < numPages + 1; i++) {
      this.pages.push(i);
    }
    this.currentStart = 0;
    this.currentEnd = 100;
    this.currentPage = 1;
    this.currentPokemon = this.listToShow.slice(this.currentStart, this.currentEnd);
  }

  filterResults(text: string) {
    this.errorMessage = "";
    let lastWord = this.message.split(" ");
    if (!text) {
      if (lastWord[lastWord.length - 1] === "Pokemon") {
        this.showFiltered = false;
      }
      this.errorMessage = "Please enter a pokemon to search"
      setTimeout(() => {
        this.errorMessage = "";
      }, 1000);
    } else {
      let checkLengthList = this.listToShow.filter((pokemon) => pokemon.name.toLowerCase().includes(text.toLowerCase()));
      if (checkLengthList.length === 0) {
        if (this.advancedTerm) {
          this.errorMessage = `No Pokemon matching '${text}' and ${this.advancedTerm}`;
        } else {
          this.errorMessage = `No Pokemon matching '${text}'`;
        }
        
        this.searchTerm = "";
        if (lastWord[lastWord.length - 1] === "Pokemon") {
          this.showFiltered = false;
        }
        this.showAdvancedSearch = false;
        this.showingAdvancedResults = false;
        setTimeout(() => {
          this.errorMessage = null;
        }, 2000);
      } else {
        this.listToShow = checkLengthList;
        this.calculatePages();
        if (this.advancedTerm) {
          this.message = `Showing ${this.listToShow.length} results for ${text} and ${this.advancedTerm}`;
        } else {
          this.message = `Showing ${this.listToShow.length} results for ${text}`;
        }
        this.showFiltered = true;
      }
    }
  }

  filterForHabitat(habitat: string) {
    this.showingAdvancedResults = true;
    this.listToShow = this.listToShow.filter((pokemon) => pokemon.habitat.toLowerCase() === habitat.toLowerCase());
    this.calculatePages();
    this.showFiltered = true;
    this.showAdvancedSearch = false;
    this.advancedTerm = `habitat: ${habitat}`;
    this.searchPlaceholder = `Search Pokemon with ${this.advancedTerm}...`;
    if (this.searchTerm.length > 0) {
      this.message = `Showing ${this.listToShow.length} results for ${this.searchTerm} and habitat: ${habitat}`;
    } else {
      this.message = `Showing ${this.listToShow.length} results for habitat: ${habitat}`;
    }
  }

  filterForGeneration(generation: string) {
    this.showingAdvancedResults = true;
    this.showAdvancedSearch = false;
    this.listToShow = this.listToShow.filter((pokemon) => pokemon.generation === generation);
    this.calculatePages();
    this.advancedTerm = `generation ${generation}`
    this.searchPlaceholder = `Search Pokemon in ${this.advancedTerm}...`;
    this.showFiltered = true;
    if (this.searchTerm.length > 0) {
      this.message = `Showing ${this.listToShow.length} results for ${this.searchTerm} and generation: ${generation}`;
    } else {
      this.message = `Showing ${this.listToShow.length} results for generation: ${generation}`;
    }
  }

  // filterByType(type: string) {
  //   this.showingAdvancedResults = true;
  //   this.showAdvancedSearch = false;
  //   this.listToShow = this.listToShow.filter((pokemon) => pokemon.t)
  // }

  clear() {
    this.searchTerm = "";
    this.listToShow = this.pokemonList;
    this.showFiltered = false;
    this.message = `Showing ${this.pokemonList.length} Pokemon`;
    this.errorMessage = null;
    this.showAdvancedSearch = false;
    this.showingAdvancedResults = false;
    this.calculatePages();
    this.advancedTerm = null;
    this.searchPlaceholder = "Search all Pokemon..."
  }

}
