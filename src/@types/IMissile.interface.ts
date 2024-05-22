import { Coordinate } from './Coordinate.type';

export interface IMissile {
    point: string;
    unit: string;
    coords: Coordinate;
    ident: string;
}