import { create } from 'zustand';
import { ActionsStore, StateStore } from './types';

const initialState: StateStore = {
    activeTab: 'notams',
    notamCoords: [],
    fligthCoords: [],
    firCoords: null,
    basesCoords: [],
    missilesCoords: [],
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
    setBaseCoords: (payload) => {
        const prevBasesCoords = get().basesCoords;
        set({ basesCoords: [...prevBasesCoords, payload] });
    },
    setBases: (payload) => {
        set({ basesCoords: payload });
    },
    deleteBaseCoord: (payload) => {
        set({ basesCoords: get().basesCoords.filter(obj => obj.ident !== payload) });
    },
    setMissileCoords: (payload) => {
        const prevMissilesCoords = get().missilesCoords;
        set({ missilesCoords: [...prevMissilesCoords, payload] });
    },
    setMissiles: (payload) => {
        set({ missilesCoords: payload });
    },
    deleteMissileCoord: (payload) => {
        set({ missilesCoords: get().missilesCoords.filter(obj => obj.ident !== payload) });
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
