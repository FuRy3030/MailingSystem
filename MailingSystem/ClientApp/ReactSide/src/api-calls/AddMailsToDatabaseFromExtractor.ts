import Config from "../config/config";
import { IExtractedMail, IRecentEmail } from "../redux-store/redux-entities/types";

const moment = require('moment-timezone');

const AddMailsToDatabaseFromExtractor = async (NewSelectedMails: Array<IExtractedMail>, Token: string) => {
    const NewExtractedEmailsFormatted = NewSelectedMails.map((NewSelectedMail: IExtractedMail) => { 
        return {
            MailAddress: NewSelectedMail.MailAddress,
            CompanyName: NewSelectedMail.CompanyName
        }
    });

    try {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${Token}` 
            },
            body: JSON.stringify({
                NewExtractedEmails: NewExtractedEmailsFormatted,
                AccessToken: Token
            })
        };

        const Response = await fetch(`${Config.sourceURL}/Mails/addwithcompany`, requestOptions);

        if (Response.ok) {
            const ParsedResponse = await Response.json();

            const NewMails: IRecentEmail[] = ParsedResponse.map(
                (RecentMail: IRecentEmail, index: number) => {
                return { 
                    id: 1000000000 + index, 
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

            return {
                Status: true,
                Mails: NewMails
            };
        }
        else {
            return {
                Status: false,
                Mails: []
            };
        }
    }
    catch {
        return {
            Status: false,
            Mails: []
        };
    }
};

export default AddMailsToDatabaseFromExtractor;
