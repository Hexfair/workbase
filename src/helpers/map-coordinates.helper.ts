import { ICoordinate, SideTypes } from '../components/MapLeaflet/MapLeaflet.interface';
//===========================================================================================================

export const transformCoordinates = (d: number, m: number, s: number, side: SideTypes): number | undefined => {
	const decimalCoord = d + (m / 60) + (s / 3600);
	if (side === 'N' || side === 'E') return Number(decimalCoord.toFixed(3));
	if (side === 'S' || side === 'W') return Number(decimalCoord.toFixed(3)) * -1;
};

export const calcTepmlateCoordinates = (item: string) => {
	switch (item.length) {
	case 10:
		return item.slice(0, 4) + '00.00' + item[4] + '0' + item.slice(5, 9) + '00.00' + item[9];
	case 11:
		return item.slice(0, 4) + '00.00' + item[4] + item.slice(5, 10) + '00.00' + item[10];
	case 12:
		return item.slice(0, 4) + '00.00' + item[4] + item.slice(5, 11) + '0.00' + item[11];
	case 13:
		return item.slice(0, 6) + '.00' + item[6] + item.slice(7, 12) + '00.00' + item[12];
	case 14:
		return item.slice(0, 6) + '.00' + item[6] + '0' + item.slice(7, 13) + '.00' + item[13];
	case 15:
		return item.slice(0, 6) + '.00' + item[6] + item.slice(7, 14) + '.00' + item[14];
	case 16:
		return item.slice(0, 6) + '.' + item[6] + '0' + item[7] + '0' + item.slice(8, 14) + '.' + item[14] + '0' + item[15];
	case 17:
		return item.slice(0, 6) + '.' + item[6] + '0' + item[7] + item.slice(8, 15) + '.' + item[15] + '0' + item[16];
	case 18:
		return item.slice(0, 8) + '0' + item[8] + '0' + item.slice(9, 17) + '0' + item[17];
	case 19:
		return item.slice(0, 8) + '0' + item[8] + item.slice(9, 18) + '0' + item[18];
	case 20:
		return item.slice(0, 10) + '0' + item.slice(10);
	default:
		return item;
	}
};

export const calcResultCoordinates = (item: string): ICoordinate | undefined => {
	const degLat = Number(item.slice(0, 2));
	const minLat = Number(item.slice(2, 4));
	const secLat = Number(item.slice(4, 9));
	const sideLat = item[9].toUpperCase() as SideTypes;
	const latitude = transformCoordinates(degLat, minLat, secLat, sideLat);

	const degLng = Number(item.slice(10, 13));
	const minLng = Number(item.slice(13, 15));
	const secLng = Number(item.slice(15, 20));
	const sideLng = item[20].toUpperCase() as SideTypes;
	const longitude = transformCoordinates(degLng, minLng, secLng, sideLng);

	if (latitude && longitude) return { lat: latitude, lng: longitude };
};
