import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { PokemonType } from '../pokemon.model';

@Component({
  selector: 'app-types',
  imports: [],
  templateUrl: './types.component.html',
  styleUrl: './types.component.css'
})
export class TypesComponent implements OnInit {
  @Input() pokemonID!: number;
  types: PokemonType[] | undefined = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getTypesForPokemonID(this.pokemonID).subscribe({
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
      case 'normal': return "https://archives.bulbagarden.net/media/upload/9/95/Normal_icon_SwSh.png";
      case 'fighting': return "https://archives.bulbagarden.net/media/upload/3/3b/Fighting_icon_SwSh.png";
      case 'flying': return "https://archives.bulbagarden.net/media/upload/b/b5/Flying_icon_SwSh.png";
      case 'poison': return "https://archives.bulbagarden.net/media/upload/8/8d/Poison_icon_SwSh.png";
      case 'ground': return "https://archives.bulbagarden.net/media/upload/2/27/Ground_icon_SwSh.png";
      case 'rock': return "https://archives.bulbagarden.net/media/upload/1/11/Rock_icon_SwSh.png";
      case 'bug': return "https://archives.bulbagarden.net/media/upload/9/9c/Bug_icon_SwSh.png";
      case 'ghost': return "https://archives.bulbagarden.net/media/upload/0/01/Ghost_icon_SwSh.png";
      case 'steel': return "https://archives.bulbagarden.net/media/upload/0/09/Steel_icon_SwSh.png";
      case 'fire': return "https://archives.bulbagarden.net/media/upload/a/ab/Fire_icon_SwSh.png";
      case 'water': return "https://archives.bulbagarden.net/media/upload/8/80/Water_icon_SwSh.png";
      case 'grass': return "https://archives.bulbagarden.net/media/upload/a/a8/Grass_icon_SwSh.png";
      case 'electric': return "https://archives.bulbagarden.net/media/upload/7/7b/Electric_icon_SwSh.png";
      case 'psychic': return "https://archives.bulbagarden.net/media/upload/7/73/Psychic_icon_SwSh.png";
      case 'ice': return "https://archives.bulbagarden.net/media/upload/1/15/Ice_icon_SwSh.png";
      case 'dragon': return "https://archives.bulbagarden.net/media/upload/7/70/Dragon_icon_SwSh.png";
      case 'dark': return "https://archives.bulbagarden.net/media/upload/d/d5/Dark_icon_SwSh.png";
      case 'fairy': return "https://archives.bulbagarden.net/media/upload/c/c6/Fairy_icon_SwSh.png";
      default: return "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Icon-round-Question_mark.svg/200px-Icon-round-Question_mark.svg.png";
    }
  }

}
