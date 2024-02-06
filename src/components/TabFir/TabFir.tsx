import React from 'react';
import styles from './TabFir.module.scss';
import { TabFirProps } from './TabFir.props';
import { dataFIR } from '../../assets/AllFirCoord';
import { IFir } from '../../@types/IFir.interface';
//=========================================================================================================================

function TabFir({ setFirCoords }: TabFirProps) {
	const [selectedFir, setSelectedFir] = React.useState<Omit<IFir, 'area'>>();

	const onClickFir = (icao: string) => {
		const findItem: IFir | undefined = dataFIR.find(obj => obj.icao === icao);
		if (findItem) {
			setFirCoords(findItem);
			const { area, ...selectedData } = findItem;
			setSelectedFir(selectedData);
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
				{dataFIR
					.sort((a, b) => {
						if (a.icao < b.icao) return -1;
						if (a.icao > b.icao) return 1;
						return 0;
					})
					.map(obj => (
						<div key={obj.icao} className={`${styles.item} ${selectedFir?.icao === obj.icao && styles.select}`} onClick={() => onClickFir(obj.icao)}>
							<span className={`${styles.icao} ${styles.td}`}>{obj.icao}</span>
							<span className={`${styles.name} ${styles.td}`}>{obj.name}</span>
							<span className={`${styles.country} ${styles.td}`}>{obj.country}</span>
						</div>
					))}
			</div>
			{selectedFir &&
				<div className={styles.info}>
					<div className={styles.infoName}>{selectedFir.icao} - {selectedFir.name}</div>
					<div className={styles.infoCountry}>Country: {selectedFir.country}</div>
					<div className={styles.infoSize}>Size: {selectedFir.size} km<sup className={styles.sup}>2</sup></div>
					<div className={styles.infoAirports}>Airports: {selectedFir.airports}</div>
					<div className={styles.infoCenter}>Center: {selectedFir.center[0]}, {selectedFir.center[1]}</div>


				</div>}
		</div >
	);
}

export default TabFir;
