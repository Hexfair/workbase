import { ICoordinate } from '../MapLeaflet/MapLeaflet.interface';
//===========================================================================================================

export interface TabFlightsProps {
	setFligthCoords: React.Dispatch<React.SetStateAction<ICoordinate[]>>;
}
