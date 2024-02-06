import React from 'react';
import { useMapEvent } from 'react-leaflet';
import styles from './CursorCoordinates.module.scss';
//===========================================================================================================

function CursorCoordinates() {
	const [coords, setCoords] = React.useState({ lat: 0, lng: 0 });

	useMapEvent('mousemove', (e) => {
		setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
	});

	return (
		<div className={styles.box}>
			<p className={styles.item}>
				{`lat: ${coords.lat.toFixed(3)}, lng ${coords.lng.toFixed(3)}`}
			</p>
		</div>
	);
}

export default CursorCoordinates;