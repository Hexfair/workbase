import React from 'react';
import styles from './TabNotams.module.scss';
import { IArea } from '../../@types/IArea.interface';
import { Coordinate } from '../../@types/Coordinate.type';
import { reg1, reg2, reg3, reg4 } from '../TabNotams/TabNotams.regexp';
import { calcResultCoordinates, calcTepmlateChinaCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { useStore } from '../../store/store';
import { calcDiffProcent } from '../../helpers/calc-diff-procent.helper';
import { calcOutputCoords } from '../../helpers/calc-output-coords.helper';
import DeleteIcon from '../../assets/icon/delete.svg?react';
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
	const [selectedCountry, setSelectedCountry] = React.useState<string>('Все');
	const [textFilter, setTextFilter] = React.useState<string>('');

	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const onBuildNotams = () => {
		setIsFilter(false);
		searchNotams(false);
	};

	const onDiffNotams = async () => {
		setIsFilter(true);
		searchNotams(true);
	};

	const searchNotams = (filter: boolean) => {
		let index = 0;

		if (!textareaRef || !textareaRef.current) return;

		for (const el of textareaRef.current.value.split('\n\n')) {
			const arrItem: Coordinate[][] = [];
			const coordItem: Coordinate[] = [];

			const elMatch = el.match(reg1) || el.match(reg2) || el.match(reg3);
			const elMatch2 = el.match(reg4);

			if (elMatch && elMatch.length > 3) {
				if (elMatch[0] !== elMatch[elMatch.length - 1]) {
					elMatch.push(elMatch[0]);
				}
				elMatch.forEach((item) => {
					const tepmlatedCoord = calcTepmlateCoordinates(item.replaceAll(/[-|.|\s|//]/g, ''));
					const coordinates = calcResultCoordinates(tepmlatedCoord);
					coordItem.push(coordinates);
				});
			}

			if (elMatch2 && elMatch2.length > 3) {
				if (elMatch2[0] !== elMatch2[elMatch2.length - 1]) {
					elMatch2.push(elMatch2[0]);
				}
				elMatch2.forEach((item) => {
					const calcChinaCoors = calcTepmlateChinaCoordinates(item.replaceAll(/[-|.|\s|//]/g, ''));
					const tepmlatedCoord = calcTepmlateCoordinates(calcChinaCoors);
					const coordinates = calcResultCoordinates(tepmlatedCoord);
					coordItem.push(coordinates);
				});
			}

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
					index = index + 1;
				}
			}
		}
	};

	const onClickArea = (id: number) => {
		const findItem: IArea | undefined = output.find(obj => obj.id === id);
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

	const onDeletePoint = async (id: number, name: string) => {
		if (confirm(`Вы точно хотите удалить запись "${name}"?`)) {
			const response = await fetch(import.meta.env.VITE_BASE_URL, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id }),
			});

			if (response.status === 200) {
				alert('Данные успешно удалены!');
				window.location.reload();
			} else {
				alert('Ошибка при добавлении данных');
			}
		}
	};

	const getOptions = () => {
		let countrySet = new Set(output.map(item => item.country));
		return Array.from(countrySet)
	}

	React.useEffect(() => {
		const getOutput = async () => {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/json`);
			const data = await response.json();
			const result = calcOutputCoords(data);
			setOutput(result)
		}
		getOutput();
	}, [])

	return (
		<div className={styles.box}>
			<div className={styles.head}>
				<button className={styles.button} onClick={() => setIsOpenModal(true)}>Добавить +</button>
				<div>
					<span className={styles.description}>Фильтр по стране</span>
					<select name='select' onChange={(e) => setSelectedCountry(e.target.value)} className={styles.select}>
						<option value='Все'>Все</option>
						{!isFilter && getOptions().map(obj => (
							<option key={obj} value={obj}>{obj}</option>
						))}
					</select>
				</div>
				<div>
					<span className={styles.description}>Поиск по тексту</span>
					<input
						className={styles.textFilter}
						value={textFilter}
						onChange={(e) => setTextFilter(e.target.value)}
						placeholder='Поиск по тексту...'
					/>
				</div>
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
													${obj.diff < 50 && styles.red}
													${obj.diff >= 50 && obj.diff < 80 && styles.yellow}
													${obj.diff >= 80 && styles.green}`}
							>{obj.diff ? `${obj.diff}%` : ''}
							</span>
							<span className={`${styles.name} ${styles.td}`}>{obj.area.name}</span>
						</div>
					)}

				{!isFilter && output
					.filter(obj => {
						if (selectedCountry === 'Все') return obj;
						return obj.country === selectedCountry;
					})
					.filter(obj =>
						obj.name.toLowerCase().includes(textFilter.toLowerCase())
						|| obj.rocket.toLowerCase().includes(textFilter.toLowerCase())
						|| obj.country.toLowerCase().includes(textFilter.toLowerCase()))
					.map(obj => (
						<div
							key={obj.id}
							className={`${styles.item} ${selectedArea?.id === obj.id && styles.select}`}
							onClick={() => onClickArea(obj.id)}>
							<span className={styles.diff}></span>
							<span className={`${styles.name} ${styles.td}`}>{obj.name}</span>
							<span className={styles.delete}>
								<DeleteIcon onClick={() => onDeletePoint(obj.id, obj.name)} />
							</span>
						</div>
					))}
			</div>
			<textarea className={styles.textarea} ref={textareaRef}></textarea>
			<div className={styles.buttons}>
				<button className={styles.button} onClick={onBuildNotams}>Построить</button>
				<button className={styles.button} onClick={onDiffNotams}>Построить и отфильтровать</button>
				<div className={styles.procent}>
					<span>%:</span>
					<input
						className={styles.input}
						type="number"
						min="0"
						max="100"
						value={countFilter}
						onChange={(e) => setCountFilter(Number(e.target.value))} />
				</div>
			</div>
		</div >
	);
}

export default TabNotams;
