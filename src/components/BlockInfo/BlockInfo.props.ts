import { IArea } from '../../@types/IArea.interface';
import { ICoordinate } from '../../@types/ICoordinate.interface';
import { IDifference } from '../../@types/IDifference.interface';
//===========================================================================================================

export interface BlockInfoProps {
	areaCoords: IArea;
	notamCoords: ICoordinate[][][];
	dataDifference: IDifference;
	dataIntersect: number[][] | null;
}
