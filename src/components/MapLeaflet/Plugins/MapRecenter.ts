import React from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.offline';
//===========================================================================================================

export default function Recenter({ lat, lng }: { lat: number, lng: number }) {
	const map = useMap();

	React.useEffect(() => {
		map.setView([lat, lng]);
	}, [map, lat, lng]);

	return null;
}
