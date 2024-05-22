import { Coordinate } from './Coordinate.type';

export interface IBase {
    datatype: 'navalBase' | 'airBase' | 'armyBase';
    ident: string;
    name: string;
    coords: Coordinate;
}
