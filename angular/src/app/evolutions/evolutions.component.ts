import { Component, OnInit, Input } from '@angular/core';
import { Evolution } from '../pokemon.model';
import { EvolutionsService } from './evolutions.service';
import { PokemonService } from '../home/pokemon.service';
import { EvoImageComponent } from "./evo-image/evo-image.component";

@Component({
  selector: 'app-evolutions',
  imports: [EvoImageComponent],
  templateUrl: './evolutions.component.html',
  styleUrl: './evolutions.component.css'
})
export class EvolutionsComponent implements OnInit {
  @Input() pokemonName!: string;
  evolutions: Evolution[] | undefined = [];
  hasThirdEvolution: boolean = false;
  errorMessage: string | null = null;
  error: boolean = false;

  constructor(
    private evolutionService: EvolutionsService) {}

  ngOnInit(): void {
    this.evolutionService.getEvolutionsForPokemonName(this.pokemonName).subscribe({
      next: (data) => {
        this.evolutions = data;
        if (this.evolutions !== undefined) {
          if (this.evolutions[0].third !== 'none') {
            this.hasThirdEvolution = true;
          }
        } else {
          this.errorMessage = "Evolution is undefined";
          this.error = true;
        }
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = error;
        this.error = true;
      }
    })
  }
}
