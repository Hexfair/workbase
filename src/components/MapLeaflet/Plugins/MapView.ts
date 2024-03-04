import React from 'react';
import { useMapEvents } from 'react-leaflet';
import 'leaflet.offline';
import { Coordinate } from '../../../@types/Coordinate.type';
//===========================================================================================================

export default function MapView({ setViewCoords }: { setViewCoords: React.Dispatch<React.SetStateAction<Coordinate[]>> }) {

	const map = useMapEvents({
		mouseup: () => {
			const bounds = map.getBounds();
			const view: Coordinate[] = [
				[bounds.getNorthWest().lat, bounds.getNorthWest().lng],
				[bounds.getNorthEast().lat, bounds.getNorthEast().lng],
				[bounds.getSouthEast().lat, bounds.getSouthEast().lng],
				[bounds.getSouthWest().lat, bounds.getSouthWest().lng],
				[bounds.getNorthWest().lat, bounds.getNorthWest().lng]
			];
			setViewCoords(view);
		},
		zoom: () => {
			const bounds = map.getBounds();

			const view: Coordinate[] = [
				[bounds.getNorthWest().lat, bounds.getNorthWest().lng],
				[bounds.getNorthEast().lat, bounds.getNorthEast().lng],
				[bounds.getSouthEast().lat, bounds.getSouthEast().lng],
				[bounds.getSouthWest().lat, bounds.getSouthWest().lng],
				[bounds.getNorthWest().lat, bounds.getNorthWest().lng]
			];
			setViewCoords(view);
		}
	});

	// useMapEvents("mouseup", () => {
	// 	const bounds = map.getBounds();

	// 	const view: Coordinate[] = [
	// 		[bounds.getNorthWest().lat, bounds.getNorthWest().lng],
	// 		[bounds.getNorthEast().lat, bounds.getNorthEast().lng],
	// 		[bounds.getSouthEast().lat, bounds.getSouthEast().lng],
	// 		[bounds.getSouthWest().lat, bounds.getSouthWest().lng],
	// 		[bounds.getNorthWest().lat, bounds.getNorthWest().lng]
	// 	]
	// 	setViewCoords(view)
	// });

	// useMapEvents("zoom", () => {
	// 	const bounds = map.getBounds();

	// 	const view: Coordinate[] = [
	// 		[bounds.getNorthWest().lat, bounds.getNorthWest().lng],
	// 		[bounds.getNorthEast().lat, bounds.getNorthEast().lng],
	// 		[bounds.getSouthEast().lat, bounds.getSouthEast().lng],
	// 		[bounds.getSouthWest().lat, bounds.getSouthWest().lng],
	// 		[bounds.getNorthWest().lat, bounds.getNorthWest().lng]
	// 	]
	// 	setViewCoords(view)
	// });

	return null;
}
/*
{
	"_southWest": {
		 "lat": -27.994537867557803,
		 "lng": -100.20053635152075
	},
	"_northEast": {
		 "lat": 76.1429214527233,
		 "lng": -14.946630101520736
	}
}
*/