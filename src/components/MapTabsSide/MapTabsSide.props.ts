import { IArea } from '../../@types/IArea.interface';
import { ICoordinate } from '../../@types/ICoordinate.interface';
import { IFir } from '../../@types/IFir.interface';
import { TabsType } from '../../@types/Tabs.type';
//===========================================================================================================

export interface MapTabsSideProps {
	setNotamCoords: React.Dispatch<React.SetStateAction<ICoordinate[][][]>>;
	setFligthCoords: React.Dispatch<React.SetStateAction<ICoordinate[]>>;
	setFirCoords: React.Dispatch<React.SetStateAction<IFir>>;
	setAreaCoords: React.Dispatch<React.SetStateAction<IArea>>;
	activeTab: TabsType
	setActiveTab: React.Dispatch<React.SetStateAction<TabsType>>;
}
