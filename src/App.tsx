import { useState } from 'react';
import MapLeaflet from './components/MapLeaflet/MapLeaflet';
import MapTabsSide from './components/MapTabsSide/MapTabsSide';
import { Coordinate } from './@types/Coordinate.type';
import './index.css';
import { IFir } from './@types/IFir.interface';
import { IArea } from './@types/IArea.interface';
import { TabsType } from './@types/Tabs.type';
//=========================================================================================================================

const areaInitial = {
	name: '',
	area: []
};

function App() {
	const [notamCoords, setNotamCoords] = useState<Coordinate[][][]>([]);
	const [fligthCoords, setFligthCoords] = useState<Coordinate[]>([]);
	const [firCoords, setFirCoords] = useState<IFir | null>(null);
	const [areaCoords, setAreaCoords] = useState<IArea>(areaInitial);
	const [activeTab, setActiveTab] = useState<TabsType>('notams');


	const clearAll = () => {
		setNotamCoords([]);
		setFligthCoords([]);
		setFirCoords(null);
		setAreaCoords(areaInitial);
	};

	return (
		<main className='main'>
			<MapLeaflet
				notamCoords={notamCoords}
				fligthCoords={fligthCoords}
				firCoords={firCoords}
				areaCoords={areaCoords}
				clearAll={clearAll}
				activeTab={activeTab} />
			<MapTabsSide
				setNotamCoords={setNotamCoords}
				setFligthCoords={setFligthCoords}
				setFirCoords={setFirCoords}
				setAreaCoords={setAreaCoords}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
		</main>
	);
}

export default App;
