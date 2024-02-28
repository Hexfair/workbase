import styles from './BlockInfo.module.scss';
import { BlockInfoProps } from './BlockInfo.props';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as turf from '@turf/turf';
import * as d3 from "d3";
//=========================================================================================================================

function BlockInfo({ areaCoords, notamCoords, dataIntersect }: BlockInfoProps) {

	const getSquare = (area: number[][]) => {
		if (areaCoords.area.length > 0 || notamCoords.length > 0) {
			const polygon = turf.polygon([area]);
			const square = turf.area(polygon) * 0.000001;
			return Number(square.toFixed(3));
		}
		return 0;
	}

	// d3.polygonArea([[1, 1], [1.5, 0], [2, 1]]) // -0.5

	const calcProcent = () => {
		if (!dataIntersect) return 0;



		// const polygonIntersect2 = turf.polygon([dataDifference[1]]);
		// const square2 = Number((turf.area(polygonIntersect2) * 0.000001).toFixed(0));

		const area = areaCoords.area as [number, number][];
		const notam = notamCoords[0][0].map(obj => [obj.lat, obj.lng]) as [number, number][];
		const intersect = dataIntersect[0] as [number, number][];

		const squareArea = d3.polygonArea(area);
		const squareNotam = d3.polygonArea(notam);
		const squareIntersect = d3.polygonArea(intersect);

		console.log('area', squareArea);
		console.log('notam', squareNotam);
		console.log('intersect', squareIntersect);

		// const area = turf.polygon([areaCoords.area]);
		// const notam = turf.polygon([notamCoords[0][0].map(obj => [obj.lat, obj.lng])]);
		// const intersect = turf.polygon(dataIntersect);

		// const squareArea = Number((turf.area(area) * 0.000001).toFixed(0));
		// const squareNotam = Number((turf.area(notam) * 0.000001).toFixed(0));
		// const squareIntersect = Number((turf.area(intersect) * 0.000001).toFixed(0));

		// console.log('area', squareArea);
		// console.log('notam', squareNotam);
		// console.log('intersect', squareIntersect);


		const procentNotam = 100 * (squareNotam - squareIntersect) / squareNotam;
		const procentIntersect = 100 * squareIntersect / squareArea;
		const procentCoef = 100 * (squareNotam - squareIntersect) / squareArea;

		return Math.abs(Number((procentIntersect - procentNotam).toFixed(0)))

	}

	return (
		<div className={styles.block}>
			<div className={styles.square}>
				{areaCoords &&
					<div>Шаблон: {getSquare(areaCoords.area)} км<sup>2</sup></div>}
				{notamCoords.length > 0
					? <div>Резервация: {getSquare(notamCoords[0][0].map(obj => [obj.lat, obj.lng]))} км<sup>2</sup></div>
					: <div>Резервация: 0 км<sup>2</sup></div>}
				{dataIntersect
					? <div>Пересечение: {getSquare(dataIntersect[0])} км<sup>2</sup></div>
					: <div>Пересечение: 0 км<sup>2</sup></div>}
			</div>
			<div className={styles.procent}>
				<p>Совпадение: </p>
				<p className={`${calcProcent() < 50 && styles.red}
									${calcProcent() >= 50 && calcProcent() < 80 && styles.yellow}
									${calcProcent() >= 80 && styles.green}`}
				>{calcProcent()}%
				</p>
			</div>
		</div >
	);
}

export default BlockInfo;
