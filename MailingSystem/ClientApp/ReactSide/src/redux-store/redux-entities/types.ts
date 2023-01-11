import { Moment } from "moment-timezone";

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
    RecipientsSheetId: string;
    HowManyWeeksAfterMailReadyForReminder: string;
};

export interface SettingsMailsFormErrors {
    GMassAPIKey: string;
    RecipientsSheetId: string;
    HowManyWeeksAfterMailReadyForReminder: string;
};

export interface IUserConfiguration {
    UserMailsSettings: {
        GMassAPIKey: string;
        RecipientsSheetId: string;
        AfterHowManyWeeksRemindersAppear: number;
    };
};

export interface MailExtractorConfigurationForm {
    PageNumber: string;
};

export interface MailExtractorConfigurationFormErrors {
    PageNumber: string;
};

export interface IExtractedMail {
    id: number;
    MailAddress: string;
    CompanyName: string;
    DoesEmailExists: boolean;
};

enum LogType {
    Campaign = 0,
    Mail = 1,
    Template = 2
};

enum ActivityType {
    Add = 0,
    Edit = 1,
    Delete = 2
};

enum TemplateType {
    Universal = 0,
    ForMail = 1,
    ForResponse = 2
};

export interface IMailActivityLog {
    Id: number;
    LogType: LogType;
    PictureURL: string;
    UserRealName: string;
    EntityName: string;
    ActivityType: ActivityType;
    ActivityTime: string;
};

export interface ICampaignActivityLog {
    Id: number;
    LogType: LogType;
    PictureURL: string;
    UserRealName: string;
    EntityName: string;
    ActivityType: ActivityType;
    ActivityTime: string;
    NumberOfFollowUps: number;
    EmailsString: string;
};

export interface ITemplateActivityLog {
    Id: number;
    LogType: LogType;
    PictureURL: string;
    UserRealName: string;
    EntityName: string;
    ActivityType: ActivityType;
    ActivityTime: string;
    Type: TemplateType;
    Topic: string;
    Content: string;
};

export interface IActivityHistory {
    CampaignLogs: Array<ICampaignActivityLog>;
    MailLogs: Array<IMailActivityLog>;
    TemplateLogs: Array<ITemplateActivityLog>;
};

export interface IAggregateStatisticsInstance {
    MailCount: number;
    Identifier: string;
    PictureURL: string;
    ChartData: {
        Value: number;
        DateLabel: string;
    } [];
    TrackingStatistics: {
        UniqueCampaigns: number;
        UniqueOpens: number;
        UniqueClicks: number;
        UniqueReplies: number;
    };
};