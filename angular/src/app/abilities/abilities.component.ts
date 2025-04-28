import { Component, OnInit, Input } from '@angular/core';
import { Ability } from '../pokemon.model';
import { AbilitiesService } from './abilities.service';

@Component({
  selector: 'app-abilities',
  imports: [],
  templateUrl: './abilities.component.html',
  styleUrl: './abilities.component.css'
})
export class AbilitiesComponent implements OnInit {
  @Input() pokemonID!: number;
  abilities: Ability[] | undefined = [];

  constructor(private abilitiesService: AbilitiesService) {}

  ngOnInit(): void {
    this.abilitiesService.getAbilitesForPokemonID(this.pokemonID).subscribe({
      next: (data) => {
        this.abilities = data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
