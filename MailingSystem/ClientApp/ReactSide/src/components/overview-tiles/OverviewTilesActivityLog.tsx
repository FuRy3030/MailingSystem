import styles from './OverviewTiles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../hooks/Hooks';
import { faChevronDown, faEnvelopesBulk, faLink, faReply } from '@fortawesome/free-solid-svg-icons';
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { OverviewTileComponent } from './OverviewTiles';

const OverviewTileColor = [
    {
        BackgroundColor: '#D8F6FF',
        IconBackground: '#99E7FF',
        Color: '#00AEE5',
        Text: 'Kampanie',
        Icon: faEnvelopesBulk
    },
    {
        BackgroundColor: '#D5F8EF',
        IconBackground: '#A8F0DE',
        Color: '#14B789',
        Text: 'Otwarcia',
        Icon: faEnvelopeOpen
    },
    {
        BackgroundColor: '#FFE5F4',
        IconBackground: '#FFADDD',
        Color: '#E50087',
        Text: 'Kliknięcia',
        Icon: faLink
    },
    {
        BackgroundColor: '#E8E2F7',
        IconBackground: '#CCBFED',
        Color: '#802FDE',
        Text: 'Odpowiedzi',
        Icon: faReply
    }
];

function OverviewTilesActivityLog() {
    const Statistics = useAppSelector((state) => state.ActivityHistory.TeamStatistics
        .filter((TeamStatistic) => {
            return TeamStatistic.Identifier == state.ActivityHistory.ActiveUserSelected;
        })[0]
    );

    type ObjectKey = keyof typeof Statistics.TrackingStatistics;
    const Keys: ObjectKey[] = [];

    Object.keys(Statistics.TrackingStatistics).forEach((key: string) => {
        Keys.push(key as ObjectKey);
    });

    return (
        <div className={styles.OverviewTiles} style={{width: '100%'}}>
            <h2 className={styles.OverviewTilesHeader}>
                Pogląd Danych
                <span className={styles.OverviewTilesHeaderAdditionSmall}>
                    Ostatni Miesiąc <FontAwesomeIcon icon={faChevronDown} />
                </span>
            </h2>
            <div className={styles.OverviewTilesActivityLog}>
                {Keys.map((key: ObjectKey, index: number) => {
                    return <OverviewTileComponent 
                        key={index}
                        Value={Statistics.TrackingStatistics[key]}
                        BackgroundColor={OverviewTileColor[index].BackgroundColor}
                        IconBackground={OverviewTileColor[index].IconBackground}
                        Color={OverviewTileColor[index].Color}
                        Text={OverviewTileColor[index].Text}
                        Icon={OverviewTileColor[index].Icon}
                        isFullSize={true}
                        Class={styles.OverviewTileActivityLog}
                    />
                })}
            </div>
        </div>
    );
};

export default OverviewTilesActivityLog;