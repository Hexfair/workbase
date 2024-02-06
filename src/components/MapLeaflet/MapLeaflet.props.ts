import { IFir } from '../TabFir/TabFir';
import { ICoordinate } from './MapLeaflet.interface';
//===========================================================================================================

export interface MapLeafletProps {
	notamCoords: ICoordinate[][];
	fligthCoords: ICoordinate[];
	firCoords: IFir;
	setNotamCoords?: (value: ICoordinate[]) => void;
	clearAll: () => void;
}
