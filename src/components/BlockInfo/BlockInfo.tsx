import styles from './BlockInfo.module.scss';
import { BlockInfoProps } from './BlockInfo.props';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import * as turf from '@turf/turf';
import * as d3 from 'd3';
//=========================================================================================================================

function BlockInfo({ areaCoords, notamCoords, dataIntersect }: BlockInfoProps) {

	const calcProcent = () => {
		if (!dataIntersect) return 0;

		const area = areaCoords.area as [number, number][];
		const notam = notamCoords[0][0].map(obj => [obj[0], obj[1]]) as [number, number][];
		const intersect = dataIntersect[0] as [number, number][];

		const squareArea = d3.polygonArea(area);
		const squareNotam = d3.polygonArea(notam);
		const squareIntersect = d3.polygonArea(intersect);

		const procentIntersect = 100 * squareIntersect / squareArea;
		const procentNotamInt = 100 * (squareNotam - squareIntersect) / squareNotam;
		const procentAreaInt = 100 * (squareArea - squareIntersect) / squareArea;

		return Math.abs(Number((procentIntersect - Math.abs((procentAreaInt - procentNotamInt))).toFixed(0)));
	};

	return (
		<div className={styles.block}>
			<span>Совпадение: </span>
			<span className={`${calcProcent() < 50 && styles.red}
									${calcProcent() >= 50 && calcProcent() < 80 && styles.yellow}
									${calcProcent() >= 80 && styles.green}`}
			>{calcProcent()}%
			</span>
		</div >
	);
}

export default BlockInfo;

// const polygonIntersect2 = turf.polygon([dataDifference[1]]);
// const square2 = Number((turf.area(polygonIntersect2) * 0.000001).toFixed(0));

// const getSquare = (area: number[][]) => {
// 	if (areaCoords.area.length > 0 || notamCoords.length > 0) {
// 		const polygon = turf.polygon([area]);
// 		const square = turf.area(polygon) * 0.000001;
// 		return Number(square.toFixed(3));
// 	}
// 	return 0;
// }