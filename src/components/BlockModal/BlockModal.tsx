import React from 'react';
import styles from './BlockModal.module.scss';
import Modal from 'react-modal';
import { useStore } from '../../store/store';
import { calcResultCoordinates, calcTepmlateCoordinates } from '../../helpers/map-coordinates.helper';
//=========================================================================================================================

type StateType = {
	polygon1: string,
	polygon2: string,
	polygon3: string,
	polygon4: string,
	polygon5: string,
	circle: string,
}
const initialState: StateType = {
	polygon1: '',
	polygon2: '',
	polygon3: '',
	polygon4: '',
	polygon5: '',
	circle: '',
}

export const BlockModal = () => {
	const { isOpenModal, setIsOpenModal } = useStore();

	const [name, setName] = React.useState<string>('');
	const [country, setCountry] = React.useState<string>('');
	const [rocket, setRocket] = React.useState<string>('');
	const [polygon, setPolygon] = React.useState<StateType>(initialState);
	const [radius, setRadius] = React.useState<string>('');
	const [error, setError] = React.useState<StateType>(initialState);

	const inputRef = React.useRef<HTMLInputElement>(null);

	const isValidForm = () => {
		return Boolean(error.polygon1 || error.polygon2 || error.polygon3 || error.polygon4 || error.polygon5 || error.circle)
	}

	const calcCoords = (polygon: string) => {
		const arr = polygon.trim().split(' ');

		if (arr.length === 1) {
			const tepmlatedCoord = calcTepmlateCoordinates(arr[0]);
			return calcResultCoordinates(tepmlatedCoord)!;
		}

		const arrPoly = arr.filter(obj => obj.length > 0).map(obj => {
			const tepmlatedCoord = calcTepmlateCoordinates(obj);
			return calcResultCoordinates(tepmlatedCoord);
		});

		if (arrPoly[0] !== arrPoly[arrPoly.length - 1]) {
			arrPoly.push(arrPoly[0]);
		}

		return arrPoly;
	}

	const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (radius.length > 0 && isNaN(Number(radius))) {
			return alert('Неверный формат РАДИУСА');
		}

		if (name.length < 4) {
			return alert('Введите название (не менее 3 символов)');
		}

		const area = [
			polygon.polygon1.length > 0 && calcCoords(polygon.polygon1),
			polygon.polygon2.length > 0 && calcCoords(polygon.polygon2),
			polygon.polygon3.length > 0 && calcCoords(polygon.polygon3),
			polygon.polygon4.length > 0 && calcCoords(polygon.polygon4),
			polygon.polygon5.length > 0 && calcCoords(polygon.polygon5),
			polygon.circle.length > 0 && [[...calcCoords(polygon.circle), Number(radius)]],
		].filter(obj => obj);

		const sendData = {
			"name": name,
			"country": country,
			"rocket": rocket,
			"area": area
		};

		const response = await fetch(`http://localhost:5050`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify(sendData),
			})

		if (response.status === 200) {
			alert('Данные успешно добавлены!');
			setName('');
			setCountry('');
			setRocket('');
			setPolygon(initialState);
			setRadius('');
			setError(initialState);
		} else {
			alert('Ошибка при добавлении данных');
		}
	}

	const onCancelModal = () => {
		setName('');
		setCountry('');
		setRocket('');
		setPolygon(initialState);
		setRadius('');
		setError(initialState);
		setIsOpenModal(false);
	}

	const onChangePolygon = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPolygon(prev => ({ ...prev, [event.target.name]: event.target.value }))
		if (!event.target.validity.valid) {
			setError(prev => ({ ...prev, [event.target.name]: 'Error', status: true }))
		} else {
			setError(prev => ({ ...prev, [event.target.name]: '', status: false }))
		}
	}

	return (
		<Modal
			isOpen={isOpenModal}
			className={styles.modal}
			overlayClassName={styles.overlay}
			ariaHideApp={false}
		>
			<h2 className={styles.title}>Добавить новый район</h2>
			<div className={styles.content}>
				<form onSubmit={onSubmitForm} className={styles.form} id="form">
					<label className={styles.label}>
						<span className={styles.span}>Название</span>
						<input
							name='name'
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className={styles.input}
							placeholder='Название'
						/>
					</label>

					<div className={styles.row}>
						<label className={`${styles.label} ${styles.country}`}>
							<span className={styles.span}>Страна</span>
							<input
								name='country'
								type='text'
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								className={styles.input}
								placeholder='Страна'
							/>

						</label>
						<label className={`${styles.label} ${styles.rocket}`}>
							<span className={styles.span}>Ракета</span>
							<input
								name='rocket'
								type='text'
								value={rocket}
								onChange={(e) => setRocket(e.target.value)}
								className={styles.input}
								placeholder='Ракета-носитель'
							/>
						</label>
					</div>

					<label className={styles.label}>
						<span className={styles.span}>Полигон 1</span>
						<input
							name='polygon1'
							type='text'
							className={`${styles.input} ${error.polygon1.length > 0 && styles.red}`}
							value={polygon.polygon1}
							onChange={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W или 1122N11122W через пробел (минимум три)'
							pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){3,}"
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Полигон 2</span>
						<input
							name='polygon2'
							type='text'
							className={`${styles.input} ${error.polygon2.length > 0 && styles.red}`}
							value={polygon.polygon2}
							onChange={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W или 1122N11122W через пробел (минимум три)'
							pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){3,}"
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Полигон 3</span>
						<input
							name='polygon3'
							type='text'
							className={`${styles.input} ${error.polygon3.length > 0 && styles.red}`}
							value={polygon.polygon3}
							onChange={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W или 1122N11122W через пробел (минимум три)'
							pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){3,}"
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Полигон 4</span>
						<input
							name='polygon4'
							type='text'
							className={`${styles.input} ${error.polygon4.length > 0 && styles.red}`}
							value={polygon.polygon4}
							onChange={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W или 1122N11122W через пробел (минимум три)'
							pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){3,}"
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Полигон 5</span>
						<input
							name='polygon5'
							type='text'
							className={`${styles.input} ${error.polygon5.length > 0 && styles.red}`}
							value={polygon.polygon5}
							onChange={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W или 1122N11122W через пробел (минимум три)'
							pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){3,}"
						/>
					</label>
					<div className={styles.row}>
						<label className={`${styles.label} ${styles.circle}`}>
							<span className={styles.span}>Круг</span>
							<input
								name='circle'
								type='text'
								className={`${styles.input} ${error.circle.length > 0 && styles.red}`}
								value={polygon.circle}
								onChange={onChangePolygon}
								placeholder='Координаты центра круга'
								pattern="(\d{4}(\d{2})?[NS](\s)?\d{5}(\d{2})?[WE](\s)?){1}"
							/>
						</label>
						<label className={`${styles.label} ${styles.radius}`}>
							<span className={styles.span}>Радиус</span>
							<input
								name='radius'
								type='text'
								value={radius}
								onChange={(e) => setRadius(e.target.value)}
								className={styles.input}
								placeholder='Радиус в метрах'
							/>
						</label>
					</div>
					<input type='submit' ref={inputRef} hidden />
				</form>
			</div>
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
			</div>
		</Modal >
	)
}
