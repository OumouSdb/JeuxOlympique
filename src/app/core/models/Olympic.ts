// TODO: create here a typescript interface for an olympic country

import { Participation } from "./Participation";

export interface Country {
    id: number,
    country: String,
    participations: Participation[];
}

