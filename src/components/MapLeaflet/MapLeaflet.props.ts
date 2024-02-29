import { IArea } from '../../@types/IArea.interface';
import { Coordinate } from '../../@types/Coordinate.type';
import { IFir } from '../../@types/IFir.interface';
import { TabsType } from '../../@types/Tabs.type';
//===========================================================================================================

export interface MapLeafletProps {
	notamCoords: Coordinate[][][];
	fligthCoords: Coordinate[];
	firCoords: IFir | null;
	areaCoords: IArea;
	activeTab: TabsType;
	setNotamCoords?: (value: Coordinate[]) => void;
	clearAll: () => void;
}
