import './index.css';
import MapLeaflet from './components/MapLeaflet/MapLeaflet';
import MapTabsSide from './components/MapTabsSide/MapTabsSide';
import { BlockModal } from './components/BlockModal/BlockModal';
//=========================================================================================================================

function App() {
	return (
		<>
			<main className='main'>
				<MapLeaflet />
				<MapTabsSide />
			</main>
			<BlockModal />
		</>
	);
}

export default App;
