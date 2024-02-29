import { Coordinate } from '../@types/Coordinate.type';
import { IArea } from '../@types/IArea.interface';
import { IFir } from '../@types/IFir.interface';
import { TabsType } from '../@types/Tabs.type';

export type StateStore = {
	activeTab: TabsType;
	notamCoords: Coordinate[][][];
	fligthCoords: Coordinate[];
	firCoords: IFir | null;
	areaCoords: IArea;
}

export type ActionsStore = {
	setNotamCoords: (payload: Coordinate[][][]) => void;
	setFligthCoords: (payload: Coordinate[]) => void;
	deleteFligthCoord: (payload: { lat: number, lng: number }) => void;
	setFirCoords: (payload: IFir | null) => void;
	setAreaCoords: (payload: IArea) => void;
	setActiveTab: (payload: TabsType) => void;
	reset: () => void;
}
