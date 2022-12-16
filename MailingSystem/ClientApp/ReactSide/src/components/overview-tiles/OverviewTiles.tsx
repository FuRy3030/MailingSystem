import styles from './OverviewTiles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../hooks/Hooks';
import { faChevronDown, faEnvelopesBulk, faLink, faReply } from '@fortawesome/free-solid-svg-icons';
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';

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

function OverviewTile(props: any) {
    return (
        <div className={!props.isFullSize ? styles.OverviewTile : styles.OverviewTileFullSize} 
            style={{backgroundColor: props.BackgroundColor}}>
            <FontAwesomeIcon className={styles.OverviewTileIcon} icon={props.Icon} 
                style={{backgroundColor: props.IconBackground}} />
            <div className={styles.OverviewTileContent} >
                <span className={styles.OverviewTileNumber} style={{color: props.Color}}>
                    {props.Value}
                </span>
                <span className={styles.OverviewTileText} style={{color: props.Color}}>
                    {props.Text}
                </span>
            </div>
        </div>
    );
};

function OverviewTiles() {
    const SuggestedMails = useAppSelector(state => state.Mails.Overview.SuggestedMails);
    const TilesData = useAppSelector((state) => state.Mails.Overview.UserStatistics);
    type ObjectKey = keyof typeof TilesData;
    const Keys: ObjectKey[] = [];

    Object.keys(TilesData).forEach((key: string) => {
        Keys.push(key as ObjectKey);
    });

    return (
        <div className={styles.OverviewTiles}>
            <h2 className={styles.OverviewTilesHeader}>
                Pogląd Danych
                <span className={styles.OverviewTilesHeaderAdditionSmall}>
                    Ostatni Miesiąc <FontAwesomeIcon icon={faChevronDown} />
                </span>
            </h2>
            {Keys.map((key: ObjectKey, index: number) => {
                return <OverviewTile 
                    key={index}
                    Value={TilesData[key]}
                    BackgroundColor={OverviewTileColor[index].BackgroundColor}
                    IconBackground={OverviewTileColor[index].IconBackground}
                    Color={OverviewTileColor[index].Color}
                    Text={OverviewTileColor[index].Text}
                    Icon={OverviewTileColor[index].Icon}
                    isFullSize={SuggestedMails.length > 2 ? true : false}
                />
            })}
        </div>
    );
};

export default OverviewTiles;