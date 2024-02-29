import React from 'react';
import styles from './TabArea.module.scss';
import { dataArea } from '../../assets/AllAreaCoord';
import { IArea } from '../../@types/IArea.interface';
import { Coordinate } from '../../@types/Coordinate.type';
import { reg1, reg2, reg3 } from '../TabNotams/TabNotams.regexp';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { useStore } from '../../store/store';
//=========================================================================================================================

function TabArea() {
	const { setNotamCoords, setAreaCoords } = useStore();

	const [selectedArea, setSelectedArea] = React.useState<IArea>();
	const [textareaText, setTextareaText] = React.useState<string>('');

	const onClickArea = (name: string) => {
		const findItem: IArea | undefined = dataArea.find(obj => obj.name === name);
		if (findItem) {
			setAreaCoords(findItem);
			setSelectedArea(findItem);
		}
	};

	const searchNotam = () => {
		const match = textareaText.match(reg1) || textareaText.match(reg2) || textareaText.match(reg3);

		if (match) {
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
		}
	};

	return (
		<div className={styles.box}>
			<div className={styles.head}>
				<span className={`${styles.icao} ${styles.th}`}>ICAO</span>
				<span className={`${styles.name} ${styles.th}`}>NAME</span>
				<span className={`${styles.country} ${styles.th}`}>COUNTRY</span>
			</div>
			<div className={styles.body}  >
				{dataArea.map(obj => (
					<div
						key={obj.name}
						className={`${styles.item} ${selectedArea?.name === obj.name && styles.select}`}
						onClick={() => onClickArea(obj.name)}>
						<span className={`${styles.name} ${styles.td}`}>{obj.name}</span>
					</div>
				))}
			</div>
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
		</div >
	);
}

export default TabArea;
