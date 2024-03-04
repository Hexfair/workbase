import { Coordinate } from './Coordinate.type';

export interface IArea {
	id: number;
	name: string;
	country: string;
	rocket: string;
	area: Coordinate[][];
	diff?: number;
}