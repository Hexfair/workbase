import { ICoordinate } from '../../@types/ICoordinate.interface';
import { IFir } from '../../@types/IFir.interface';
//===========================================================================================================

export interface MapTabsSideProps {
	setNotamCoords: React.Dispatch<React.SetStateAction<ICoordinate[][][]>>;
	setFligthCoords: React.Dispatch<React.SetStateAction<ICoordinate[]>>;
	setFirCoords: React.Dispatch<React.SetStateAction<IFir>>;
}
