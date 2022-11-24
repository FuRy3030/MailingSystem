import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

interface IMeasurementsState {
    NavigationBarHeight: number;
    AddMailsDrawerHeight: number;
};

const InitialMeasurementsState: IMeasurementsState = { 
    NavigationBarHeight: 0, AddMailsDrawerHeight: 0 
};

const MeasurementsSlice = createSlice({
	name: 'HTMLMeasurements',
	initialState: InitialMeasurementsState,
	reducers: {
		setNavigationBarHeight(State, Action: PayloadAction<number>) {
			State.NavigationBarHeight = Action.payload;
		},
		setAddMailsDrawerHeight(State, Action: PayloadAction<number>) {
			State.AddMailsDrawerHeight = Action.payload;
		}
	}
});

export const MeasurementsActions = MeasurementsSlice.actions;

export default MeasurementsSlice.reducer;