import { IArea } from '../../@types/IArea.interface';
import { ICoordinate } from '../../@types/ICoordinate.interface';
//===========================================================================================================

export interface TabAreaProps {
	setAreaCoords: React.Dispatch<React.SetStateAction<IArea>>;
	setNotamCoords: React.Dispatch<React.SetStateAction<ICoordinate[][][]>>;
}
