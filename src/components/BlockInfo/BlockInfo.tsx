import styles from './BlockInfo.module.scss';
import { BlockInfoProps } from './BlockInfo.props';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as turf from '@turf/turf';
<<<<<<< HEAD
import * as d3 from "d3";
//=========================================================================================================================

function BlockInfo({ areaCoords, notamCoords, dataIntersect }: BlockInfoProps) {
=======
//=========================================================================================================================

function BlockInfo({ areaCoords, notamCoords, dataDifference, dataIntersect }: BlockInfoProps) {
>>>>>>> 979669274dc1aa614e74463a847132955a89a484

	const getSquare = (area: number[][]) => {
		if (areaCoords.area.length > 0 || notamCoords.length > 0) {
			const polygon = turf.polygon([area]);
			const square = turf.area(polygon) * 0.000001;
			return Number(square.toFixed(3));
		}
		return 0;
	}

<<<<<<< HEAD
	// d3.polygonArea([[1, 1], [1.5, 0], [2, 1]]) // -0.5

	const calcProcent = () => {
		if (!dataIntersect) return 0;

=======
	const calcProcent = () => {
		if (dataDifference.diffArea.length === 0 || dataDifference.diffNotam.length === 0) return 0;
		let squareDiffNotam = 0;
		let squareDiffArea = 0;

		for (let i = 0; i < dataDifference.diffNotam.length; i++) {
			const polygonNotam = turf.polygon(dataDifference.diffNotam[i]);
			squareDiffNotam = squareDiffNotam + Number((turf.area(polygonNotam) * 0.000001).toFixed(0));
		}

		for (let i = 0; i < dataDifference.diffArea.length; i++) {
			const polygonArea = turf.polygon(dataDifference.diffArea[i]);
			squareDiffArea = squareDiffArea + Number((turf.area(polygonArea) * 0.000001).toFixed(0));
		}
>>>>>>> 979669274dc1aa614e74463a847132955a89a484


		// const polygonIntersect2 = turf.polygon([dataDifference[1]]);
		// const square2 = Number((turf.area(polygonIntersect2) * 0.000001).toFixed(0));

<<<<<<< HEAD
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

=======
		const polygonArea = turf.polygon([areaCoords.area]);
		const squareArea = Number((turf.area(polygonArea) * 0.000001).toFixed(0));
		const polygonNotam = turf.polygon([notamCoords[0][0].map(obj => [obj.lat, obj.lng])]);
		const squareNotam = Number((turf.area(polygonNotam) * 0.000001).toFixed(0));


		if (squareDiffNotam === squareNotam && squareDiffArea === squareArea) {
			return 0;
		}

		console.log(squareDiffNotam);
		console.log(squareNotam);
		const procentNotam = 100 * squareDiffNotam / squareNotam;
		const procentArea = 100 * squareDiffArea / squareArea;
		// console.log(procentNotam);
		// console.log(procentArea);

		const aarr = [
			[
				[
					35.769,
					-90.765
				],
				[
					40.985,
					-90.104
				],
				[
					40.984,
					-88.084
				],
				[
					40.52122868962302,
					-88.17569958631941
				],
				[
					40,
					-90
				],
				[
					36,
					-90
				],
				[
					36.244198360489825,
					-89.02320655804068
				],
				[
					35.786,
					-89.114
				],
				[
					35.769,
					-90.765
				]
			]
		]
		const polygonArrrrr = turf.polygon(aarr);
		console.log('ssssssssss', Number((turf.area(polygonArrrrr) * 0.000001).toFixed(0)))





		return Number(((procentArea + procentNotam) / 2).toFixed(0));
>>>>>>> 979669274dc1aa614e74463a847132955a89a484
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
<<<<<<< HEAD
					? <div>Пересечение: {getSquare(dataIntersect[0])} км<sup>2</sup></div>
=======
					? <div>Пересечение: {getSquare(dataIntersect)} км<sup>2</sup></div>
>>>>>>> 979669274dc1aa614e74463a847132955a89a484
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
