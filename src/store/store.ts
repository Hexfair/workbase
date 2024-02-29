// import { create } from 'zustand'
// import { ICoordinate } from '../@types/ICoordinate.interface'

// type StateStore = {
// 	notamCoords: ICoordinate[][][]
// 	tuna: number
// }

// type ActionsStore = {
// 	addSalmon: (qty: number) => void
// 	addTuna: (qty: number) => void
// 	reset: () => void
// }

// const initialState: StateStore = {
// 	salmon: 0,
// 	tuna: 0,
// }

// // create store
// const useSlice = create<StateStore & ActionsStore>()((set, get) => ({
// 	...initialState,
// 	addSalmon: (qty: number) => {
// 		set({ salmon: get().salmon + qty })
// 	},
// 	addTuna: (qty: number) => {
// 		set({ tuna: get().tuna + qty })
// 	},
// 	reset: () => {
// 		set(initialState)
// 	},
// }))