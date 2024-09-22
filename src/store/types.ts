import { Coordinate } from '../@types/Coordinate.type';
import { IArea } from '../@types/IArea.interface';
import { IBase } from '../@types/IBase.interface';
import { IFir } from '../@types/IFir.interface';
import { IMissile } from '../@types/IMissile.interface';
import { ISelectedPoint } from '../@types/ISelectedPoint.interface';
import { TabsType } from '../@types/Tabs.type';

type notamCoordsType = {
    polygon: Coordinate[][],
    text: string
}

export type StateStore = {
    activeTab: TabsType;
    notamCoords: notamCoordsType[];
    fligthCoords: ISelectedPoint[];
    firCoords: IFir | null;
    basesCoords: IBase[];
    missilesCoords: IMissile[];
    reservationsCoords: IArea[];
    areaCoords: IArea;
    isOpenModal: boolean;
}

export type ActionsStore = {
    setNotamCoords: (payload: notamCoordsType) => void;
    resetNotamCoords: () => void;
    setFligthCoords: (payload: ISelectedPoint) => void;
    deleteFligthCoord: (payload: number) => void;
    setFirCoords: (payload: IFir | null) => void;
    setAreaCoords: (payload: IArea) => void;
    setActiveTab: (payload: TabsType) => void;
    setBaseCoords: (payload: IBase) => void;
    setBases: (payload: IBase[]) => void;
    deleteBaseCoord: (payload: string) => void;

    setMissileCoords: (payload: IMissile) => void;
    setMissiles: (payload: IMissile[]) => void;
    deleteMissileCoord: (payload: string) => void;

    setReservationCoords: (payload: IArea) => void;
    deleteReservationCoord: (payload: number) => void;

    setIsOpenModal: (payload: boolean) => void;
    reset: () => void;
}
