import React from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.offline';
import { IRecenter } from '../MapLeaflet.interface';
//===========================================================================================================

export default function Recenter(props: IRecenter) {
	const { lat, lng, coords, setMapCenter } = props;
	const map = useMap();

	React.useEffect(() => {
		map.setView([lat, lng]);
	}, [map, lat, lng]);

	React.useEffect(() => {
		coords.length > 0 && setMapCenter(coords[0]);
	}, [setMapCenter, coords]);

	return null;
}
