interface name {
    first: string,
    middle: string,
    last: string,
}

interface images {
    head_shot: string,
    main: string
}

export interface Character {
    id: number,
    name: name,
    images: images,
    age: number,
    gender: string,
    species: string,
    occupation: string,
    sayings: string[]
}
