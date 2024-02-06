import React from 'react';
import { useMap } from 'react-leaflet';
import L, { LeafletEvent } from 'leaflet';
import './Leaflet.PolylineMeasure.js';
import './Leaflet.PolylineMeasure.scss';
//=========================================================================================================================

function LeafletRuler() {
	const map = useMap();

	const options = {
		position: 'topleft',
		unit: 'kilometres',
		showBearings: true,
		clearMeasurementsOnStop: false,
		showClearControl: true,
		showUnitControl: true
	};

	React.useEffect(() => {
		//@ts-ignore
		const polylineMeasure = L.control.polylineMeasure(options);
		polylineMeasure.addTo(map);

		function debugevent(e: LeafletEvent) { console.debug(e.type, e, polylineMeasure._currentLine); }
		map.on('polylinemeasure:toggle', debugevent);
		map.on('polylinemeasure:start', debugevent);
		map.on('polylinemeasure:resume', debugevent);
		map.on('polylinemeasure:finish', debugevent);
		map.on('polylinemeasure:change', debugevent);
		map.on('polylinemeasure:clear', debugevent);
		map.on('polylinemeasure:add', debugevent);
		map.on('polylinemeasure:insert', debugevent);
		map.on('polylinemeasure:move', debugevent);
		map.on('polylinemeasure:remove', debugevent);

		return () => polylineMeasure.remove();
	}, [map]);

	return null;
}

export default LeafletRuler;
