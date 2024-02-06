import React from 'react';
import styles from './MapTabsSide.module.scss';
import { MapTabsSideProps } from './MapTabsSide.props';
import TabNotams from '../TabNotams/TabNotams';
import TabFlights from '../TabFlights/TabFlights';
import TabFir from '../TabFir/TabFir';
//===========================================================================================================
type TabsType = 'notams' | 'flights' | 'fir';
//=========================================================================================================================

export default function MapTabsSide(props: MapTabsSideProps) {
	const { setNotamCoords, setFligthCoords, setFirCoords } = props;
	const [activeTab, setActiveTab] = React.useState<TabsType>('notams');

	const onChangeActiveTab = (newTab: TabsType) => {
		setActiveTab(newTab);
	};

	return (
		<div className={styles.MapTabsSide}>
			<div className={styles.tabs}>
				<button
					className={`${styles.tab} ${activeTab === 'notams' && styles.active}`}
					onClick={() => onChangeActiveTab('notams')}
				>NOTAMs
				</button>
				<button
					className={`${styles.tab} ${activeTab === 'flights' && styles.active}`}
					onClick={() => onChangeActiveTab('flights')}
				>Flight plans
				</button>
				<button
					className={`${styles.tab} ${activeTab === 'fir' && styles.active}`}
					onClick={() => onChangeActiveTab('fir')}
				>FIR
				</button>
			</div>
			<div className={styles.content}>
				{activeTab === 'notams' && <TabNotams setNotamCoords={setNotamCoords} />}
				{activeTab === 'flights' && <TabFlights setFligthCoords={setFligthCoords} />}
				{activeTab === 'fir' && <TabFir setFirCoords={setFirCoords} />}
			</div>
		</div>
	);
}
