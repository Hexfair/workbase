import { create } from 'zustand';
import { ActionsStore, StateStore } from './types';

const initialState: StateStore = {
	activeTab: 'notams',
	notamCoords: [],
	fligthCoords: [],
	firCoords: null,
	areaCoords: { name: '', area: [], country: '', rocket: '', id: 0 },
	isOpenModal: false
};

export const useStore = create<StateStore & ActionsStore>()((set, get) => ({
	...initialState,
	setActiveTab: (payload) => {
		set({ activeTab: payload });
	},
	setNotamCoords: (payload) => {
		const prevNotamCoords = get().notamCoords;
		set({ notamCoords: [...prevNotamCoords, payload] });
	},
	resetNotamCoords: () => {
		set({ notamCoords: [] });
	},
	setFligthCoords: (payload) => {
		const prevFlightCoords = get().fligthCoords;
		set({ fligthCoords: [...prevFlightCoords, payload] });
	},
	deleteFligthCoord: (payload) => {
		set({ fligthCoords: get().fligthCoords.filter(obj => obj.idx !== payload) });
	},
	setFirCoords: (payload) => {
		set({ firCoords: payload });
	},
	setAreaCoords: (payload) => {
		set({ areaCoords: payload });
	},
	setIsOpenModal: (payload) => {
		set({ isOpenModal: payload })
	},
	reset: () => {
		set(initialState);
	}
}));