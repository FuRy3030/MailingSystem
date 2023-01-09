import styles from './ActivityLogTable.module.css';

import { Avatar } from '@mui/material';

function ActivityLogTableRow(props: any) {
    let ActivityType: string = 'Nieokreślony';
    let ActivityTypeColor: string = '#62D2A2';
    let LogType: string = 'Mail';

    switch (props.Log.ActivityType) {
        case 0:
            ActivityType = 'Dodanie';
            ActivityTypeColor = '#62D2A2';
            break;
        case 1:
            ActivityType = 'Edycja';
            ActivityTypeColor = '#134ecd';
            break;
        case 2:
            ActivityType = 'Usunięcie';
            ActivityTypeColor = '#DC0000';
            break;
    }

    switch (props.Log.LogType) {
        case 0:
            LogType = 'Kampania';
            break;
        case 1:
            LogType = 'Mail';
            break;
        case 2:
            LogType = 'Szablon';
            break;
    }

    return (
        <div className={styles.TableRow}>
            <div>
                <Avatar alt="Zdjęcie" src={`${props.Log.PictureURL}`} className={styles.TableUserAvatar} />
                <span>{props.Log.UserRealName}</span>
            </div>
            <span>{LogType}</span>
            <span>{props.Log.EntityName}</span>
            <span style={{color: ActivityTypeColor}}>{ActivityType}</span>
            <span>{props.Log.ActivityTime}</span>
        </div>
    );
};

export default ActivityLogTableRow;