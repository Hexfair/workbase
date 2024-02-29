import './index.css';
import MapLeaflet from './components/MapLeaflet/MapLeaflet';
import MapTabsSide from './components/MapTabsSide/MapTabsSide';
//=========================================================================================================================

function App() {
	return (
		<main className='main'>
			<MapLeaflet />
			<MapTabsSide />
		</main>
	);
}

export default App;
