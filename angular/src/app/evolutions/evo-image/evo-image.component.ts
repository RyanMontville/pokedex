import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from '../../home/pokemon.service';

@Component({
  selector: 'app-evo-image',
  imports: [],
  templateUrl: './evo-image.component.html',
  styleUrl: './evo-image.component.css'
})
export class EvoImageComponent implements OnInit {
  @Input() pokemonName!: string;
  pokemonImage: string | undefined = "";

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.getPokemonImageByName(this.pokemonName).subscribe({
      next: (data) => {
        this.pokemonImage = data;
      },error: (error) => {
        console.error(error);
      }
    })
  }
}
