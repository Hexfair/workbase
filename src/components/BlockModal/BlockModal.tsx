import React from 'react';
import styles from './BlockModal.module.scss';
import Modal from 'react-modal';
import { useStore } from '../../store/store';
import { calcTepmlateChinaCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
import { reg1, reg2, reg3, reg4 } from '../TabNotams/TabNotams.regexp';
import { StateType, initialState } from './BlockModal.state';
import Input from '../UI/Input/Input';
import { inputs } from './BlockModal.constants';
import { IOutputArea } from '../../@types/IArea.interface';
//=========================================================================================================================

export const BlockModal = () => {
	const { isOpenModal, setIsOpenModal } = useStore();

	const [name, setName] = React.useState<string>('');
	const [country, setCountry] = React.useState<string>('');
	const [rocket, setRocket] = React.useState<string>('');
	const [polygon, setPolygon] = React.useState<StateType>(initialState);
	const [radius, setRadius] = React.useState<string>('');
	const [error, setError] = React.useState<StateType>(initialState);
	const [text, setText] = React.useState<string>('');
	const [output, setOutput] = React.useState<IOutputArea[]>([]);
	const [selectedArea, setSelectedArea] = React.useState<IOutputArea>();
	const [isChecked, setIsChecked] = React.useState(false);
	const ref = React.useRef<HTMLInputElement>(null);

	const inputRef = React.useRef<HTMLInputElement>(null);

	const isValidForm = () => {
		return Boolean(error.polygon1 || error.polygon2 || error.polygon3 || error.polygon4 || error.polygon5 || error.circle)
	}

	const resetState = () => {
		setName('');
		setCountry('');
		setRocket('');
		setPolygon(initialState);
		setRadius('');
		setError(initialState);
	}

	const checkPositionEquivalent = (item: string) => {
		const arr = item.split(' ');
		if (arr[0] !== arr[arr.length - 1]) {
			return item + ' ' + arr[0];
		}
		else {
			return item;
		}
	}
	const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (radius.length > 0 && isNaN(Number(radius))) {
			return alert('Неверный формат РАДИУСА');
		}

		if (name.length < 3) {
			return alert('Введите название (не менее 3 символов)');
		}

		const area = [
			checkPositionEquivalent(polygon.polygon1.toUpperCase()),
			checkPositionEquivalent(polygon.polygon2.toUpperCase()),
			checkPositionEquivalent(polygon.polygon3.toUpperCase()),
			checkPositionEquivalent(polygon.polygon4.toUpperCase()),
			checkPositionEquivalent(polygon.polygon5.toUpperCase()),
			polygon.circle.toUpperCase() + radius,
		].filter(obj => obj.length > 0);

		const sendData = {
			"name": name,
			"country": country,
			"rocket": rocket,
			"area": area
		};

		const response = await fetch(import.meta.env.VITE_BASE_URL,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({ data: sendData, updateId: selectedArea?.id, isNew: !isChecked }),
			})

		if (response.status === 200) {
			!isChecked ? alert('Данные успешно добавлены!') : alert('Данные успешно обновлены!');
			resetState();
		} else {
			!isChecked ? alert('Ошибка при добавлении данных!') : alert('Ошибка при обновлении данных!');
		}
	}

	const onCancelModal = () => {
		resetState();
		setIsOpenModal(false);
		setText('');
	}

	const onChangePolygon = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPolygon(prev => ({ ...prev, [event.target.name]: event.target.value }))

		if (!event.target.validity.valid) {
			setError(prev => ({ ...prev, [event.target.name]: 'Error', status: true }))
		} else {
			setError(prev => ({ ...prev, [event.target.name]: '', status: false }))
		}
	}

	const onParseCoords = () => {
		const arr = text.split('\n\n').filter(obj => obj.length > 0);
		if (arr.length >= 6) return alert('Можно добавить только 5 полигонов!');

		for (let i = 0; i < arr.length; i++) {
			const elMatch = arr[i].match(reg1) || arr[i].match(reg2) || arr[i].match(reg3);
			const elMatch2 = arr[i].match(reg4);

			if (elMatch) {
				const coordsString = elMatch?.reduce((acc, item) => {
					const tepmlatedCoord = calcTepmlateCoordinates(item.replaceAll(/[-|.|\s|//]/g, ''));
					return acc = acc + tepmlatedCoord + ' ';
				}, '');

				setPolygon(prev => ({ ...prev, ['polygon' + (i + 1)]: coordsString?.trim() }))
			}
			if (elMatch2) {
				const coordsString = elMatch2?.reduce((acc, item) => {
					const calcChinaCoors = calcTepmlateChinaCoordinates(item.replaceAll(/[-|.|\s|//]/g, ''));
					const tepmlatedCoord = calcTepmlateCoordinates(calcChinaCoors);
					return acc = acc + tepmlatedCoord + ' ';
				}, '');

				setPolygon(prev => ({ ...prev, ['polygon' + (i + 1)]: coordsString?.trim() }))
			}
		}
	}

	const getValue = (name: string) => {
		for (const [key, value] of Object.entries(polygon)) {
			if (key === name) return value
		}
	}

	const getError = (name: string) => {
		for (const [key, value] of Object.entries(error)) {
			if (key === name) return value
		}
	}

	const onClickArea = (id: number) => {
		resetState();
		const findItem: IOutputArea | undefined = output.find(obj => obj.id === id);
		if (!findItem) return;
		setSelectedArea(findItem);
		setName(findItem.name);
		setCountry(findItem.country);
		setRocket(findItem.rocket);

		findItem.area.forEach((obj, idx) => {
			if (obj.split(' ').length === 1) {
				const coord = obj.slice(0, 15);
				const radius = obj.slice(15);
				setPolygon(prev => ({ ...prev, ['circle']: coord.trim() }));
				setRadius(radius);
			} else {
				setPolygon(prev => ({ ...prev, ['polygon' + (idx + 1)]: obj.trim() }))
			}
		})
	};

	React.useEffect(() => {
		const getOutput = async () => {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL}/json`);
			const data = await response.json();
			setOutput(data)
		}
		getOutput();
	}, [])

	return (
		<Modal
			isOpen={isOpenModal}
			className={styles.modal}
			overlayClassName={styles.overlay}
			ariaHideApp={false}
		>
			<h2 className={styles.title}>Добавить новый район</h2>
			<div className={styles.content}>
				<div className={styles.left}>
					<form onSubmit={onSubmitForm} className={styles.form} id="form">
						<Input
							label='Название'
							name='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='Название'
						/>
						<div className={styles.row}>
							<Input
								label='Страна'
								name='country'
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								placeholder='Страна'
								className={styles.country}
							/>
							<Input
								label='Ракета'
								name='rocket'
								value={rocket}
								onChange={(e) => setRocket(e.target.value)}
								placeholder='Ракета-носитель'
								className={styles.rocket}
							/>
						</div>
						{inputs.map(obj => (
							<Input
								key={obj.name}
								label={obj.label}
								name={obj.name}
								error={getError(obj.name)}
								value={getValue(obj.name)}
								onChange={onChangePolygon}
								placeholder={obj.placeholder}
								pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){3,}"
								ref={ref}
							/>))}

						<div className={styles.row}>
							<Input
								label='Круг'
								name='circle'
								value={getValue('circle')}
								onChange={onChangePolygon}
								placeholder='Координаты центра круга'
								pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){1}"
								className={styles.circle}
							/>
							<Input
								label='Радиус'
								name='radius'
								value={radius}
								onChange={(e) => setRadius(e.target.value)}
								placeholder='Радиус в метрах'
								pattern="\d{1,}"
								className={styles.radius}
								required={polygon.circle.length > 0}
							/>
						</div>
						<input type='submit' ref={inputRef} hidden />
					</form>

					<div className={styles.buttons}>
						<button
							className={styles.button}
							onClick={() => inputRef && inputRef.current && inputRef.current.click()}
							disabled={isValidForm()}
						>Сохранить
						</button>
						<button
							className={styles.button}
							onClick={onCancelModal}
						>Отмена
						</button>
						<div className={styles.checkbox}>
							<input
								type='checkbox'
								name='checkbox'
								value='Change submit'
								checked={isChecked}
								onChange={() => setIsChecked(!isChecked)}
							/>
							Изменить существующий
						</div>
					</div>
					<div className={styles.parseBox}>
						<textarea
							className={styles.textarea}
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
						<button className={`${styles.button} ${styles.parse}`} onClick={onParseCoords}>Распарсить координаты</button>
					</div>
				</div>
				<div className={styles.right}>
					{output && output.map(obj => (
						<div
							key={obj.id}
							className={`${styles.item} ${selectedArea?.id === obj.id && styles.select}`}
							onClick={() => onClickArea(obj.id)}
						>
							{`${obj.name} (${obj.country})`}
						</div>
					))}
				</div>
			</div>
		</Modal >
	)
}
