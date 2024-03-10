import { Coordinate } from '../@types/Coordinate.type';
import { polygonArea } from "d3-polygon";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import turfIntersect from '@turf/intersect';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { polygon } from '@turf/helpers';

export const calcDiffProcent = (areaCoords: Coordinate[], notamCoords: Coordinate[]) => {
	const poly1 = polygon([notamCoords]);
	const poly2 = polygon([areaCoords]);

	const intersection = turfIntersect(poly1, poly2);
	if (!intersection) return 0;

	const area = areaCoords as [number, number][];
	const notam = notamCoords.map(obj => [obj[0], obj[1]]) as [number, number][];
	const intersect = intersection.geometry.coordinates[0] as [number, number][];

	const squareArea = Math.abs(polygonArea(area));
	const squareNotam = Math.abs(polygonArea(notam));
	const squareIntersect = Math.abs(polygonArea(intersect));

	const procentIntersect = 100 * squareIntersect / squareArea;

	let coefficient = squareArea >= squareNotam ? (squareNotam / squareArea) : (squareArea / squareNotam)

	// const procentNotamInt = 100 * (squareNotam - squareIntersect) / squareNotam;
	// const procentAreaInt = 100 * (squareArea - squareIntersect) / squareArea;
	// const result = Math.abs(procentIntersect - Math.abs(procentAreaInt - procentNotamInt));

	return Number((procentIntersect * coefficient).toFixed(0));
};