import { Coordinate } from '../@types/Coordinate.type';
import { IArea } from '../@types/IArea.interface';
import { IFir } from '../@types/IFir.interface';
import { TabsType } from '../@types/Tabs.type';

type notamCoordsType = {
	polygon: Coordinate[][],
	text: string
}

export type StateStore = {
	activeTab: TabsType;
	notamCoords: notamCoordsType[];
	fligthCoords: Coordinate[];
	firCoords: IFir | null;
	areaCoords: IArea;
	isOpenModal: boolean;
}

export type ActionsStore = {
	setNotamCoords: (payload: notamCoordsType) => void;
	resetNotamCoords: () => void;
	setFligthCoords: (payload: Coordinate[]) => void;
	deleteFligthCoord: (payload: { lat: number, lng: number }) => void;
	setFirCoords: (payload: IFir | null) => void;
	setAreaCoords: (payload: IArea) => void;
	setActiveTab: (payload: TabsType) => void;
	setIsOpenModal: (payload: boolean) => void;
	reset: () => void;
}
