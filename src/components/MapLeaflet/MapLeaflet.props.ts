import { IArea } from '../../@types/IArea.interface';
import { ICoordinate } from '../../@types/ICoordinate.interface';
import { IFir } from '../../@types/IFir.interface';
//===========================================================================================================

export interface MapLeafletProps {
	notamCoords: ICoordinate[][][];
	fligthCoords: ICoordinate[];
	firCoords: IFir;
	areaCoords: IArea
	setNotamCoords?: (value: ICoordinate[]) => void;
	clearAll: () => void;
}
