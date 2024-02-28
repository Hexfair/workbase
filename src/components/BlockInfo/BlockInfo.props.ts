import { IArea } from '../../@types/IArea.interface';
import { ICoordinate } from '../../@types/ICoordinate.interface';
<<<<<<< HEAD
=======
import { IDifference } from '../../@types/IDifference.interface';
>>>>>>> 979669274dc1aa614e74463a847132955a89a484
//===========================================================================================================

export interface BlockInfoProps {
	areaCoords: IArea;
	notamCoords: ICoordinate[][][];
<<<<<<< HEAD
	dataIntersect: number[][][] | null;
=======
	dataDifference: IDifference;
	dataIntersect: number[][] | null;
>>>>>>> 979669274dc1aa614e74463a847132955a89a484
}
