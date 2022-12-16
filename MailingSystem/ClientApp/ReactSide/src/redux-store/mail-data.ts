import { createSlice, PayloadAction, createAsyncThunk  } from '@reduxjs/toolkit';
import { 
    IRecentEmail, 
    IMailBuilder, 
    IMailAggregateStatistics, 
    IMailStatisticsBasic, 
    IMailStatisticsEngaged, 
    IMailStatisticsSmallActivity, 
    IOverview,
    ISuggestedMail,
    IChartData
} from './redux-entities/types';
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
);

export const GetMailsStatistics = createAsyncThunk(
    'mails/getmailstatistics',
    async (Token: string) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Token}` },
            };

            const Response = await fetch(`${Config.sourceURL}/Reminders/getmailstatistics?Token=${Token}`, requestOptions);

            if (Response.ok) {
                const ParsedResponse = await Response.json();

                const MailsWithStatistics = ParsedResponse.MailsWithStatisticsBasic.map((Mail: any, index: number) => {
                    return { 
                        id: index, 
                        NumberOfEmailsSent: Mail.NumberOfEmailsSent, 
                        MailAddress: Mail.MailAddress,
                        HasReplied: Mail.HasReplied,
                        HasOpenedCampaign: Mail.HasOpenedCampaign,
                        HasClickedLink: Mail.HasClickedLink,
                        DateOfLastEmailSent: moment.utc(Mail.DateOfLastEmailSent)
                            .local().format('YYYY-MM-DD HH:mm:ss')
                    }
                });

                const MailsWithStatisticsSmallActivity = ParsedResponse.MailsWithStatisticsSmallActivity.map((Mail: any, index: number) => {
                    return { 
                        id: index, 
                        NumberOfEmailsSent: Mail.NumberOfEmailsSent, 
                        MailAddress: Mail.MailAddress,
                        HasOpenedCampaign: Mail.HasOpenedCampaign,
                        DateOfLastOpen: moment.utc(Mail.DateOfLastOpen)
                            .local().format('YYYY-MM-DD HH:mm:ss')
                    }
                });

                const MailsWithStatisticsEngaged = ParsedResponse.MailsWithStatisticsEngaged.map((Mail: any, index: number) => {
                    return { 
                        id: index, 
                        NumberOfEmailsSent: Mail.NumberOfEmailsSent, 
                        MailAddress: Mail.MailAddress,
                        HasReplied: Mail.HasReplied,
                        HasClickedLink: Mail.HasClickedLink,
                        DateOfLastClick: moment.utc(Mail.DateOfLastClick)
                            .local().format('YYYY-MM-DD HH:mm:ss'),
                        DateOfLastReply: moment.utc(Mail.DateOfLastReply)
                            .local().format('YYYY-MM-DD HH:mm:ss')
                    }
                });

                const FormattedResponse = {
                    MailsWithStatistics: MailsWithStatistics,
                    MailsWithStatisticsEngaged: MailsWithStatisticsEngaged,
                    MailsWithStatisticsSmallActivity: MailsWithStatisticsSmallActivity
                };
                
                return FormattedResponse as IMailAggregateStatistics;
            }
            else {
                return {
                    MailsWithStatistics: new Array<IMailStatisticsBasic>(),
                    MailsWithStatisticsEngaged: new Array<IMailStatisticsEngaged>(),
                    MailsWithStatisticsSmallActivity: new Array<IMailStatisticsSmallActivity>()
                } as IMailAggregateStatistics;
            }
        }
        catch {
            return {
                MailsWithStatistics: new Array<IMailStatisticsBasic>(),
                MailsWithStatisticsEngaged: new Array<IMailStatisticsEngaged>(),
                MailsWithStatisticsSmallActivity: new Array<IMailStatisticsSmallActivity>()
            } as IMailAggregateStatistics;
        }
    }
);

export const GetOverview = createAsyncThunk(
    'overview/getoverview',
    async (Token: string) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Token}` },
            };

            const Response = await fetch(`${Config.sourceURL}/Dashboard/getoverview?Token=${Token}`, requestOptions);

            if (Response.ok) {
                const ParsedResponse = await Response.json();

                const SuggestedMails = ParsedResponse.SuggestedMails.map((RecentMail: any, index: number) => {
                    return { 
                        id: index, 
                        MailAddress: RecentMail.MailAddress,
                        NumberOfEmailsSent: RecentMail.NumberOfEmailsSent,
                        DateOfLastEmailSent: moment.utc(RecentMail.DateOfLastEmailSent)
                            .local().format('YYYY-MM-DD HH:mm:ss')
                    }
                });

                const FormattedResponse = {
                    SuggestedMails: SuggestedMails,
                    UserStatistics:
                    {
                        UniqueUserCampaigns: ParsedResponse.UserStatistics.UniqueUserCampaigns,
                        UniqueUserOpens: ParsedResponse.UserStatistics.UniqueUserOpens,
                        UniqueUserClicks: ParsedResponse.UserStatistics.UniqueUserClicks,
                        UniqueUserReplies: ParsedResponse.UserStatistics.UniqueUserReplies
                    },
                    UserMailsChartData: ParsedResponse.UserMailsChartData,
                    TeamStatistics:
                    {
                        UniqueCampaigns: ParsedResponse.TeamStatistics.UniqueCampaigns,
                        UniqueOpens: ParsedResponse.TeamStatistics.UniqueOpens,
                        UniqueClicks: ParsedResponse.TeamStatistics.UniqueClicks,
                        UniqueReplies: ParsedResponse.TeamStatistics.UniqueReplies
                    },
                    TeamMailsChartData: ParsedResponse.TeamMailsChartData,
                    UserMailCount: ParsedResponse.UserMailCount,
                    TeamMailCount: ParsedResponse.TeamMailCount
                };
                
                return FormattedResponse as IOverview;
            }
            else {
                return {
                    SuggestedMails: new Array<ISuggestedMail>(),
                    UserStatistics:
                    {
                        UniqueUserCampaigns: 0,
                        UniqueUserOpens: 0,
                        UniqueUserClicks: 0,
                        UniqueUserReplies: 0
                    },
                    UserMailsChartData: new Array<IChartData>(),
                    TeamStatistics:
                    {
                        UniqueCampaigns: 0,
                        UniqueOpens: 0,
                        UniqueClicks: 0,
                        UniqueReplies: 0
                    },
                    TeamMailsChartData: new Array<IChartData>(),
                    UserMailCount: 0,
                    TeamMailCount: 0
                } as IOverview;
            }
        }
        catch {
            return {
                SuggestedMails: new Array<ISuggestedMail>(),
                UserStatistics:
                {
                    UniqueUserCampaigns: 0,
                    UniqueUserOpens: 0,
                    UniqueUserClicks: 0,
                    UniqueUserReplies: 0
                },
                UserMailsChartData: new Array<IChartData>(),
                TeamStatistics:
                {
                    UniqueCampaigns: 0,
                    UniqueOpens: 0,
                    UniqueClicks: 0,
                    UniqueReplies: 0
                },
                TeamMailsChartData: new Array<IChartData>(),
                UserMailCount: 0,
                TeamMailCount: 0
            } as IOverview;
        }
    }
);

