import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pokemon } from '../pokemon.model';
import { PokemonService } from '../pokemon.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { TypesComponent } from "../types/types.component";

@Component({
  selector: 'app-pokemon-detail',
  imports: [TypesComponent],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css',
  animations: [
    trigger('detailAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }), // Initial style: off-screen bottom, fully transparent
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })) // Animate to on-screen position, fully opaque
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 })) // Animate to off-screen bottom, fully transparent
      ])
    ])
  ]
})
export class PokemonDetailComponent implements OnInit {
  @Input() pokemonName!: string;
  @Output() close = new EventEmitter<void>();
  pokemon: Pokemon | undefined = undefined;
  errorMessage: string | null = null;
  pokeID: number = 0;

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
          if (data) this.pokeID = data?.ID;
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
