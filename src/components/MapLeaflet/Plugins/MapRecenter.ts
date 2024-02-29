import React from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.offline';
import { ICoordinate } from '../../../@types/Coordinate.type';
//===========================================================================================================

export default function Recenter({ lat, lng }: ICoordinate) {
	const map = useMap();

	React.useEffect(() => {
		map.setView([lat, lng]);
	}, [map, lat, lng]);

	return null;
}
