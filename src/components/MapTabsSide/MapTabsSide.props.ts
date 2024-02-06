import { ICoordinate } from '../MapLeaflet/MapLeaflet.interface';
import { IFir } from '../TabFir/TabFir';
//===========================================================================================================

export interface MapTabsSideProps {
	setNotamCoords: React.Dispatch<React.SetStateAction<ICoordinate[][]>>;
	setFligthCoords: React.Dispatch<React.SetStateAction<ICoordinate[]>>;
	setFirCoords: React.Dispatch<React.SetStateAction<IFir>>;
}
