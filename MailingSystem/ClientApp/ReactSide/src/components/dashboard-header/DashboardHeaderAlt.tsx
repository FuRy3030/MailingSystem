import styles from './DashboardHeader.module.css';

import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context-store/auth-context';
import { useContext } from 'react';
import { useAppSelector } from '../../hooks/Hooks';

function DashboardHeaderAlt() {
    const TeamMailCount = useAppSelector((state) => state.Mails.Overview.TeamMailCount);
    let MailPolishWordForm = '';

    if (TeamMailCount == 1) {
        MailPolishWordForm = 'mail';
    }
    else if (TeamMailCount >= 2 && TeamMailCount < 5) {
        MailPolishWordForm = 'maile';
    }
    else {
        MailPolishWordForm = 'maili';
    }

    return (
        <div className={styles.DashboardHeader} style={{margin: '4.75vh 0px'}}>
            <h2 className={styles.DashboardHeaderWelcome}>
                Szkolna Giełda Pracy
            </h2>
            <div className='neon-effect'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
            </div>
            <h2 className={styles.DashboardHeaderMailsMonth}>
                W tym miesiącu udało nam się już wysłać <span>{TeamMailCount}</span> {MailPolishWordForm}.
            </h2>
            <img alt="Logo" src='/Logo.svg' className={styles.Logo} />
        </div>
    );
};

export default DashboardHeaderAlt;