interface IMailsData {
    Overview: IOverview;
    MailBuilder: IMailBuilder;
    RecentMails: Array<IRecentEmail>;
    MailStatistics: IMailAggregateStatistics;
    HTTPStates: {
        GetRecentMails: {
            isLoading: boolean;
            Error: boolean;
        };
        GetMailsStatistics: {
            isLoading: boolean;
            Error: boolean;
        };
        GetOverview: {
            isLoading: boolean;
            Error: boolean;
        };
    };
    CurrentCampaignConiguration: {
        Name: string;
        FollowUps: number;
    };
};

const InitialMailsState: IMailsData = { 
    Overview: {
        SuggestedMails: [],
        UserStatistics: {
            UniqueUserCampaigns: 0,
            UniqueUserOpens: 0,
            UniqueUserClicks: 0,
            UniqueUserReplies: 0
        },
        UserMailsChartData: [],
        TeamStatistics:
        {
            UniqueCampaigns: 0,
            UniqueOpens: 0,
            UniqueClicks: 0,
            UniqueReplies: 0
        },
        TeamMailsChartData: [],
        UserMailCount: 0,
        TeamMailCount: 0
    },
    MailBuilder: {
        Recipients: [],
        Topic: '',
        Content: ''
    },
    RecentMails: new Array<IRecentEmail>(),
    MailStatistics: {
        MailsWithStatistics: new Array<IMailStatisticsBasic>(),
        MailsWithStatisticsEngaged: new Array<IMailStatisticsEngaged>(),
        MailsWithStatisticsSmallActivity: new Array<IMailStatisticsSmallActivity>()
    },
    HTTPStates: {
        GetRecentMails: {
            isLoading: false,
            Error: false
        },
        GetMailsStatistics: {
            isLoading: false,
            Error: false
        },
        GetOverview: {
            isLoading: false,
            Error: false
        }
    },
    CurrentCampaignConiguration: {
        Name: '',
        FollowUps: 0
    },
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
        },
        UpdateMailTitle(State, Action: PayloadAction<string>) {
            State.MailBuilder.Topic = Action.payload;
        },
        UpdateMailContent(State, Action: PayloadAction<string>) {
            State.MailBuilder.Content = Action.payload;
        },
        ClearMailContent(State) {
            State.MailBuilder.Recipients = [];
            State.MailBuilder.Content = '';
            State.MailBuilder.Topic = '';
            State.CurrentCampaignConiguration.Name = '';
            State.CurrentCampaignConiguration.FollowUps = 0;
        },
        UpdateCampaignName(State, Action: PayloadAction<string>) {
            State.CurrentCampaignConiguration.Name = Action.payload;
        },
        UpdateCampaignFollowUpsNumber(State, Action: PayloadAction<number>) {
            State.CurrentCampaignConiguration.FollowUps = Action.payload;
        },
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

        builder.addCase(GetMailsStatistics.pending, (state) => {
            state.HTTPStates.GetMailsStatistics.isLoading = true;
            state.HTTPStates.GetMailsStatistics.Error = false;
        });

        builder.addCase(GetMailsStatistics.fulfilled, (state, action) => {
            state.HTTPStates.GetMailsStatistics.isLoading = false;
            state.HTTPStates.GetMailsStatistics.Error = false;
            console.log(action);
            state.MailStatistics = action.payload;
        });

        builder.addCase(GetMailsStatistics.rejected, (state) => {
            state.HTTPStates.GetMailsStatistics.isLoading = false;
            state.HTTPStates.GetMailsStatistics.Error = true;
        });

        builder.addCase(GetOverview.pending, (state) => {
            state.HTTPStates.GetOverview.isLoading = true;
            state.HTTPStates.GetOverview.Error = false;
        });

        builder.addCase(GetOverview.fulfilled, (state, action) => {
            state.HTTPStates.GetOverview.isLoading = false;
            state.HTTPStates.GetOverview.Error = false;
            console.log(action);
            state.Overview = action.payload;
        });

        builder.addCase(GetOverview.rejected, (state) => {
            state.HTTPStates.GetOverview.isLoading = false;
            state.HTTPStates.GetOverview.Error = true;
        });
    }
});

export const MailsActions = MailsSlice.actions;

export default MailsSlice.reducer;