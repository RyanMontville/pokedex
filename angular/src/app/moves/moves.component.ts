import { Component, OnInit, Input } from '@angular/core';
import { Move } from '../pokemon.model';
import { MovesService } from './moves.service';

@Component({
  selector: 'app-moves',
  imports: [],
  templateUrl: './moves.component.html',
  styleUrl: './moves.component.css'
})
export class MovesComponent implements OnInit {
  @Input() pokemonID!: number;
  moves: Move[] | undefined = [];

  constructor(private moveService: MovesService) {}

  ngOnInit(): void {
    this.moveService.getMovesForPokemonID(this.pokemonID).subscribe({
      next: (data) => {
        this.moves = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
