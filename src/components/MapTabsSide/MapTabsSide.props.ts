import { IArea } from '../../@types/IArea.interface';
import { Coordinate } from '../../@types/Coordinate.type';
import { IFir } from '../../@types/IFir.interface';
import { TabsType } from '../../@types/Tabs.type';
//===========================================================================================================

export interface MapTabsSideProps {
	setNotamCoords: React.Dispatch<React.SetStateAction<Coordinate[][][]>>;
	setFligthCoords: React.Dispatch<React.SetStateAction<Coordinate[]>>;
	setFirCoords: React.Dispatch<React.SetStateAction<IFir | null>>;
	setAreaCoords: React.Dispatch<React.SetStateAction<IArea>>;
	activeTab: TabsType
	setActiveTab: React.Dispatch<React.SetStateAction<TabsType>>;
}
