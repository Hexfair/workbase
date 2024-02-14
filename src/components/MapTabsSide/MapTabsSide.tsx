import React, { Suspense } from 'react';
import styles from './MapTabsSide.module.scss';
import { MapTabsSideProps } from './MapTabsSide.props';
import TabNotams from '../TabNotams/TabNotams';
import TabFlights from '../TabFlights/TabFlights';
import Snipper from '../UI/Snipper/Snipper';
import TabArea from '../TabArea/TabArea';
const TabFir = React.lazy(() => import('../TabFir/TabFir'));
//===========================================================================================================
type TabsType = 'notams' | 'flights' | 'fir' | 'area';
//=========================================================================================================================

export default function MapTabsSide(props: MapTabsSideProps) {
	const { setNotamCoords, setFligthCoords, setFirCoords, setAreaCoords } = props;
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
				<button
					className={`${styles.tab} ${activeTab === 'area' && styles.active}`}
					onClick={() => onChangeActiveTab('area')}
				>AREA
				</button>
			</div>
			<div className={styles.content}>
				{activeTab === 'notams' && <TabNotams setNotamCoords={setNotamCoords} />}
				{activeTab === 'flights' && <TabFlights setFligthCoords={setFligthCoords} />}
				{activeTab === 'fir' &&
					<Suspense fallback={<div className={styles.loading}><Snipper /></div>}>
						<TabFir setFirCoords={setFirCoords} />
					</Suspense>}
				{activeTab === 'area' && <TabArea setAreaCoords={setAreaCoords} setNotamCoords={setNotamCoords} />}

			</div>
		</div>
	);
}
