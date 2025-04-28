import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pokemon } from '../../pokemon.model';
import { PokemonService } from '../pokemon.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { TypesComponent } from "../../types/types.component";
import { AbilitiesComponent } from "../../abilities/abilities.component";
import { StatsComponent } from "../../stats/stats.component";
import { MovesComponent } from "../../moves/moves.component";
import { EvolutionsComponent } from "../../evolutions/evolutions.component";

@Component({
  selector: 'app-pokemon-detail',
  imports: [TypesComponent, AbilitiesComponent, StatsComponent, MovesComponent, EvolutionsComponent],
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
  pokeName: string = "";
  pokeColor: string = "grey";

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
          if (data) {
            this.pokeID = data?.ID;
            this.pokeName = data?.name;
            this.pokeColor = data.color;
          } 
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
    this.pokeID = 0;
    this.pokeName = "";
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
  
}
