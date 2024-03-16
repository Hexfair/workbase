import React from 'react';
import styles from './TabFlights.module.scss';
import DeleteIcon from '../../assets/icon/delete.svg?react';
import { reg1, reg2, reg3 } from '../TabNotams/TabNotams.regexp';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { ISelectedPoint } from '../../@types/ISelectedPoint.interface';
import { useStore } from '../../store/store';
//=========================================================================================================================

function TabFlights() {
	const { setFligthCoords, deleteFligthCoord } = useStore();

	const [pointsSelected, setPointsSelected] = React.useState<ISelectedPoint[]>([]);
	const [textareaText, setTextareaText] = React.useState<string>('');

	const onDeletePoint = (obj: ISelectedPoint) => {
		if (!obj.coords[0] || !obj.coords[1]) return;
		setPointsSelected((prev) => prev.filter((item) => item.idx !== obj.idx));
		deleteFligthCoord(obj.idx);
	};

	const onSelectText = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const selectedText = event.target.value.substring(event.target.selectionStart!, event.target.selectionEnd!).trim();

		if (selectedText.length >= 3 && selectedText.length <= 6) {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/icao`,
				{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify({ icao: selectedText }),
				});

			const data = await response.json();

			if (data.point) {
				const pointData: ISelectedPoint = {
					ident: data.point.ident,
					name: data.point.name,
					coords: data.point.coords,
					idx: pointsSelected.length + 1
				};
				setPointsSelected((prev) => [...prev, pointData]);
				setFligthCoords(pointData);
			}
		}

		if (selectedText.length > 10) {
			const match = selectedText.match(reg1) || selectedText.match(reg2) || selectedText.match(reg3);

			if (match) {
				const tepmlatedCoord = calcTepmlateCoordinates(selectedText.replaceAll(/[-|.|\s]/g, ''));
				const coordinates = calcResultCoordinates(tepmlatedCoord);

				if (coordinates) {

					const pointData: ISelectedPoint = {
						ident: null,
						name: '[coord]',
						coords: [coordinates[0], coordinates[1]],
						idx: pointsSelected.length + 1

					};
					setPointsSelected((prev) => [...prev, pointData]);
					setFligthCoords(pointData);
				}
			}
		}
	};

	return (
		<>
			<details className={styles.details}>
				<summary className={styles.summary}>Как пользоваться?</summary>
				<div className={styles.text}>
					<p>1. Вставить в текстовое поле План полета</p>
					<p>2. Выделить поочереди наименования пролетных точек</p>
					<p>3. Если координаты пролетной точки есть в базе, значит она отобразиться на карте</p>
					<p>4. При необходимости можно удалить ненужные точки</p>
					<p>5. Поискать координаты тех точек, которых нет в базе, и сообщить ПДВ</p>
				</div>
			</details>
			<textarea
				className={styles.textarea}
				value={textareaText}
				onChange={(e) => setTextareaText(e.target.value)}
				onSelect={onSelectText}
			></textarea>
			<div className={styles.textPoint}>Выбранные точки:</div>
			{pointsSelected.map(obj => (
				<div key={obj.idx} className={styles.pointsItem}>
					<span>{obj.name}<span> {obj.ident ? `(${obj.ident})` : ''}</span></span>
					<span>{obj.coords[0]}, {obj.coords[1]}</span>
					<span className={styles.delete}>
						<DeleteIcon onClick={() => onDeletePoint(obj)} />
					</span>
				</div >
			))
			}
		</>
	);
}

export default TabFlights;
