export interface ICoordinate {
	lat: number,
	lng: number
}

export interface IRecenter extends ICoordinate {
	coords: ICoordinate[];
	setMapCenter: React.Dispatch<React.SetStateAction<ICoordinate>>
}

export type SideTypes = 'N' | 'S' | 'W' | 'E';