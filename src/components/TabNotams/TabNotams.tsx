import React from 'react';
import styles from './TabNotams.module.scss';
import { IArea } from '../../@types/IArea.interface';
import { Coordinate } from '../../@types/Coordinate.type';
import { reg1, reg2, reg3 } from '../TabNotams/TabNotams.regexp';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { useStore } from '../../store/store';
import { calcDiffProcent } from '../../helpers/calc-diff-procent.helper';
// import Snipper from '../UI/Snipper/Snipper';
//=========================================================================================================================

interface IAllDiffAreas {
	id: number,
	area: IArea,
	notam: {
		text: string,
		polygon: Coordinate[]
	},
	diff: number
}

function TabNotams() {
	const { setNotamCoords, resetNotamCoords, setAreaCoords, setIsOpenModal } = useStore();
	const [selectedArea, setSelectedArea] = React.useState<IArea>();
	const [isFilter, setIsFilter] = React.useState<boolean>(false);
	const [countFilter, setCountFilter] = React.useState<number>(40);
	const [allDiffAreas, setAllDiffAreas] = React.useState<IAllDiffAreas[]>([]);
	const [selectedDiffArea, setSelectedDiffArea] = React.useState<IAllDiffAreas>();
	const [output, setOutput] = React.useState<IArea[]>([]);

	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const onBuildNotams = () => {
		setIsFilter(false);
		searchNotams(false);
	};

	const onDiffNotams = async () => {
		setIsFilter(true);
		searchNotams(true);
	};

	const setFilterProcent = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		if (value <= 0) {
			setCountFilter(0);
			return;
		}
		if (value >= 100) {
			setCountFilter(100);
			return;
		}
		setCountFilter(value);
	};

	const searchNotams = (filter: boolean) => {
		let index = 0;

		if (!textareaRef || !textareaRef.current) return;

		for (const el of textareaRef.current.value.split('\n\n')) {
			const arrItem: Coordinate[][] = [];
			const coordItem: Coordinate[] = [];

			const elMatch = el.match(reg1) || el.match(reg2) || el.match(reg3);
			if (!elMatch || elMatch.length < 4) continue;

			if (elMatch[0] !== elMatch[elMatch.length - 1]) {
				elMatch.push(elMatch[0]);
			}

			elMatch.forEach((item) => {
				const tepmlatedCoord = calcTepmlateCoordinates(item.replaceAll(/[-|.|\s|//]/g, ''));
				const coordinates = calcResultCoordinates(tepmlatedCoord);
				coordinates && coordItem.push(coordinates);
			});

			if (!filter) {
				if (coordItem.length > 3) {
					arrItem.push(coordItem);
					setNotamCoords({ polygon: arrItem, text: el });
				}
			} else {
				for (const area of output) {
					let areaMaxDiff = 0;

					for (const item of area.area) {
						if (item.length < 4 || coordItem.length < 4) continue;

						const itemDiff = calcDiffProcent(item, coordItem);
						if (itemDiff > areaMaxDiff) {
							areaMaxDiff = itemDiff;
						}
					}

					const result = {
						id: index,
						area: area,
						notam: {
							text: el,
							polygon: coordItem
						},
						diff: areaMaxDiff
					};

					setAllDiffAreas(prev => [...prev, result]);
				}
			}

			index = index + 1;
		}
	};

	const onClickArea = (name: string) => {
		const findItem: IArea | undefined = output.find(obj => obj.name === name);
		if (findItem) {
			setAreaCoords(findItem);
			setSelectedArea(findItem);
		}
	};

	const onClickDiffArea = async (id: number) => {
		resetNotamCoords();
		setAreaCoords({ name: '', area: [], country: '', rocket: '', id: 0 });
		const findItem: IAllDiffAreas | undefined = allDiffAreas.find(obj => obj.id === id);
		if (findItem) {
			setSelectedDiffArea(findItem);
			setNotamCoords({ polygon: [findItem.notam.polygon], text: findItem.notam.text });
			setAreaCoords(findItem.area);
		}
	};

	React.useEffect(() => {
		const getOutput = async () => {
			const response = await fetch('http://localhost:5050/json');
			const data = await response.json();
			setOutput(data)
		}
		getOutput();
	}, [])

	return (
		<div className={styles.box}>
			<div className={styles.head}>
				{/* <span className={`${styles.icao} ${styles.th}`}>ICAO</span>
				<span className={`${styles.name} ${styles.th}`}>NAME</span>
				<span className={`${styles.country} ${styles.th}`}>COUNTRY</span> */}
				<button className={styles.button} onClick={() => setIsOpenModal(true)}>Добавить</button>
			</div>
			<div className={styles.body}>
				{isFilter && allDiffAreas.length > 0 && allDiffAreas
					.filter(obj => obj.diff >= countFilter)
					.sort((a, b) => b.diff - a.diff)
					.map(obj =>
						<div
							key={obj.id}
							className={`${styles.item} ${selectedDiffArea?.id === obj.id && styles.select}`}
							onClick={() => onClickDiffArea(obj.id)}>
							<span className={`${styles.diff} 
													${obj.diff && obj.diff < 50 && styles.red}
													${(obj.diff && obj.diff >= 50) && (obj.diff && obj.diff < 80) && styles.yellow}
													${obj.diff && obj.diff >= 80 && styles.green}`}
							>{obj.diff ? `${obj.diff}%` : ''}
							</span>
							<span className={`${styles.name} ${styles.td}`}>{obj.area.name}</span>
						</div>
					)}

				{!isFilter && output.map(obj => (
					<div
						key={obj.id}
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
			<textarea className={styles.textarea} ref={textareaRef}></textarea>
			<div className={styles.buttons}>
				<button className={styles.button} onClick={onBuildNotams}>Построить</button>
				<button className={styles.button} onClick={onDiffNotams}>Построить и отфильтровать</button>
				<div className={styles.procent}>
					<span>%:</span>
					<input className={styles.input} type="number" value={countFilter} onChange={setFilterProcent} /></div>
			</div>
			{selectedDiffArea && <div className={styles.notam}>{selectedDiffArea.notam.text}</div>}
		</div >
	);
}

export default TabNotams;
