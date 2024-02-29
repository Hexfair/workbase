import { IArea } from '../../@types/IArea.interface';
import { Coordinate } from '../../@types/Coordinate.type';
//===========================================================================================================

export interface BlockInfoProps {
	areaCoords: IArea;
	notamCoords: Coordinate[][][];
	dataIntersect: Coordinate[][] | null;
}
