import { MapContainer, TileLayer, Polygon, Popup, Polyline, Marker, Tooltip } from 'react-leaflet';
import styles from './MapLeaflet.module.scss';
import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import { MapLeafletProps } from './MapLeaflet.props';
import Recenter from './Plugins/MapRecenter';
import { difOptions, areaOptions, blueOptions, circleIcon, purpleOptions, squareIcon } from './MapLeaflet.options';
import ClearIcon from '../../assets/icon/clear.svg?react';
import CursorCoordinates from './Plugins/CursorCoordinates/CursorCoordinates';
import LeafletRuler from './Plugins/PolylineMeasure/LeafletRuler';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as turf from '@turf/turf';
//===========================================================================================================
const MAP_CENTER = { lat: 40.0, lng: -90.00 };
//===========================================================================================================

export default function MapLeaflet({ notamCoords, fligthCoords, firCoords, areaCoords, clearAll }: MapLeafletProps) {
	const [data, setData] = React.useState<number[][][]>([]);
	const isNotEmpty = notamCoords.length > 0 || fligthCoords.length > 0 || firCoords.center.length > 0;

	const getRecenter = () => {
		if (notamCoords.length > 0) return { lat: notamCoords[0][0][0].lat, lng: notamCoords[0][0][0].lng };
		if (fligthCoords.length > 0) return { lat: fligthCoords[0].lat, lng: fligthCoords[0].lng };
		if (firCoords.center.length > 0) return { lat: firCoords.center[0], lng: firCoords.center[1] };
		return MAP_CENTER;
	};

	React.useEffect(() => {
		if (notamCoords.length > 0 && areaCoords.area.length > 3) {

			const c1 = notamCoords[0].map(item => {
				return item.map(obj => ([obj.lat, obj.lng]))
			})

			let poly1 = turf.polygon(c1, {
				"fill": "#F00",
				"fill-opacity": 0.1
			});

			let poly2 = turf.polygon([areaCoords.area], {
				"fill": "#00F",
				"fill-opacity": 0.1
			});

			console.log('p1', turf.area(poly1));
			console.log('p2', turf.area(poly2));


			let intersection = turf.intersect(poly1, poly2);
			if (intersection) {
				setData(intersection.geometry.coordinates)
				console.log(intersection.geometry.coordinates);
				let poly3 = turf.polygon(intersection.geometry.coordinates, {
					"fill": "#00F",
					"fill-opacity": 0.1
				});


				console.log('r2', turf.area(poly3));
			}
		}

	})



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

				{areaCoords.area.length > 0 &&
					<Polygon
						pathOptions={areaOptions}
						positions={areaCoords.area.map(item => ({ lat: item[0], lng: item[1] }))}
					>
						<Tooltip sticky>{areaCoords.name}</Tooltip>
					</Polygon>}

				{data.length > 0 &&
					<Polygon
						pathOptions={difOptions}
						positions={data[0].map(item => ([item[0], item[1]]))}
					>
					</Polygon>}

				{firCoords.area.length > 0 && firCoords.area
					.map((item, index) => (
						<Polygon
							key={`${index} ${item[0]} ${item[1]}`}
							pathOptions={areaOptions}
							positions={item.map(obj => ({ lat: obj[0], lng: obj[1] }))}
						>
							<Tooltip sticky>{firCoords.icao} - {firCoords.name} ({firCoords.country})</Tooltip>
						</Polygon>))}
				<CursorCoordinates />
				<LeafletRuler />
			</MapContainer>
			{
				isNotEmpty && <span className={styles.clear} title='Clear All'>
					<ClearIcon className={styles.icon} onClick={clearAll} />
				</span>
			}
			<button></button>
		</div >
	);
}