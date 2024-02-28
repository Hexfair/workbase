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
	const [dataIntersect, setDataIntersect] = React.useState<number[][] | null>(null);
	const isNotEmpty = notamCoords.length > 0 || fligthCoords.length > 0 || firCoords.center.length > 0 || dataDifference;

	const getRecenter = () => {
		if (notamCoords.length > 0) return { lat: notamCoords[0][0][0].lat, lng: notamCoords[0][0][0].lng };
		if (fligthCoords.length > 0) return { lat: fligthCoords[0].lat, lng: fligthCoords[0].lng };
		if (firCoords.center.length > 0) return { lat: firCoords.center[0], lng: firCoords.center[1] };
		return MAP_CENTER;
	};

	const clearMap = () => {
		clearAll();
		setDataDifference({ diffNotam: [], diffArea: [] });
	}

	React.useEffect(() => {
		if (notamCoords.length > 0 && areaCoords.area.length > 3) {
			const p1 = notamCoords[0].map(item => {
				return item.map(obj => ([obj.lat, obj.lng]))
			})

			const p2 = [areaCoords.area];

			let poly1 = turf.polygon(p1);
			let poly2 = turf.polygon(p2);

			let difference1 = turf.difference(poly1, poly2);
			let difference2 = turf.difference(poly2, poly1);

			console.log(difference1);

			if (!difference1 || !difference2) {
				return
			}

			if (difference1.geometry.type === 'Polygon') {
				setDataDifference(prev => ({
					...prev,
					diffNotam: [difference1.geometry.coordinates]
				}))
			}

			if (difference2.geometry.type === 'Polygon') {
				setDataDifference(prev => ({
					...prev,
					diffArea: [difference2.geometry.coordinates]
				}))
			}

			if (difference1.geometry.type === 'MultiPolygon') {
				setDataDifference(prev => ({
					...prev,
					diffNotam: difference1.geometry.coordinates
				}))
			}

			if (difference2.geometry.type === 'MultiPolygon') {
				setDataDifference(prev => ({
					...prev,
					diffArea: difference2.geometry.coordinates
				}))
			}

			let intersection = turf.intersect(poly1, poly2);

			if (intersection) {
				setDataIntersect(intersection.geometry.coordinates[0])
			} else {
				setDataIntersect(null)
			}
		}
	}, [areaCoords, notamCoords])

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
						positions={areaCoords.area.map(item => ([item[0], item[1]]))}
					>
						<Tooltip sticky>{areaCoords.name}</Tooltip>
					</Polygon>}

				{dataIntersect &&
					<Polygon
						pathOptions={difOptions}
						positions={dataIntersect.map(item => ([item[0], item[1]]))}
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
					<ClearIcon className={styles.icon} onClick={clearMap} />
				</span>
			}
			{activeTab === 'area' && <BlockInfo areaCoords={areaCoords} notamCoords={notamCoords} dataDifference={dataDifference} dataIntersect={dataIntersect} />}
		</div >
	);
}

/*
[
	[
		 [
			  [
					36.91936690647482,
					-86.32253237410072
			  ],
			  [
					38.030721570766296,
					-82.03072157076629
			  ],
			  [
					38,
					-82
			  ],
			  [
					36.91936690647482,
					-86.32253237410072
			  ]
		 ]
	],
	[
		 [
			  [
					40.98448907076555,
					-84.98448907076555
			  ],
			  [
					40.984645682645784,
					-86.55374011073975
			  ],
			  [
					42,
					-83
			  ],
			  [
					41,
					-85
			  ],
			  [
					40.98448907076555,
					-84.98448907076555
			  ]
		 ]
	]
]
*/

/*
[
	 [
		  [
				36.97321298526153,
				-86.10714805895387
		  ],
		  [
				40.984,
				-86.084
		  ],
		  [
				40.98411731079906,
				-86.5555894122033
		  ],
		  [
				42,
				-83
		  ],
		  [
				41,
				-85
		  ],
		  [
				38,
				-82
		  ],
		  [
				36.97321298526153,
				-86.10714805895387
		  ]
	 ]
]
*/