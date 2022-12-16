export interface IRecentEmail {
    id: number,
    MailId: number;
    MailAddress: string;
    OrganizationName: string | null;
    UserWhoAdded: string;
    UserVerificatiorName: string;
    NumberOfEmailsSent: number;
    DateOfLastEmailSent: string;
};

export interface IMailBuilder {
    Recipients: Array<string>;
    Topic: string;
    Content: string;
};

export interface ITemplateBuilder {
    Name: string;
    Type: number;
    Topic: string;
    Content: string;
};

export interface IUserTemplate {
    TemplateId: number;
    OwnerEmail: string;
    Name: string;
    Type: number;
    Topic: string;
    Content: string;
    CreationDate: string;
    TimePassedInDays: number;
};

export interface IUserTemplateForEdit {
    TemplateId: number;
    Name: string;
    Type: number;
    Topic: string;
    Content: string;
};

export interface IMailStatisticsBasic {
    id: number;
    MailAddress: string;
    NumberOfEmailsSent: number;
    DateOfLastEmailSent: string;
    HasReplied: boolean;
    HasOpenedCampaign: boolean;
    HasClickedLink: boolean;
};

export interface IMailStatisticsEngaged {
    id: number;
    MailAddress: string;
    NumberOfEmailsSent: number;
    HasOpenedCampaign: boolean;
    DateOfLastOpen: string | null;
};

export interface IMailStatisticsSmallActivity {
    id: number;
    MailAddress: string;
    NumberOfEmailsSent: number;
    HasReplied: boolean;
    HasClickedLink: boolean;
    DateOfLastClick: string | null;
    DateOfLastReply: string | null;
};

export interface IMailAggregateStatistics {
    MailsWithStatistics: Array<IMailStatisticsBasic>;
    MailsWithStatisticsEngaged: Array<IMailStatisticsEngaged>;
    MailsWithStatisticsSmallActivity: Array<IMailStatisticsSmallActivity>;
};

export interface ISuggestedMail {
    id: number;
    MailAddress: string;
    NumberOfEmailsSent: number;
    DateOfLastEmailSent: string;
};

export interface IChartData {
    Value: number;
    DateLabel: string;
};

export interface IOverview {
    SuggestedMails: Array<ISuggestedMail>;
    UserStatistics: {
        UniqueUserCampaigns: number;
        UniqueUserOpens: number;
        UniqueUserClicks: number;
        UniqueUserReplies: number;
    };
    UserMailsChartData: Array<IChartData>;
    TeamStatistics: {
        UniqueCampaigns: number;
        UniqueOpens: number;
        UniqueClicks: number;
        UniqueReplies: number;
    };
    TeamMailsChartData: Array<IChartData>;
    UserMailCount: number;
    TeamMailCount: number;
};

export interface SettingsMailsForm {
    GMassAPIKey: string;
};

export interface SettingsMailsFormErrors {
    GMassAPIKey: string;
};

export interface IUserConfiguration {
    UserMailsSettings: {
        GMassAPIKey: string;
    };
};