import { IArea } from '../../@types/IArea.interface';
import { ICoordinate } from '../../@types/ICoordinate.interface';
//===========================================================================================================

export interface BlockInfoProps {
	areaCoords: IArea;
	notamCoords: ICoordinate[][][];
	dataIntersect: number[][][] | null;
}
