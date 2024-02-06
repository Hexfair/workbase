import { ICoordinate } from '../MapLeaflet/MapLeaflet.interface';
//===========================================================================================================

export interface TabNotamsProps {
	setNotamCoords: React.Dispatch<React.SetStateAction<ICoordinate[][]>>;
}
