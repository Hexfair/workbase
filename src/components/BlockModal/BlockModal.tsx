import React from 'react';
import styles from './BlockModal.module.scss';
import Modal from 'react-modal';
import { useStore } from '../../store/store';
import { calcResultCoordinates } from '../../helpers/map-coordinates.helper';
//=========================================================================================================================

type ErrorStateType = {
	polygon1: string,
	polygon2: string,
	polygon3: string,
	polygon4: string,
	polygon5: string,
	circle: string,
	status: boolean
}
const initialErrorState: ErrorStateType = {
	polygon1: '',
	polygon2: '',
	polygon3: '',
	polygon4: '',
	polygon5: '',
	circle: '',
	status: false,
}

export const BlockModal = () => {
	const { isOpenModal, setIsOpenModal } = useStore();

	const [name, setName] = React.useState<string>('');
	const [country, setCountry] = React.useState<string>('');
	const [rocket, setRocket] = React.useState<string>('');
	const [polygon1, setPolygon1] = React.useState<string>('');
	const [polygon2, setPolygon2] = React.useState<string>('');
	const [polygon3, setPolygon3] = React.useState<string>('');
	const [polygon4, setPolygon4] = React.useState<string>('');
	const [polygon5, setPolygon5] = React.useState<string>('');
	const [circle, setCircle] = React.useState<string>('');
	const [radius, setRadius] = React.useState<string>('');
	const [error, setError] = React.useState<ErrorStateType>(initialErrorState);

	const inputRef = React.useRef<HTMLInputElement>(null);

	const onChangePolygon = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length === 0) return;
		const value = event.target.value;
		for (let item of value.trim().split(' ')) {
			if (!(/\d{6}[N|S]\d{7}[W|E]/.test(item))) {
				setError(prev => ({ ...prev, [event.target.name]: 'wd2d2d2wdw', status: true }))
			}
			else (
				setError(prev => ({ ...prev, [event.target.name]: '', status: false }))
			)
		}
	}

	const calcCoords = (polygon: string) => {
		const arr = polygon.trim().split(' ');

		if (arr.length === 1) {
			return calcResultCoordinates(arr[0])!
		}

		const arrPoly = arr.filter(obj => obj.length > 0).map(obj => calcResultCoordinates(obj)!);

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

		const area = [
			polygon1.length > 0 && calcCoords(polygon1),
			polygon2.length > 0 && calcCoords(polygon2),
			polygon3.length > 0 && calcCoords(polygon3),
			polygon4.length > 0 && calcCoords(polygon4),
			circle.length > 0 && [[...calcCoords(circle), Number(radius)]],
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
			setPolygon1('');
			setPolygon2('');
			setPolygon3('');
			setPolygon4('');
			setPolygon5('');
			setCircle('');
			setRadius('');
			setError(initialErrorState);
		} else {
			alert('Ошибка при добавлении данных');
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
						<span className={styles.span}>Name</span>
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
							<span className={styles.span}>Country</span>
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
							<span className={styles.span}>Rocket</span>
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
						<span className={styles.span}>Polygon 1</span>
						<input
							name='polygon1'
							type='text'
							className={`${styles.input} ${error.polygon1.length > 0 && styles.red}`}
							value={polygon1}
							onChange={(e) => setPolygon1(e.target.value)}
							onBlur={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W через пробел'
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Polygon 2</span>
						<input
							name='polygon2'
							type='text'
							className={`${styles.input} ${error.polygon2.length > 0 && styles.red}`}
							value={polygon2}
							onChange={(e) => setPolygon2(e.target.value)}
							onBlur={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W через пробел'
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Polygon 3</span>
						<input
							name='polygon3'
							type='text'
							className={`${styles.input} ${error.polygon3.length > 0 && styles.red}`}
							value={polygon3}
							onChange={(e) => setPolygon3(e.target.value)}
							onBlur={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W через пробел'
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Polygon 4</span>
						<input
							name='polygon4'
							type='text'
							className={`${styles.input} ${error.polygon4.length > 0 && styles.red}`}
							value={polygon4}
							onChange={(e) => setPolygon4(e.target.value)}
							onBlur={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W через пробел'
						/>
					</label>
					<label className={styles.label}>
						<span className={styles.span}>Polygon 5</span>
						<input
							name='polygon5'
							type='text'
							className={`${styles.input} ${error.polygon5.length > 0 && styles.red}`}
							value={polygon5}
							onChange={(e) => setPolygon5(e.target.value)}
							onBlur={onChangePolygon}
							placeholder='Координаты в формате 112233N1112233W через пробел'
						/>
					</label>
					<div className={styles.row}>
						<label className={`${styles.label} ${styles.circle}`}>
							<span className={styles.span}>Circle</span>
							<input
								name='circle'
								type='text'
								className={`${styles.input} ${error.circle.length > 0 && styles.red}`}
								value={circle}
								onChange={(e) => setCircle(e.target.value)}
								onBlur={onChangePolygon}
								placeholder='Координаты центра круга'
							/>
						</label>
						<label className={`${styles.label} ${styles.radius}`}>
							<span className={styles.span}>Radius</span>
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
					disabled={error.status}
				>Сохранить
				</button>
				<button
					className={styles.button}
					onClick={() => setIsOpenModal(false)}
				>Отмена
				</button>
			</div>
		</Modal >
	)
}

/*
	id: number,
	mmsi: number,
	name: string,
	base: string,
	acronym: string,
	type: FiltersByType,
*/
