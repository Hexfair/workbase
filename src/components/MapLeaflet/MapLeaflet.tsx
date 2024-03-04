import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Polyline, Marker, Tooltip, Circle } from 'react-leaflet';
import styles from './MapLeaflet.module.scss';
import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import Recenter from './Plugins/MapRecenter';
import { difOptions, areaOptions, blueOptions, circleIcon, purpleOptions, squareIcon } from './MapLeaflet.options';
import ClearIcon from '../../assets/icon/clear.svg?react';
import CursorCoordinates from './Plugins/CursorCoordinates/CursorCoordinates';
import LeafletRuler from './Plugins/PolylineMeasure/LeafletRuler';
import { useStore } from '../../store/store';
import { Coordinate } from '../../@types/Coordinate.type';
import MapView from './Plugins/MapView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as turf from '@turf/turf';
//===========================================================================================================
const MAP_CENTER = { lat: 22.0, lng: -80.00 };
//===========================================================================================================

export default function MapLeaflet() {
	const { fligthCoords, notamCoords, firCoords, areaCoords, reset } = useStore();

	const [dataIntersect, setDataIntersect] = React.useState<Coordinate[][] | null>(null);
	const [viewCoords, setViewCoords] = React.useState<Coordinate[]>([[51, -126], [51, -33], [-14, -33], [-14, -126], [51, -126]]);

	const isNotEmpty = notamCoords.length > 0 || fligthCoords.length > 0 || firCoords;

	const getRecenter = () => {
		if (notamCoords.length > 0) return { lat: notamCoords[0].polygon[0][0][0], lng: notamCoords[0].polygon[0][0][1] };
		if (fligthCoords.length > 0) return { lat: fligthCoords[0][0], lng: fligthCoords[0][1] };
		if (firCoords && firCoords.center.length > 0) return { lat: firCoords.center[0], lng: firCoords.center[1] };
		return MAP_CENTER;
	};

	const clearMap = () => {
		reset();
		setDataIntersect(null);
	};

	return (
		<div className={styles.map}>
			<MapContainer center={MAP_CENTER} zoom={4} scrollWheelZoom={true} worldCopyJump >
				<TileLayer url="/map-tiles/{z}/{x}/{y}.png" />
				<Recenter lat={getRecenter().lat} lng={getRecenter().lng} />
				<MapView setViewCoords={setViewCoords} />

				{notamCoords.length > 0 && notamCoords
					.filter(item => {
						if (notamCoords.length < 20) {
							return true;
						}

						const poly1 = turf.polygon(item.polygon);
						const poly2 = turf.polygon([viewCoords]);
						return turf.booleanWithin(poly1, poly2);
					})
					.map((item, index) => (
						<Polygon
							key={`${index}${item.text}`}
							pathOptions={purpleOptions}
							positions={item.polygon.map(obj => obj)}
						>
							<Popup children={item.text} />
							{item.polygon.flat().map((obj, index) =>
								<Marker key={index} position={obj} icon={circleIcon} />)}
						</Polygon>))}

				<Polyline pathOptions={blueOptions} positions={fligthCoords} />
				{fligthCoords.length > 0 && fligthCoords.map((obj, index) =>
					<Marker key={index} position={obj} icon={index === 0 || index === fligthCoords.length - 1 ? circleIcon : squareIcon}>
						<Popup children={`Координаты: ${obj[0]}, ${obj[1]}`} />
					</Marker>)}

				{areaCoords.area.length > 0 &&
					areaCoords.area.map((item, index) => {
						if (item.length === 1) {
							return (
								<Circle
									key={`${index}${item[0]}`}
									center={[item[0][0], item[0][1]]}
									radius={item[0][2]}
									pathOptions={areaOptions}
								>
									<Tooltip sticky>{areaCoords.name}</Tooltip>
								</Circle>
							)
						} else {
							return (
								<Polygon
									key={`${index}${item[0]}`}
									pathOptions={areaOptions}
									positions={item.map(obj => obj)}
								>
									<Tooltip sticky>{areaCoords.name}</Tooltip>
								</Polygon>)
						}
					})}

				{dataIntersect &&
					<Polygon
						pathOptions={difOptions}
						positions={dataIntersect[0].map(item => ([item[0], item[1]]))}
					>
					</Polygon>}

				{firCoords && firCoords.area.length > 0 && firCoords.area
					.map((item, index) => (
						<Polygon
							key={`${index} ${item[0]} ${item[1]}`}
							pathOptions={areaOptions}
							positions={item.map(obj => ([obj[0], obj[1]]))}
						>
							<Tooltip sticky>{firCoords.icao} - {firCoords.name} ({firCoords.country})</Tooltip>
						</Polygon>))}
				<CursorCoordinates />
				<LeafletRuler />
			</MapContainer>
			{isNotEmpty &&
				<span className={styles.clear} title='Clear All'>
					<ClearIcon className={styles.icon} onClick={clearMap} />
				</span>}
		</div >
	);
}


