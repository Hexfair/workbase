import { useState } from 'react';
import MapLeaflet from './components/MapLeaflet/MapLeaflet';
import MapTabsSide from './components/MapTabsSide/MapTabsSide';
import { ICoordinate } from './@types/ICoordinate.interface';
import './index.css';
import { IFir } from './@types/IFir.interface';
//=========================================================================================================================

const firInitial = {
	icao: '',
	name: '',
	area: [],
	size: '',
	center: [],
	country: '',
	airports: 0
};

function App() {
	const [notamCoords, setNotamCoords] = useState<ICoordinate[][][]>([]);
	const [fligthCoords, setFligthCoords] = useState<ICoordinate[]>([]);
	const [firCoords, setFirCoords] = useState<IFir>(firInitial);

	const clearAll = () => {
		setNotamCoords([]);
		setFligthCoords([]);
		setFirCoords(firInitial);
	};

	return (
		<main className='main'>
			<MapLeaflet notamCoords={notamCoords} fligthCoords={fligthCoords} firCoords={firCoords} clearAll={clearAll} />
			<MapTabsSide
				setNotamCoords={setNotamCoords}
				setFligthCoords={setFligthCoords}
				setFirCoords={setFirCoords}
			/>
		</main>
	);
}

export default App;
