import { createSlice, PayloadAction, createAsyncThunk  } from '@reduxjs/toolkit';
import { IRecentEmail, MailBuilder } from './redux-entities/types';
import Config from '../config/config';

const moment = require('moment-timezone');

export const GetRecentMails = createAsyncThunk(
    'mails/getallrecent',
    async (Token: string) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Token}` },
            };

            const Response = await fetch(`${Config.sourceURL}/Mails/getallrecent`, requestOptions);

            if (Response.ok) {
                const ParsedResponse = await Response.json();

                const RecentMails = ParsedResponse.map((RecentMail: any, index: number) => {
                    return { 
                        id: index, 
                        MailId: RecentMail.MailId, 
                        MailAddress: RecentMail.MailAddress,
                        OrganizationName: RecentMail.OrganizationName,
                        UserWhoAdded: RecentMail.UserWhoAdded,
                        UserVerificatiorName: RecentMail.UserVerificatiorName,
                        NumberOfEmailsSent: RecentMail.NumberOfEmailsSent,
                        DateOfLastEmailSent: moment.utc(RecentMail.DateOfLastEmailSent)
                            .local().format('YYYY-MM-DD HH:mm:ss')
                    }
                });

                console.log(RecentMails);
                
                return RecentMails as Array<IRecentEmail>;
            }
            else {
                return new Array<IRecentEmail>;
            }
        }
        catch {
            return new Array<IRecentEmail>;
        }
    }
)

interface IMailsData {
    MailBuilder: MailBuilder;
    RecentMails: Array<IRecentEmail>;
    HTTPStates: {
        GetRecentMails: {
            isLoading: boolean;
            Error: boolean;
        };
    };
};

const InitialMailsState: IMailsData = { 
    MailBuilder: {
        Recipients: [],
        Topic: '',
        Content: ''
    },
    RecentMails: new Array<IRecentEmail>(),
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
		AddRecentMail(State, Action: PayloadAction<IRecentEmail>) {
			State.RecentMails = [Action.payload, ...State.RecentMails];
		},
        EditRecentMail(State, Action: PayloadAction<IRecentEmail>) {
            const CurrentMailsArray: IRecentEmail[] = State.RecentMails;
            const CurrentMail = Action.payload;

            CurrentMail.DateOfLastEmailSent = moment.utc(CurrentMail.DateOfLastEmailSent)
                .local().format('YYYY-MM-DD HH:mm:ss');
            const ElementIndex: number = CurrentMailsArray.findIndex(Mail => 
                Mail.MailId == Action.payload.MailId);

            CurrentMailsArray[ElementIndex] = Action.payload;
			State.RecentMails = [...CurrentMailsArray];
		},
        DeleteRecentEmail(State, Action: PayloadAction<number>) {
			const CurrentMailsArray: IRecentEmail[] = State.RecentMails;
            const CurrentMail = Action.payload;

            const ElementIndex: number = CurrentMailsArray.findIndex(Mail => 
                Mail.MailId == Action.payload);

            CurrentMailsArray.splice(ElementIndex, 1);
            State.RecentMails = [...CurrentMailsArray];    
		},
        UpdateRecipients(State, Action: PayloadAction<string[]>) {
            State.MailBuilder.Recipients = [...Action.payload];
        }
	},
    extraReducers: (builder) => {
        builder.addCase(GetRecentMails.pending, (state) => {
            state.HTTPStates.GetRecentMails.isLoading = true;
            state.HTTPStates.GetRecentMails.Error = false;
        });

        builder.addCase(GetRecentMails.fulfilled, (state, action) => {
            state.HTTPStates.GetRecentMails.isLoading = false;
            state.HTTPStates.GetRecentMails.Error = false;
            console.log(action);
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