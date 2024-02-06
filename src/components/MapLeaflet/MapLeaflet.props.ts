import { ICoordinate } from '../../@types/ICoordinate.interface';
import { IFir } from '../../@types/IFir.interface';
//===========================================================================================================

export interface MapLeafletProps {
	notamCoords: ICoordinate[][][];
	fligthCoords: ICoordinate[];
	firCoords: IFir;
	setNotamCoords?: (value: ICoordinate[]) => void;
	clearAll: () => void;
}
