import { create } from 'zustand';
import { ActionsStore, StateStore } from './types';

const initialState: StateStore = {
	activeTab: 'notams',
	notamCoords: [],
	fligthCoords: [],
	firCoords: null,
	areaCoords: { name: '', area: [] }
};

export const useStore = create<StateStore & ActionsStore>()((set, get) => ({
	...initialState,
	setActiveTab: (payload) => {
		set({ activeTab: payload });
	},
	setNotamCoords: (payload) => {
		const prevNotamCoords = get().notamCoords;
		set({ notamCoords: [...prevNotamCoords, ...payload] });
	},
	setFligthCoords: (payload) => {
		const prevFlightCoords = get().fligthCoords;
		set({ fligthCoords: [...prevFlightCoords, ...payload] });
	},
	deleteFligthCoord: (payload) => {
		set({ fligthCoords: get().fligthCoords.filter(obj => obj[0] !== payload.lat && obj[1] !== payload.lng) });
	},
	setFirCoords: (payload) => {
		set({ firCoords: payload });
	},
	setAreaCoords: (payload) => {
		set({ areaCoords: payload });
	},

	reset: () => {
		set(initialState);
	}
}));