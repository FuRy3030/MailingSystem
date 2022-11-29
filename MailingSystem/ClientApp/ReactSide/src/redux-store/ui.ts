import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

interface IUIState {
    SnackbarsStates: {
        RecentMails: {
            SuccessSnackbarIsVisible: boolean;
            ErrorSnackbarIsVisible: boolean;
            InfoSnackbarIsVisible: boolean;
            EditDataTableSuccessSnackbarIsVisible: boolean;
            EditDataTableErrorSnackbarIsVisible: boolean;
            DeleteDataTableErrorSnackbarIsVisible: boolean;
        }
    };
};

const InitialUIState: IUIState = { 
    SnackbarsStates: {
        RecentMails: {
            SuccessSnackbarIsVisible: false,
            ErrorSnackbarIsVisible: false,
            InfoSnackbarIsVisible: false,
            EditDataTableSuccessSnackbarIsVisible: false,
            EditDataTableErrorSnackbarIsVisible: false,
            DeleteDataTableErrorSnackbarIsVisible: false
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
                case 'DataTableSuccess':
                    State.SnackbarsStates.RecentMails.EditDataTableSuccessSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
                case 'DataTableError':
                    State.SnackbarsStates.RecentMails.EditDataTableErrorSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
                case 'DataTableErrorDelete':
                    State.SnackbarsStates.RecentMails.DeleteDataTableErrorSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
            }
		},
	}
});

export const UIActions = UISlice.actions;

export default UISlice.reducer;