import { Coordinate } from './Coordinate.type';

export interface ISelectedPoint {
	name: string;
	ident: string | null;
	coords: Coordinate;
	idx: number;
}