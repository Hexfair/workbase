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
import BlockInfo from '../BlockInfo/BlockInfo';
import { IDifference } from '../../@types/IDifference.interface';
//===========================================================================================================
const MAP_CENTER = { lat: 40.0, lng: -90.00 };
//===========================================================================================================

export default function MapLeaflet(props: MapLeafletProps) {
	const { notamCoords, fligthCoords, firCoords, areaCoords, clearAll, activeTab } = props;

	const [dataDifference, setDataDifference] = React.useState<IDifference>({ diffNotam: [], diffArea: [] });
	const [dataIntersect, setDataIntersect] = React.useState<number[][][] | null>(null);
	const isNotEmpty = notamCoords.length > 0 || fligthCoords.length > 0 || firCoords || dataDifference;

	const getRecenter = () => {
		if (notamCoords.length > 0) return { lat: notamCoords[0][0][0][0], lng: notamCoords[0][0][0][1] };
		if (fligthCoords.length > 0) return { lat: fligthCoords[0][0], lng: fligthCoords[0][1] };
		if (firCoords && firCoords.center.length > 0) return { lat: firCoords.center[0], lng: firCoords.center[1] };
		return MAP_CENTER;
	};

	const clearMap = () => {
		clearAll();
		setDataDifference({ diffNotam: [], diffArea: [] });
	};

	React.useEffect(() => {
		if (notamCoords.length > 0 && areaCoords.area.length > 3) {
			const p1 = notamCoords[0].map(item => {
				return item.map(obj => ([obj[0], obj[1]]));
			});

			const p2 = [areaCoords.area];

			const poly1 = turf.polygon(p1);
			const poly2 = turf.polygon(p2);

			const intersection = turf.intersect(poly1, poly2);

			if (intersection) {
				setDataIntersect(intersection.geometry.coordinates);
			} else {
				setDataIntersect(null);
			}
		}
	}, [areaCoords, notamCoords]);

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
									<Popup children={`Координаты: ${obj[0]}, ${obj[1]}`} />
								</Marker>)}
						</Polygon>))}

				<Polyline pathOptions={blueOptions} positions={fligthCoords} />
				{fligthCoords.length > 0 && fligthCoords.map((obj, index) =>
					<Marker key={index} position={obj} icon={index === 0 || index === fligthCoords.length - 1 ? circleIcon : squareIcon}>
						<Popup children={`Координаты: ${obj[0]}, ${obj[1]}`} />
					</Marker>)}

				{areaCoords.area.length > 0 &&
					<Polygon
						pathOptions={areaOptions}
						positions={areaCoords.area.map(item => ([item[0], item[1]]))}
					>
						<Tooltip sticky>{areaCoords.name}</Tooltip>
					</Polygon>}

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
			{
				isNotEmpty && <span className={styles.clear} title='Clear All'>
					<ClearIcon className={styles.icon} onClick={clearMap} />
				</span>
			}
			{activeTab === 'area' && <BlockInfo areaCoords={areaCoords} notamCoords={notamCoords} dataIntersect={dataIntersect} />}
		</div >
	);
}

/*
[
	 [
		  [
				36,
				-90
		  ],
		  [
				40,
				-90
		  ],
		  [
				40.52122868962302,
				-88.17569958631941
		  ],
		  [
				36.244198360489825,
				-89.02320655804068
		  ],
		  [
				36,
				-90
		  ]
	 ]
]
*/