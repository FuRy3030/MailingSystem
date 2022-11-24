import { createSlice, PayloadAction, createAsyncThunk  } from '@reduxjs/toolkit';
import { List } from '../types/data-structures';
import { IRecentEmail } from './redux-entities/types';
import Config from '../config/config';

export const GetRecentMails = createAsyncThunk(
    'GetRecentMails',
    async (Token: string) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Token}` },
        };
        fetch(`${Config.sourceURL}/Auth/googleverification?Token=` + Token, requestOptions)
            .then(response => response.json())
            .then(data => {
                return data;
            });
    }
)

interface IMailsData {
    RecentMails: List<IRecentEmail> | void;
    HTTPStates: {
        GetRecentMails: {
            isLoading: boolean;
            Error: boolean;
        };
    };
};

const InitialMailsState: IMailsData = { 
    RecentMails: new List<IRecentEmail>(),
    HTTPStates: {
        GetRecentMails: {
            isLoading: false,
            Error: false
        }
    }
};

const MailsSlice = createSlice({
	name: 'MailsData',
	initialState: InitialMailsState,
	reducers: {
		
	},
    extraReducers: (builder) => {
        builder.addCase(GetRecentMails.pending, (state) => {
            state.HTTPStates.GetRecentMails.isLoading = true;
            state.HTTPStates.GetRecentMails.Error = false;
        });

        builder.addCase(GetRecentMails.fulfilled, (state, action) => {
            state.HTTPStates.GetRecentMails.isLoading = false;
            state.HTTPStates.GetRecentMails.Error = false;
            state.RecentMails = action.payload;
        });

        builder.addCase(GetRecentMails.rejected, (state) => {
            state.HTTPStates.GetRecentMails.isLoading = false;
            state.HTTPStates.GetRecentMails.Error = true;
        });
    }
});

export const MailsActions = MailsSlice.actions;

export default MailsSlice.reducer;