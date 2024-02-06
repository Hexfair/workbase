import React, { Fragment } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Polyline, Marker, Tooltip } from 'react-leaflet';
import styles from './MapLeaflet.module.scss';
import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import { MapLeafletProps } from './MapLeaflet.props';
import { ICoordinate } from './MapLeaflet.interface';
import Recenter from './Plugins/MapRecenter';
import { circleIcon, squareIcon } from './MapLeaflet.icons';
import ClearIcon from '../../assets/icon/clear.svg?react';
import CursorCoordinates from './Plugins/CursorCoordinates/CursorCoordinates';
import LeafletRuler from './Plugins/PolylineMeasure/LeafletRuler';
//===========================================================================================================
const purpleOptions = { color: 'purple' };
const blueOptions = { color: '#8e04ff' };
const areaOptions = { color: '#0057a3', fillColor: '#0057a3', weight: 2 };
//===========================================================================================================

export default function MapLeaflet({ notamCoords, fligthCoords, firCoords, clearAll }: MapLeafletProps) {
	const [mapCenter, setMapCenter] = React.useState<ICoordinate>({ lat: 40.0, lng: -90.00 });

	const isNotEmpty = notamCoords.length > 0 || fligthCoords.length > 0 || firCoords.center.length > 0;

	const getRecenter = () => {
		if (notamCoords.length > 0) return notamCoords[0];
		if (fligthCoords.length > 0) return fligthCoords;
		if (firCoords.center.length > 0) return [{ lat: firCoords.center[0], lng: firCoords.center[1] }]
		return []
	}

	return (
		<div className={styles.map}>
			<MapContainer center={mapCenter} zoom={4} scrollWheelZoom={true} worldCopyJump>
				<TileLayer url="/map-tiles/{z}/{x}/{y}.png" />
				<Recenter lat={mapCenter.lat} lng={mapCenter.lng} coords={getRecenter()} setMapCenter={setMapCenter} />

				{notamCoords.length > 0 && notamCoords
					.map((item, index) => (
						<Fragment key={`${index}${item[0]}${item[1]}`}>
							<Polygon pathOptions={purpleOptions} positions={item} />
							{item.map((obj, index) =>
								<Marker key={index} position={obj} icon={circleIcon}>
									<Popup children={`Координаты: ${obj.lat}, ${obj.lng}`} />
								</Marker>)}
						</Fragment>)
					)
				}

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