import { Coordinate } from './Coordinate.type';

export interface IFir {
	icao: string;
	name: string;
	area: Coordinate[][];
	size: string;
	center: Coordinate;
	country: string;
	airports: number;
}