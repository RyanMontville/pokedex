import { Component, OnInit, Input } from '@angular/core';
import { Stat } from '../pokemon.model';
import { StatsService } from './stats.service';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {
  @Input() pokemonID!: number;
  stats: Stat[] | undefined = [];

  constructor(private statService: StatsService) {}

  ngOnInit(): void {
    this.statService.getStatsForPokemonID(this.pokemonID).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
