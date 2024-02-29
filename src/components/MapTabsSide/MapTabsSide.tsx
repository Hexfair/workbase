import React, { Suspense } from 'react';
import styles from './MapTabsSide.module.scss';
import TabNotams from '../TabNotams/TabNotams';
import TabFlights from '../TabFlights/TabFlights';
import Snipper from '../UI/Snipper/Snipper';
import TabArea from '../TabArea/TabArea';
import { TabsType } from '../../@types/Tabs.type';
import { useStore } from '../../store/store';
const TabFir = React.lazy(() => import('../TabFir/TabFir'));
//===========================================================================================================

export default function MapTabsSide() {
	const { activeTab, setActiveTab } = useStore();

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
				{activeTab === 'notams' && <TabNotams />}
				{activeTab === 'flights' && <TabFlights />}
				{activeTab === 'fir' &&
					<Suspense fallback={<div className={styles.loading}><Snipper /></div>}>
						<TabFir />
					</Suspense>}
				{activeTab === 'area' && <TabArea />}

			</div>
		</div>
	);
}
