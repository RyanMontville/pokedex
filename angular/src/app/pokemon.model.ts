export class Pokemon {
    constructor(
        public ID: number, 
        public name: string, 
        public generation: string, 
        public height: number, 
        public weight: number, 
        public baseExperience: number, 
        public isDefault: boolean, 
        public color: string, 
        public shape: string, 
        public habitat: string, 
        public isLegendary: boolean, 
        public image: string
    ) {}
}

export class PokemonType {
    constructor(
        public pokemonID: number,
        public type: string
    ) {}
}

export class Ability {
    constructor(
        public pokemonID: number,
        public ability: string,
        public isHidden: boolean
    ) {}
}

export class Stat {
    constructor(
        public pokemonID: number,
        public statName: string,
        public baseStat: number,
        public effort: number,
        public isBattleOnly: boolean
    ) {}
}

export class Move {
    constructor(
        public pokemonID: number,
        public moveName: string,
        public type: string,
        public power: number,
        public accuracy: number
    ) {}
}