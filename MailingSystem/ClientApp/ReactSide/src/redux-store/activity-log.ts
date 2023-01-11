import { createSlice, PayloadAction  } from '@reduxjs/toolkit';
import { 
    IActivityHistory, 
    ICampaignActivityLog, 
    IMailActivityLog, 
    ITemplateActivityLog,
    IAggregateStatisticsInstance
} from './redux-entities/types';

interface ActivityLogState {
    ActivityHistory: IActivityHistory;
    TeamStatistics: Array<IAggregateStatisticsInstance>;
    ActiveUserSelected: string;
}

const InitialHistoryState: ActivityLogState = { 
    ActivityHistory: {
        CampaignLogs: new Array<ICampaignActivityLog>,
        MailLogs: new Array<IMailActivityLog>,
        TemplateLogs: new Array<ITemplateActivityLog>
    },
    TeamStatistics: new Array<IAggregateStatisticsInstance>,
    ActiveUserSelected: 'Wszyscy'
};

const ActivityHistorySlice = createSlice({
	name: 'ActivityHistory',
	initialState: InitialHistoryState,
	reducers: {
		UpdateActivityHistory(State, Action: PayloadAction<IActivityHistory>) {
            State.ActivityHistory.CampaignLogs = [...Action.payload.CampaignLogs];
            State.ActivityHistory.MailLogs = [...Action.payload.MailLogs];
            State.ActivityHistory.TemplateLogs = [...Action.payload.TemplateLogs];
        },
        UpdateStatistics(State, Action: PayloadAction<Array<IAggregateStatisticsInstance>>) {
            State.TeamStatistics = [...Action.payload];
        },
        UpdateActiveUser(State, Action: PayloadAction<string>) {
            State.ActiveUserSelected = Action.payload;
        }
	}
});

export const ActivityHistoryActions = ActivityHistorySlice.actions;

export default ActivityHistorySlice.reducer;