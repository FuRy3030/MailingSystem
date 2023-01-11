import styles from './DashboardHeader.module.css';

import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../hooks/Hooks';
import React from 'react';

function ActivityLogDashboardHeaderAlt() {
    const TeamStatistics = useAppSelector((state) => state.ActivityHistory.TeamStatistics[0]);
    let MailPolishWordForm = '';

    if (TeamStatistics != undefined && TeamStatistics.MailCount == 1) {
        MailPolishWordForm = 'mail';
    }
    else if (TeamStatistics != undefined && TeamStatistics.MailCount >= 2 && TeamStatistics.MailCount < 5) {
        MailPolishWordForm = 'maile';
    }
    else {
        MailPolishWordForm = 'maili';
    }

    return (
        <React.Fragment>
            {(typeof TeamStatistics != 'undefined') ? 
                <div className={`${styles.DashboardHeader} ${styles.DashboardHeaderActivity}`}>
                    <h2 className={styles.DashboardHeaderWelcome}>
                        <span>Szkolna Giełda Pracy</span> utrzymuje genialne tempo jako cały zespół!
                    </h2>
                    <div className='neon-effect'>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
                    </div>
                    <h2 className={styles.DashboardHeaderMailsMonth}>
                        W tym miesiącu udało nam się już wysłać <span>{TeamStatistics.MailCount}</span> {MailPolishWordForm}.
                    </h2>
                    <img alt="Logo" src='/Logo.svg' className={styles.Logo} />
                </div> 
                :
                <></>
            }
        </React.Fragment>
    );
};

export default ActivityLogDashboardHeaderAlt;