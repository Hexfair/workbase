import { Coordinate } from '../@types/Coordinate.type';
// import { IArea } from '../@types/IArea.interface';
// import * as d3 from 'd3';
import { polygonArea } from "d3-polygon";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as turf from '@turf/turf';

export const calcDiffProcent = (areaCoords: Coordinate[], notamCoords: Coordinate[]) => {
	const poly1 = turf.polygon([notamCoords]);
	const poly2 = turf.polygon([areaCoords]);

	const intersection = turf.intersect(poly1, poly2);
	if (!intersection) return 0;

	const area = areaCoords as [number, number][];
	// const notam = notamCoords[0][0].map(obj => [obj[0], obj[1]]) as [number, number][];
	const intersect = intersection.geometry.coordinates[0] as [number, number][];

	const squareArea = Math.abs(polygonArea(area));
	// const squareNotam = Math.abs(d3.polygonArea(notamCoords));
	const squareIntersect = Math.abs(polygonArea(intersect));

	// console.log('squareArea', squareArea);
	// console.log('squareNotam', squareNotam);
	// console.log('squareIntersect', squareIntersect);

	const procentIntersect = 100 * squareIntersect / squareArea;
	// const procentNotamInt = 100 * (squareNotam - squareIntersect) / squareNotam;
	// const procentAreaInt = 100 * (squareArea - squareIntersect) / squareArea;
	// const result = Math.abs(procentIntersect - Math.abs(procentAreaInt - procentNotamInt));

	// console.log('procentIntersect', procentIntersect);
	// console.log('procentNotamInt', procentNotamInt);
	// console.log('procentAreaInt', procentAreaInt);
	// console.log('result', result);
	// console.log('---------');



	return Number(procentIntersect.toFixed(0));
};