import { createSlice, PayloadAction  } from '@reduxjs/toolkit';
import { 
    IActivityHistory, 
    ICampaignActivityLog, 
    IMailActivityLog, 
    ITemplateActivityLog 
} from './redux-entities/types';

const InitialHistoryState: IActivityHistory = { 
    CampaignLogs: new Array<ICampaignActivityLog>,
    MailLogs: new Array<IMailActivityLog>,
    TemplateLogs: new Array<ITemplateActivityLog>
};

const ActivityHistorySlice = createSlice({
	name: 'ActivityHistory',
	initialState: InitialHistoryState,
	reducers: {
		UpdateActivityHistory(State, Action: PayloadAction<IActivityHistory>) {
            State.CampaignLogs = [...Action.payload.CampaignLogs];
            State.MailLogs = [...Action.payload.MailLogs];
            State.TemplateLogs = [...Action.payload.TemplateLogs];
        }
	}
});

export const ActivityHistoryActions = ActivityHistorySlice.actions;

export default ActivityHistorySlice.reducer;