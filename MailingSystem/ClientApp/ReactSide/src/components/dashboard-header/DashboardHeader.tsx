import styles from './DashboardHeader.module.css';

import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import AuthContext from '../../context-store/auth-context';
import { useContext } from 'react';
import { useAppSelector } from '../../hooks/Hooks';
import jwt_decode from 'jwt-decode';

interface IWebsiteUser {
    aud: string;
    Id: string;
    email: string;
    exp: number;
    given_name: string;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    unique_name: string;
};

function DashboardHeader() {
    const UserMailCount = useAppSelector((state) => state.Mails.Overview.UserMailCount);
    const Ctx = useContext(AuthContext);

    let MailPolishWordForm = '';
    let Name: string = '';
    const AccessToken: string | null = sessionStorage.getItem('accessToken');

    if (AccessToken != null) {
        const TokenObj = JSON.parse(AccessToken);
        const WebsiteUser: IWebsiteUser = jwt_decode(TokenObj.token);
        var { given_name } = WebsiteUser;
        Name = given_name.substring(0, given_name.indexOf(' '));
    }

    if (UserMailCount == 1) {
        MailPolishWordForm = 'mail';
    }
    else if (UserMailCount >= 2 && UserMailCount < 5) {
        MailPolishWordForm = 'maile';
    }
    else {
        MailPolishWordForm = 'maili';
    }

    return (
        <div className={styles.DashboardHeader}>
            <h2 className={styles.DashboardHeaderWelcome}>
                Witaj z powrotem {Name}
            </h2>
            <div className='neon-effect'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
            </div>
            <h2 className={styles.DashboardHeaderMailsMonth}>
                W tym miesiącu udało Ci się już wysłać <span>{UserMailCount}</span> {MailPolishWordForm}.
            </h2>
            <Avatar alt="Avatar" src={`${Ctx?.pictureSource}`} className={styles.Avatar} />
        </div>
    );
};

export default DashboardHeader;