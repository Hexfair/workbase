import { Coordinate } from "../@types/Coordinate.type";
import { IArea, IOutputArea } from "../@types/IArea.interface";
import { calcResultCoordinates, calcTepmlateCoordinates } from "./map-coordinates.helper";

export const calcOutputCoords = (output: IOutputArea[]): IArea[] => {
	const result: IArea[] = [];

	for (const el of output) {
		const objects = el.area.map(obj => {
			let items: Coordinate[] = [];
			if (obj.split(' ').length === 1) {
				if (obj.includes('W')) {
					const arr = obj.split('W');
					const tepmlatedCoord = calcTepmlateCoordinates(arr[0] + 'W');
					const coordinates = calcResultCoordinates(tepmlatedCoord);
					coordinates.push(Number(arr[1]));
					items = [coordinates]
				}
				if (obj.includes('E')) {
					const arr = obj.split('E');
					const tepmlatedCoord = calcTepmlateCoordinates(arr[0] + 'E');
					const coordinates = calcResultCoordinates(tepmlatedCoord);
					coordinates.push(Number(arr[1]));
					items = [coordinates]
				}
			} else {
				items = obj.split(' ').map(item => {
					const tepmlatedCoord = calcTepmlateCoordinates(item);
					const coordinates = calcResultCoordinates(tepmlatedCoord);
					return coordinates;
				});
			}
			return items;
		})
		result.push({ ...el, area: objects })
	}

	return result;
};
