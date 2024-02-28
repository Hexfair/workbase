import { IArea } from '../../@types/IArea.interface';
import { ICoordinate } from '../../@types/ICoordinate.interface';
import { IFir } from '../../@types/IFir.interface';
import { TabsType } from '../../@types/Tabs.type';
//===========================================================================================================

export interface MapLeafletProps {
	notamCoords: ICoordinate[][][];
	fligthCoords: ICoordinate[];
	firCoords: IFir;
	areaCoords: IArea;
	activeTab: TabsType;
	setNotamCoords?: (value: ICoordinate[]) => void;
	clearAll: () => void;
}
