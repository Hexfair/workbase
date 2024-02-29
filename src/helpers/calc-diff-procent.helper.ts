import { Coordinate } from '../@types/Coordinate.type';
import { IArea } from './../@types/IArea.interface';
import * as d3 from 'd3';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as turf from '@turf/turf';

export const calcDiffProcent = (areaCoords: IArea, notamCoords: Coordinate[][][]) => {
	const p1 = notamCoords[0].map(item => {
		return item.map(obj => ([obj[0], obj[1]]));
	});

	const p2 = [areaCoords.area];

	const poly1 = turf.polygon(p1);
	const poly2 = turf.polygon(p2);

	const intersection = turf.intersect(poly1, poly2);

	if (!intersection) return 0;

	const area = areaCoords.area as [number, number][];
	const notam = notamCoords[0][0].map(obj => [obj[0], obj[1]]) as [number, number][];
	const intersect = intersection.geometry.coordinates[0] as [number, number][];

	const squareArea = d3.polygonArea(area);
	const squareNotam = d3.polygonArea(notam);
	const squareIntersect = d3.polygonArea(intersect);

	const procentIntersect = 100 * squareIntersect / squareArea;
	const procentNotamInt = 100 * (squareNotam - squareIntersect) / squareNotam;
	const procentAreaInt = 100 * (squareArea - squareIntersect) / squareArea;

	return Math.abs(Number((procentIntersect - Math.abs((procentAreaInt - procentNotamInt))).toFixed(0)));
};