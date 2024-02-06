import { MapContainer, TileLayer, Polygon, Popup, Polyline, Marker, Tooltip } from 'react-leaflet';
import styles from './MapLeaflet.module.scss';
import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import { MapLeafletProps } from './MapLeaflet.props';
import Recenter from './Plugins/MapRecenter';
import { areaOptions, blueOptions, circleIcon, purpleOptions, squareIcon } from './MapLeaflet.options';
import ClearIcon from '../../assets/icon/clear.svg?react';
import CursorCoordinates from './Plugins/CursorCoordinates/CursorCoordinates';
import LeafletRuler from './Plugins/PolylineMeasure/LeafletRuler';
//===========================================================================================================
const MAP_CENTER = { lat: 40.0, lng: -90.00 };
//===========================================================================================================

export default function MapLeaflet({ notamCoords, fligthCoords, firCoords, clearAll }: MapLeafletProps) {
	const isNotEmpty = notamCoords.length > 0 || fligthCoords.length > 0 || firCoords.center.length > 0;

	const getRecenter = () => {
		if (notamCoords.length > 0) return { lat: notamCoords[0][0][0].lat, lng: notamCoords[0][0][0].lng };
		if (fligthCoords.length > 0) return { lat: fligthCoords[0].lat, lng: fligthCoords[0].lng };
		if (firCoords.center.length > 0) return { lat: firCoords.center[0], lng: firCoords.center[1] };
		return MAP_CENTER;
	};

	return (
		<div className={styles.map}>
			<MapContainer center={MAP_CENTER} zoom={4} scrollWheelZoom={true} worldCopyJump>
				<TileLayer url="/map-tiles/{z}/{x}/{y}.png" />
				<Recenter lat={getRecenter().lat} lng={getRecenter().lng} />

				{notamCoords.length > 0 && notamCoords
					.map((item, index) => (
						<Polygon
							key={`${index}${item[0]}${item[1]}`}
							pathOptions={purpleOptions}
							positions={item.map(obj => obj)}
						>
							{item.flat().map((obj, index) =>
								<Marker key={index} position={obj} icon={circleIcon}>
									<Popup children={`Координаты: ${obj.lat}, ${obj.lng}`} />
								</Marker>)}
						</Polygon>))}

				<Polyline pathOptions={blueOptions} positions={fligthCoords} />
				{fligthCoords.length > 0 && fligthCoords.map((obj, index) =>
					<Marker key={index} position={obj} icon={index === 0 || index === fligthCoords.length - 1 ? circleIcon : squareIcon}>
						<Popup children={`Координаты: ${obj.lat}, ${obj.lng}`} />
					</Marker>)}

				{firCoords.area.length > 0 && firCoords.area
					.map((item, index) => (
						<Polygon
							key={`${index}${item[0]}${item[1]}`}
							pathOptions={areaOptions}
							positions={item.map(obj => ({ lat: obj[0], lng: obj[1] }))}
						>
							<Tooltip sticky>{firCoords.icao} - {firCoords.name} ({firCoords.country})</Tooltip>
						</Polygon>))}
				<CursorCoordinates />
				<LeafletRuler />
			</MapContainer>
			{isNotEmpty && <span className={styles.clear} title='Clear All'>
				<ClearIcon className={styles.icon} onClick={clearAll} />
			</span>}
		</div>
	);
}