import { faCalendarDays, faEnvelope, faEnvelopeOpenText, faEnvelopesBulk, faGrip, faTimeline, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/Hooks';
import EmptyNotification from '../empty-space-notification/EmptyNotification';
import styles from './ActivityLogTable.module.css';

import ActivityLogTableRow from './ActivityLogTableRow';

function TransformDateStringToISOString(DateString: string) {
    const Time = DateString.substring(0, 8);
    const Day = DateString.substring(9, 11);
    const Month = DateString.substring(12, 14);
    const Year = DateString.substring(15);

    return Year + '-' + Month + '-' + Day + 'T' + Time;
};

function ActivityLogTable() {
    const [ActiveFilter, setActiveFilter] = useState<number>(3);
    const ActiveUser = useAppSelector((state) => state.ActivityHistory.ActiveUserSelected);
    const CampaignLogs = useAppSelector((state) => state.ActivityHistory.ActivityHistory.CampaignLogs);
    const MailLogs = useAppSelector((state) => state.ActivityHistory.ActivityHistory.MailLogs);
    const TemplateLogs = useAppSelector((state) => state.ActivityHistory.ActivityHistory.TemplateLogs);

    let ActivityLogHistoryTransformed: any[] = [...CampaignLogs, ...MailLogs, ...TemplateLogs];

    if (ActiveUser != 'Wszyscy') {
        ActivityLogHistoryTransformed = ActivityLogHistoryTransformed.filter((Log: any) => {
            return Log.UserRealName === ActiveUser && (ActiveFilter == 3 ? true : Log.LogType == ActiveFilter);
        });
    }
    else {
        ActivityLogHistoryTransformed = ActivityLogHistoryTransformed.filter((Log: any) => {
            return ActiveFilter == 3 ? true : Log.LogType == ActiveFilter;
        });
    }

    const ActivityLogHistorySorted = ActivityLogHistoryTransformed.sort((x, y) => {
        return new Date(TransformDateStringToISOString(y.ActivityTime)).getTime() - 
            new Date(TransformDateStringToISOString(x.ActivityTime)).getTime();
    });

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
    };

    const Filters: {Name: string, Icon: IconDefinition} [] = [
        {
            Name: 'Wszystkie',
            Icon: faGrip
        },
        {
            Name: 'Kampanie',
            Icon: faEnvelopesBulk
        },
        {
            Name: 'Maile',
            Icon: faEnvelope
        },
        {
            Name: 'Szablony',
            Icon: faEnvelopeOpenText
        }
    ];

    const UpdateFilters = (event: React.SyntheticEvent<HTMLSpanElement>) => {
        if (event.currentTarget.dataset.index) {
            const ActiveFilterIndex = parseInt(event.currentTarget.dataset.index);

            if (ActiveFilterIndex == 0) {
                setActiveFilter(3);
            }
            else {
                setActiveFilter(parseInt(event.currentTarget.dataset.index) - 1);
            }
        }
    };

    return (
        <div className={styles.TableWrapper}>
            <div className={styles.TableDetails}>
                <span><FontAwesomeIcon icon={faCalendarDays}/> Ostatni Miesiąc</span>
                {Filters.map((Filter, index: number) => {
                    return <span 
                        key={index} 
                        data-index={index} 
                        className={(ActiveFilter == index - 1 || index == 0 && ActiveFilter == 3) ? 
                            `${styles.TableDetailsOption} ${styles.TableDetailsOptionActive}` : 
                            `${styles.TableDetailsOption}`} 
                        onClick={UpdateFilters}
                        >
                        <FontAwesomeIcon icon={Filter.Icon} />
                        {Filter.Name}
                    </span>
                })}
                <span>{TableDetailsCountText} <FontAwesomeIcon icon={faTimeline}/></span>
            </div>
            <div className={styles.TableHeader}>
                <span>Członek Organizacji</span>
                <span>Element</span>
                <span>Nazwa</span>
                <span>Rodzaj Operacji</span>
                <span>Data</span>
            </div>
            {ActivityLogHistorySorted.map((Log: any) => {
                return <ActivityLogTableRow Log={Log} key={Log.Id} />
            })}
            {ActivityLogHistorySorted.length == 0 && <EmptyNotification IsSmallerVersion MarginTop={'9.5vh'} />}
        </div>
    );
};

export default ActivityLogTable;