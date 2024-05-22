import React, { Suspense } from 'react';
import styles from './MapTabsSide.module.scss';
import TabNotams from '../TabNotams/TabNotams';
import TabFlights from '../TabFlights/TabFlights';
import { useStore } from '../../store/store';
import Spinner from '../UI/Spinner/Spinner';
const TabFir = React.lazy(() => import('../TabFir/TabFir'));
const TabBases = React.lazy(() => import('../TabBases/TabBases'));
const TabMissiles = React.lazy(() => import('../TabMissiles/TabMissiles'));
//===========================================================================================================

export default function MapTabsSide() {
    const { activeTab, setActiveTab } = useStore();

    return (
        <div className={styles.MapTabsSide}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'notams' && styles.active}`}
                    onClick={() => setActiveTab('notams')}
                >NOTAMs
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'flights' && styles.active}`}
                    onClick={() => setActiveTab('flights')}
                >Flight plans
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'bases' && styles.active}`}
                    onClick={() => setActiveTab('bases')}
                >Bases
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'missiles' && styles.active}`}
                    onClick={() => setActiveTab('missiles')}
                >Missiles
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'fir' && styles.active}`}
                    onClick={() => setActiveTab('fir')}
                >FIR
                </button>
            </div>
            <div className={styles.content}>
                {activeTab === 'notams' && <TabNotams />}
                {activeTab === 'flights' && <TabFlights />}
                {activeTab === 'bases' &&
                    <Suspense fallback={<div className={styles.loading}><Spinner /></div>}>
                        <TabBases />
                    </Suspense>}
                {activeTab === 'missiles' &&
                    <Suspense fallback={<div className={styles.loading}><Spinner /></div>}>
                        <TabMissiles />
                    </Suspense>}
                {activeTab === 'fir' &&
                    <Suspense fallback={<div className={styles.loading}><Spinner /></div>}>
                        <TabFir />
                    </Suspense>}
            </div>
        </div>
    );
}
