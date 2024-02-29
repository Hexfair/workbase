import React from 'react';
import styles from './TabNotams.module.scss';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { reg1, reg2, reg3 } from './TabNotams.regexp';
// import { TabNotamsProps } from './TabNotams.props';
import { Coordinate } from '../../@types/Coordinate.type';
import { useStore } from '../../store/store';
//=========================================================================================================================

function TabNotams() {
	const { setNotamCoords } = useStore();
	const [textareaText, setTextareaText] = React.useState<string>('');


	const searchNotam = () => {
		const match = textareaText.match(reg1) || textareaText.match(reg2) || textareaText.match(reg3);

		if (!match) return;

		const arr = textareaText.split('\n\n');
		for (const el of arr) {
			const arrItem: Coordinate[][] = [];
			const elMatch = el.match(reg1) || el.match(reg2) || el.match(reg3);
			const coordItem: Coordinate[] = [];

			if (elMatch && elMatch.length > 3) {
				elMatch.forEach((item) => {
					const tepmlatedCoord = calcTepmlateCoordinates(item.replaceAll(/[-|.|\s]/g, ''));
					const coordinates = calcResultCoordinates(tepmlatedCoord);
					coordinates && coordItem.push(coordinates);
				});
			}
			if (coordItem.length > 0) {
				arrItem.push(coordItem);
				setNotamCoords([arrItem]);
			}
		}
	};

	return (
		<>
			<details className={styles.details}>
				<summary className={styles.summary}>Как пользоваться?</summary>
				<div className={styles.text}>
					<p>1. Вставить в текстовое поле НОТАМ</p>
					<p>2. Нажать кнопку "Построить по координатам"</p>
					<p>3. На карте должен отобразиться зарезервированный район</p>
					<p>4. Для работы с новым НОТАМом нажать кнопку "Очистить форму"</p>
				</div>
			</details>
			<textarea
				className={styles.textarea}
				value={textareaText}
				onChange={(e) => setTextareaText(e.target.value)}
			></textarea>
			<button
				className={styles.button}
				onClick={searchNotam}
			>Построить по координатам
			</button>
		</>
	);
}

export default TabNotams;
