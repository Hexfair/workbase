import { Coordinate } from '../@types/Coordinate.type';
//===========================================================================================================
export type SideTypes = 'N' | 'S' | 'W' | 'E';
export type SideLat = 'N' | 'S';
export type SideLng = 'W' | 'E';
//=========================================================================================================================

export const transformCoordinates = (d: number, m: number, s: number, side: SideTypes): number => {
	const decimalCoord = d + (m / 60) + (s / 3600);
	if (side === 'N' || side === 'E') return Number(decimalCoord.toFixed(3));
	if (side === 'S' || side === 'W') return Number(decimalCoord.toFixed(3)) * -1;
	return 0;
};


export const calcTepmlateCoordinates = (item: string) => {
	switch (item.length) {
		case 10: // 0000N0000W
			return item.slice(0, 4) + '00' + item[4] + '0' + item.slice(5, 9) + '00' + item[9];
		case 11: // 0000N00000W 
			return item.slice(0, 4) + '00' + item[4] + item.slice(5, 10) + '00' + item[10];
		case 13: // 204800N15831W
			return item.slice(0, 12) + '00' + item[12];
		case 14: // 000000N000000W
			return item.slice(0, 7) + '0' + item.slice(7);
		case 15: // 000000N0000000W
			return item;
		case 16:	// 0000000N0000000W
			return item.slice(0, 6) + item[7] + '0' + item.slice(8, 14) + item[15];
		case 17: // 0000000N00000000W
			return item.slice(0, 6) + item[7] + item.slice(8, 15) + item[16];
		case 18: // 00000000N00000000W
			return item.slice(0, 6) + item[8] + '0' + item.slice(9, 15) + item[17];
		case 19: // 00000000N000000000W
			return item.slice(0, 6) + item[8] + item.slice(9, 16) + item[18];
		default:
			return item;
	}
};

export const calcTepmlateChinaCoordinates = (item: string) => {
	// N0000W0000
	const side1 = item[0];
	let newItem = '';
	if (item.includes('W')) {
		newItem = item.slice(1).replace('W', side1) + 'W'
	}
	if (item.includes('E')) {
		newItem = item.slice(1).replace('E', side1) + 'E'
	}
	return newItem
};

// 000000N0000000W
export const calcResultCoordinates = (item: string): Coordinate => {
	const degLat = Number(item.slice(0, 2));
	const minLat = Number(item.slice(2, 4));
	const secLat = Number(item.slice(4, 6));
	const sideLat = item[6].toUpperCase() as SideLat;
	const latitude = transformCoordinates(degLat, minLat, secLat, sideLat);

	const degLng = Number(item.slice(7, 10));
	const minLng = Number(item.slice(10, 12));
	const secLng = Number(item.slice(12, 14));
	const sideLng = item[14].toUpperCase() as SideLng;
	const longitude = transformCoordinates(degLng, minLng, secLng, sideLng);

	return [latitude, longitude];
};
