import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pokemon } from '../pokemon.model';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-detail',
  imports: [],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent implements OnInit {
  @Input() pokemonName!: string;
  @Output() close = new EventEmitter<void>();
  pokemon: Pokemon | undefined = undefined;
  errorMessage: string | null = null;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    if (this.pokemonName) {
      this.loadPokemonData();
    }
  }


  loadPokemonData(): void {
    this.pokemonService.getPokemonByName(this.pokemonName)
      .subscribe({
        next: (data) => {
          this.pokemon = data;
        },
        error: (error) => {
          this.errorMessage = 'Error loading pokemon data: ' + error;
          console.error(this.errorMessage);
        }
      });
  }

  onClose() {
    this.close.emit();
    this.pokemon = undefined;
  }
  
}
