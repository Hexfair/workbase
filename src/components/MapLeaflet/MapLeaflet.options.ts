import L from 'leaflet';
//===========================================================================================================

export const circleIcon = L.icon({
	iconUrl: '/map-icon/circle.svg',
	iconAnchor: [4, 4],
	popupAnchor: [0, -2]
});

export const squareIcon = L.icon({
	iconUrl: '/map-icon/square.svg',
	iconAnchor: [4, 4],
	popupAnchor: [0, -2]
});

export const purpleOptions = { color: 'purple', weight: 2 };
export const blueOptions = { color: '#8e04ff' };
export const areaOptions = { color: '#0057a3', fillColor: '#0057a3', weight: 2 };
export const difOptions = { color: 'white', fillColor: 'white', weight: 2 };