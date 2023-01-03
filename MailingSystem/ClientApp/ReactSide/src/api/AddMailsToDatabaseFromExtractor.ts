import { useContext } from "react";
import Config from "../config/config";
import AuthContext from "../context-store/auth-context";
import { useAppDispatch } from "../hooks/Hooks";
import { MailsActions } from "../redux-store/mail-data";
import { IExtractedMail, IRecentEmail } from "../redux-store/redux-entities/types";

const moment = require('moment-timezone');

const AddMailsToDatabaseFromExtractor = async (NewSelectedMails: Array<IExtractedMail>) => {
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();

    try {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${Ctx?.accessToken.token}` 
            },
            body: JSON.stringify({
                NewExtractedEmails: NewSelectedMails.map((NewSelectedMail: IExtractedMail) => { 
                    return {
                        MailAddress: NewSelectedMail.MailAddress,
                        CompanyName: NewSelectedMail.CompanyName
                    }}),
                AccessToken: Ctx?.accessToken.token
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

            NewMails.forEach(Email => {
                Dispatch(MailsActions.AddRecentMail(Email));
            });

            return true;
        }
        else {
            return false;
        }
    }
    catch {
        return false;
    }
};

export default AddMailsToDatabaseFromExtractor;
