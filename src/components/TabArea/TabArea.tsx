import React from 'react';
import styles from './TabArea.module.scss';
import { dataArea } from '../../assets/AllAreaCoord';
import { IArea } from '../../@types/IArea.interface';
import { Coordinate } from '../../@types/Coordinate.type';
import { reg1, reg2, reg3 } from '../TabNotams/TabNotams.regexp';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { useStore } from '../../store/store';
import { calcDiffProcent } from '../../helpers/calc-diff-procent.helper';
//=========================================================================================================================

function TabArea() {
	const { notamCoords, setNotamCoords, setAreaCoords } = useStore();

	const [selectedArea, setSelectedArea] = React.useState<IArea>();
	const [textareaText, setTextareaText] = React.useState<string>('');
	const [isFilter, setIsFilter] = React.useState<boolean>(false);
	const [countFilter, setCountFilter] = React.useState<number>(40);

	const onClickArea = (name: string) => {
		const findItem: IArea | undefined = dataArea.find(obj => obj.name === name);
		if (findItem) {
			setAreaCoords(findItem);
			setSelectedArea(findItem);
		}
	};

	const onSearchNotam = () => {
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

	const onFilterAreas = () => {
		onSearchNotam();
		setIsFilter(true);
	}

	const setDiffProcent = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		if (value <= 0) {
			setCountFilter(0);
			return;
		}
		if (value >= 100) {
			setCountFilter(100);
			return
		}
		setCountFilter(value);
	}

	return (
		<div className={styles.box}>
			<div className={styles.head}>
				<span className={`${styles.icao} ${styles.th}`}>ICAO</span>
				<span className={`${styles.name} ${styles.th}`}>NAME</span>
				<span className={`${styles.country} ${styles.th}`}>COUNTRY</span>
			</div>
			<div className={styles.body}  >
				{dataArea
					.filter(obj => {
						if (!isFilter) return obj;
						const diffProcent = calcDiffProcent(obj, notamCoords);
						if (diffProcent >= countFilter) {
							obj.diff = diffProcent
							return obj;
						} else {
							return;
						}
					})
					.sort((a, b) => {
						if (!isFilter || a.diff === undefined || b.diff === undefined) return 0;
						return (b.diff - a.diff)
					})
					.map(obj => (
						<div
							key={obj.name}
							className={`${styles.item} ${selectedArea?.name === obj.name && styles.select}`}
							onClick={() => onClickArea(obj.name)}>
							<span className={`${styles.diff} 
													${obj.diff && obj.diff < 50 && styles.red}
													${(obj.diff && obj.diff >= 50) && (obj.diff && obj.diff < 80) && styles.yellow}
													${obj.diff && obj.diff >= 80 && styles.green}`}
							>{isFilter && obj.diff ? `${obj.diff}%` : ''}
							</span>
							<span className={`${styles.name} ${styles.td}`}>{obj.name}</span>
						</div>
					))}
			</div>
			<textarea
				className={styles.textarea}
				value={textareaText}
				onChange={(e) => setTextareaText(e.target.value)}
			></textarea>
			<div className={styles.buttons}>
				<button className={styles.button} onClick={onSearchNotam}>Построить</button>
				<button className={styles.button} onClick={onFilterAreas}>Построить и отфильтровать</button>
				<div className={styles.procent}>
					<span>%:</span>
					<input className={styles.input} type="number" value={countFilter} onChange={setDiffProcent} /></div>
			</div>
		</div >
	);
}

export default TabArea;
