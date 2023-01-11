import styles from './DashboardHeader.module.css';

import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@mui/material';
import { useAppSelector } from '../../hooks/Hooks';

function ActivityLogDashboardHeader() {
    const UserData: any = useAppSelector((state) => state.ActivityHistory.TeamStatistics
        .filter((TeamStatistic) => {
            return TeamStatistic.Identifier == state.ActivityHistory.ActiveUserSelected;
        }).map((TeamStatistic) => {
            return {
                UserMailCount: TeamStatistic.MailCount,
                PictureURL: TeamStatistic.PictureURL,
                Name: TeamStatistic.Identifier
            };
        })[0]
    );

    let MailPolishWordForm = '';

    if (UserData.UserMailCount == 1) {
        MailPolishWordForm = 'mail';
    }
    else if (UserData.UserMailCount >= 2 && UserData.UserMailCount < 5) {
        MailPolishWordForm = 'maile';
    }
    else {
        MailPolishWordForm = 'maili';
    }

    return (
        <div className={`${styles.DashboardHeader} ${styles.DashboardHeaderActivity}`}>
            <h2 className={styles.DashboardHeaderWelcome}>
                <span>{UserData.Name}</span> idzie jak burza i się nie zatrzymuje!
            </h2>
            <div className='neon-effect'>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
            </div>
            <h2 className={styles.DashboardHeaderMailsMonth}>
                W tym miesiącu udało się jemu/jej wysłać już <span>{UserData.UserMailCount}</span> {MailPolishWordForm} do innych organizacji.
            </h2>
            <Avatar alt="Avatar" src={`${UserData.PictureURL}`} className={styles.Avatar} />
        </div>
    );
};

export default ActivityLogDashboardHeader;