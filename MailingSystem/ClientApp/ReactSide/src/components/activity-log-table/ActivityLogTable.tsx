import { faCalendarDays, faTimeline } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../hooks/Hooks';
import styles from './ActivityLogTable.module.css';

import ActivityLogTableRow from './ActivityLogTableRow';

function ActivityLogTable() {
    const CampaignLogs = useAppSelector((state) => state.ActivityHistory.CampaignLogs);
    const MailLogs = useAppSelector((state) => state.ActivityHistory.MailLogs);
    const TemplateLogs = useAppSelector((state) => state.ActivityHistory.TemplateLogs);

    const ActivityLogHistoryTransformed: any[] = [...CampaignLogs, ...MailLogs, ...TemplateLogs];

    ActivityLogHistoryTransformed.sort((x, y) => 
        new Date(y.ActivityTime).getTime() - new Date(x.ActivityTime).getTime()
    );

    let TableDetailsCountText = "0 Działań";

    switch (ActivityLogHistoryTransformed.length) {
        case 1:
            TableDetailsCountText = `${ActivityLogHistoryTransformed.length} Działanie`;
            break;
        case 2:
            TableDetailsCountText = `${ActivityLogHistoryTransformed.length} Działania`;
            break;
        case 3:
            TableDetailsCountText = `${ActivityLogHistoryTransformed.length} Działania`;
            break;
        case 4:
            TableDetailsCountText = `${ActivityLogHistoryTransformed.length} Działania`;
            break;
        default:
            TableDetailsCountText = `${ActivityLogHistoryTransformed.length} Działań`;
            break;
    }

    return (
        <div className={styles.TableWrapper}>
            <div className={styles.TableDetails}>
                <span><FontAwesomeIcon icon={faCalendarDays}/> Ostatni Miesiąc</span>
                <span>{TableDetailsCountText} <FontAwesomeIcon icon={faTimeline}/></span>
            </div>
            <div className={styles.TableHeader}>
                <span>Członek Organizacji</span>
                <span>Element</span>
                <span>Nazwa</span>
                <span>Rodzaj Operacji</span>
                <span>Data</span>
            </div>
            {ActivityLogHistoryTransformed.map((Log: any) => {
                return <ActivityLogTableRow Log={Log} key={Log.Id} />
            })}
        </div>
    );
};

export default ActivityLogTable;