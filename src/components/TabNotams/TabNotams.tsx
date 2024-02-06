import React from 'react';
import styles from './TabNotams.module.scss';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { reg1, reg2, reg3 } from './TabNotams.regexp';
import { TabNotamsProps } from './TabNotams.props';
import { ICoordinate } from '../MapLeaflet/MapLeaflet.interface';
//=========================================================================================================================

function TabNotams({ setNotamCoords }: TabNotamsProps) {
	const [textareaText, setTextareaText] = React.useState<string>('');

	const searchNotam = () => {
		const match = textareaText.match(reg1) || textareaText.match(reg2) || textareaText.match(reg3);

		if (match) {
			const arr = textareaText.split('\n\n');
			for (const el of arr) {
				const elMatch = el.match(reg1) || el.match(reg2) || el.match(reg3);
				const coordItem: ICoordinate[] = [];

				if (elMatch && elMatch.length > 3) {
					elMatch.forEach((item) => {
						const tepmlatedCoord = calcTepmlateCoordinates(item.replaceAll(/[-|.|\s]/g, ''));
						const coordinates = calcResultCoordinates(tepmlatedCoord);
						coordinates && coordItem.push(coordinates);
					});
				}

				setNotamCoords((prev) => [...prev, coordItem]);
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
