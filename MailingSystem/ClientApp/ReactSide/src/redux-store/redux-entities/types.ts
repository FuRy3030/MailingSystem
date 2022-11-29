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

export interface MailBuilder {
    Recipients: Array<string>;
    Topic: string;
    Content: string;
};