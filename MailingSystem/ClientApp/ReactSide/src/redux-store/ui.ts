import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

interface IUIState {
    SnackbarsStates: {
        SuccessDefaultIsVisible: boolean;
        RecentMails: {
            SuccessSnackbarIsVisible: boolean;
            ErrorSnackbarIsVisible: boolean;
            InfoSnackbarIsVisible: boolean;
            EditDataTableSuccessSnackbarIsVisible: boolean;
            EditDataTableErrorSnackbarIsVisible: boolean;
            DeleteDataTableErrorSnackbarIsVisible: boolean;
        };
        SendMail: {
            SendMailSuccessSnackbarIsVisible: boolean;
            SendMailErrorSnackbarIsVisible: boolean;
            SendMailInvalidInputsSnackbarIsVisible: boolean;
        };
        Templates: {
            AddTemplateSuccessSnackbarIsVisible: boolean;
            AddTemplateErrorSnackbarIsVisible: boolean;
            EditTemplateErrorSnackbarIsVisible: boolean;
            DeleteTemplateSuccessSnackbarIsVisible: boolean;
            DeleteTemplateErrorSnackbarIsVisible: boolean;
        };
    };
};

const InitialUIState: IUIState = { 
    SnackbarsStates: {
        SuccessDefaultIsVisible: false,
        RecentMails: {
            SuccessSnackbarIsVisible: false,
            ErrorSnackbarIsVisible: false,
            InfoSnackbarIsVisible: false,
            EditDataTableSuccessSnackbarIsVisible: false,
            EditDataTableErrorSnackbarIsVisible: false,
            DeleteDataTableErrorSnackbarIsVisible: false
        },
        SendMail: {
            SendMailSuccessSnackbarIsVisible: false,
            SendMailErrorSnackbarIsVisible: false,
            SendMailInvalidInputsSnackbarIsVisible: false,
        },
        Templates: {
            AddTemplateSuccessSnackbarIsVisible: false,
            AddTemplateErrorSnackbarIsVisible: false,
            EditTemplateErrorSnackbarIsVisible: false,
            DeleteTemplateSuccessSnackbarIsVisible: false,
            DeleteTemplateErrorSnackbarIsVisible: false
        }
    } 
};

const UISlice = createSlice({
	name: 'UIState',
	initialState: InitialUIState,
	reducers: {
        setDefaultSnackbarVisibility (State, Action: PayloadAction<{isVisible: boolean, type: string}>) {
            switch (Action.payload.type) {
                case 'Success':
                    State.SnackbarsStates.SuccessDefaultIsVisible = Action.payload.isVisible;
                    break;
            }
        },
		setRecentMailsSnackbarVisibility (State, Action: PayloadAction<{isVisible: boolean, type: string}>) {
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
        setSendMailSnackbarVisibility (State, Action: PayloadAction<{isVisible: boolean, type: string}>) {
            switch (Action.payload.type) {
                case 'Success':
                    State.SnackbarsStates.SendMail.SendMailSuccessSnackbarIsVisible = Action.payload.isVisible;
                    break;
                case 'Error':
                    State.SnackbarsStates.SendMail.SendMailErrorSnackbarIsVisible = Action.payload.isVisible;
                    break;
                case 'InvalidInput':
                    State.SnackbarsStates.SendMail.SendMailInvalidInputsSnackbarIsVisible = Action.payload.isVisible;
                    break;
            }
        },
        setTemplatesSnackbarVisibility (State, Action: PayloadAction<{isVisible: boolean, type: string}>) {
            switch (Action.payload.type) {
                case 'AddSuccess':
                    State.SnackbarsStates.Templates.AddTemplateSuccessSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
                case 'AddError':
                    State.SnackbarsStates.Templates.AddTemplateErrorSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
                case 'EditError':
                    State.SnackbarsStates.Templates.EditTemplateErrorSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
                case 'DeleteSuccess':
                    State.SnackbarsStates.Templates.DeleteTemplateSuccessSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
                case 'DeleteError':
                    State.SnackbarsStates.Templates.DeleteTemplateErrorSnackbarIsVisible = 
                        Action.payload.isVisible;
                    break;
            }
        }
	}
});

export const UIActions = UISlice.actions;

export default UISlice.reducer;