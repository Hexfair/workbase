import React from 'react';
import styles from './TabFlights.module.scss';
import { dataCoord } from '../../assets/AllDecCoord';
import DeleteIcon from '../../assets/icon/delete.svg?react';
import { reg1, reg2, reg3 } from '../TabNotams/TabNotams.regexp';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { ISelectedPoint } from '../../@types/ISelectedPoint.interface';
import { useStore } from '../../store/store';
//=========================================================================================================================

const AllDecCoord = new Map(Object.entries(dataCoord));

function TabFlights() {
	const { setFligthCoords, deleteFligthCoord } = useStore();

	const [pointsSelected, setPointsSelected] = React.useState<ISelectedPoint[]>([]);
	const [textareaText, setTextareaText] = React.useState<string>('');

	const onDeletePoint = (obj: ISelectedPoint) => {
		if (!obj.coords) return;
		setPointsSelected((prev) => prev.filter((item) => item.point !== obj.point));
		deleteFligthCoord({ lat: obj.coords[0], lng: obj.coords[1] });
	};

	const onSelectText = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const selectedText = event.target.value.substring(event.target.selectionStart!, event.target.selectionEnd!).trim();

		if (selectedText.length >= 4 && selectedText.length <= 6) {
			const coordinates = AllDecCoord.get(selectedText);

			if (coordinates) {
				setFligthCoords([[coordinates[0], coordinates[1]]]);

				const pointData: ISelectedPoint = {
					point: selectedText,
					coords: [coordinates[0], coordinates[1]]
				};
				setPointsSelected((prev) => [...prev, pointData]);
			}
		}

		if (selectedText.length > 10) {
			const match = selectedText.match(reg1) || selectedText.match(reg2) || selectedText.match(reg3);

			if (match) {
				const tepmlatedCoord = calcTepmlateCoordinates(selectedText.replaceAll(/[-|.|\s]/g, ''));
				const coordinates = calcResultCoordinates(tepmlatedCoord);

				if (coordinates) {
					setFligthCoords([[coordinates[0], coordinates[1]]]);

					const pointData: ISelectedPoint = {
						point: '[coord]',
						coords: [coordinates[0], coordinates[1]]
					};
					setPointsSelected((prev) => [...prev, pointData]);
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
			{pointsSelected.map((obj, index) => (
				<div key={obj.point + index} className={styles.pointsItem}>
					<span>{obj.point}</span>
					<span>{obj.coords[0]}, {obj.coords[1]}</span>
					<span className={styles.delete}>
						<DeleteIcon onClick={() => onDeletePoint(obj)} />
					</span>
				</div>
			))}
		</>
	);
}

export default TabFlights;
