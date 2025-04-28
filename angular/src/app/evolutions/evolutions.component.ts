import { Component, OnInit, Input } from '@angular/core';
import { Evolution } from '../pokemon.model';
import { EvolutionsService } from './evolutions.service';

@Component({
  selector: 'app-evolutions',
  imports: [],
  templateUrl: './evolutions.component.html',
  styleUrl: './evolutions.component.css'
})
export class EvolutionsComponent implements OnInit {
  @Input() pokemonName!: string;
  evolutions: Evolution[] | undefined = [];
  hasThirdEvolution: boolean = false;

  constructor(private evolutionService: EvolutionsService) {}

  ngOnInit(): void {
    this.evolutionService.getEvolutionsForPokemonName(this.pokemonName).subscribe({
      next: (data) => {
        this.evolutions = data;
        if (this.evolutions !== undefined) {
          if (this.evolutions[0].third) {
            this.hasThirdEvolution = true;
          }
        }
        
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
