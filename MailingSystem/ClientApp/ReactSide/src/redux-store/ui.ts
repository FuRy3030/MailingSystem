import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

interface IUIState {
    SnackbarsStates: {
        RecentMails: {
            SuccessSnackbarIsVisible: boolean;
            ErrorSnackbarIsVisible: boolean;
            InfoSnackbarIsVisible: boolean;
        }
    };
};

const InitialUIState: IUIState = { 
    SnackbarsStates: {
        RecentMails: {
            SuccessSnackbarIsVisible: false,
            ErrorSnackbarIsVisible: false,
            InfoSnackbarIsVisible: false
        }
    } 
};

const UISlice = createSlice({
	name: 'UIState',
	initialState: InitialUIState,
	reducers: {
		setRecentMailsSnackbarVisibility(State, Action: PayloadAction<{isVisible: boolean, type: string}>) {
            switch (Action.payload.type) {
                case 'Success':
                    State.SnackbarsStates.RecentMails.SuccessSnackbarIsVisible = Action.payload.isVisible;
                    break;
                case 'Error':
                    State.SnackbarsStates.RecentMails.ErrorSnackbarIsVisible = Action.payload.isVisible;
                    break;
                case 'Info':
                    State.SnackbarsStates.RecentMails.InfoSnackbarIsVisible = Action.payload.isVisible;
                    break;
            }
		},
	}
});

export const UIActions = UISlice.actions;

export default UISlice.reducer;