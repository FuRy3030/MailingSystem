import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Config from '../config/config';
import { IUserConfiguration } from './redux-entities/types';

export const GetSettings = createAsyncThunk(
    'settings/getusersettings',
    async (Token: string) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Token}` },
            };

            const Response = await fetch(`${Config.sourceURL}/Configuration/getsettings?Token=${Token}`, requestOptions);

            if (Response.ok) {
                const ParsedResponse = await Response.json();

                const FormattedResponse = {
                    UserMailsSettings: {
                        GMassAPIKey: ParsedResponse.UserMailSettings.GMassAPIKey,
                        RecipientsSheetId: ParsedResponse.UserMailSettings.RecipientsSheetId,
                        AfterHowManyWeeksRemindersAppear: ParsedResponse.UserMailSettings.AfterHowManyWeeksRemindersAppear
                    }
                }
                
                return FormattedResponse as IUserConfiguration;
            }
            else {
                return {
                    UserMailsSettings: {
                        GMassAPIKey: '',
                        RecipientsSheetId: '',
                        AfterHowManyWeeksRemindersAppear: 0
                    }
                } as IUserConfiguration;
            }
        }
        catch {
            return {
                UserMailsSettings: {
                    GMassAPIKey: '',
                    RecipientsSheetId: '',
                    AfterHowManyWeeksRemindersAppear: 0
                }
            } as IUserConfiguration;
        }
    }
);

interface IUserConfigState {
    UserConfiguration: IUserConfiguration;
    HTTPStates: {
        GetSettings: {
            isLoading: boolean;
            Error: boolean;
        };
    };
};

const InitialUserConfigState: IUserConfigState = { 
    UserConfiguration: {
        UserMailsSettings: {
            GMassAPIKey: 'NotLoaded',
            RecipientsSheetId: 'NotLoaded',
            AfterHowManyWeeksRemindersAppear: 0
        }
    },
    HTTPStates: {
        GetSettings: {
            isLoading: false,
            Error: false
        }
    }
};

const UserConfigSlice = createSlice({
	name: 'UserConfig',
	initialState: InitialUserConfigState,
	reducers: {
		
	},
    extraReducers: (builder) => {
        builder.addCase(GetSettings.pending, (state) => {
            state.HTTPStates.GetSettings.isLoading = true;
            state.HTTPStates.GetSettings.Error = false;
        });

        builder.addCase(GetSettings.fulfilled, (state, action) => {
            state.HTTPStates.GetSettings.isLoading = false;
            state.HTTPStates.GetSettings.Error = false;
            console.log(action.payload);
            state.UserConfiguration = action.payload;
        });

        builder.addCase(GetSettings.rejected, (state) => {
            state.HTTPStates.GetSettings.isLoading = false;
            state.HTTPStates.GetSettings.Error = true;
        });
    }
});

export const ConfigurationActions = UserConfigSlice.actions;

export default UserConfigSlice.reducer;