import { Component, OnInit, Input } from '@angular/core';
import { PokemonType } from '../pokemon.model';
import { TypesService } from './types.service';

@Component({
  selector: 'app-types',
  imports: [],
  templateUrl: './types.component.html',
  styleUrl: './types.component.css'
})
export class TypesComponent implements OnInit {
  @Input() pokemonID!: number;
  types: PokemonType[] | undefined = [];

  constructor(private typeService: TypesService) {}

  ngOnInit(): void {
    this.typeService.getTypesForPokemonID(this.pokemonID).subscribe({
      next: (data) => {
        this.types = data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  getIcon(typeName: string): string {
    switch(typeName) {
      case 'bug': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/bug-type.png";
      case 'dark': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/dark-type.png";
      case 'dragon': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/dragon-type.png";
      case 'electric': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/electric-type.png";
      case 'fighting': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/fighting-type.png";
      case 'fairy': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/fairy-type.png";
      case 'fire': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/fire-type.png";
      case 'flying': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/flying-type.png";
      case 'ghost': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/ghost-type.png";
      case 'grass': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/grass-type.png";
      case 'ground': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/ground-type.png";
      case 'ice': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/ice-type.png";
      case 'normal': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/normal-type.png";
      case 'poison': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/poison-type.png";
      case 'psychic': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/psychic-type.png";
      case 'rock': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/rock-type.png";
      case 'steel': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/steel-type.png";
      case 'water': return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/water-type.png";
      default: return "https://raw.githubusercontent.com/RyanMontville/pokedex/refs/heads/main/images/unknown-type.png";
    }
  }

}
