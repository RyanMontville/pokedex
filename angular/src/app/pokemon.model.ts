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
        public ID: number,
        public type: string
    ) {}
}