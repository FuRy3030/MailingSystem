import { useAppDispatch } from '../../hooks/Hooks';
import { MailsActions } from '../../redux-store/mail-data';
import styles from './TemplateShortcut.module.css';

function TemplateShortcutSmall(props: any) {
    const Dispatch = useAppDispatch();
    
    let TemplateType: string = '';
    let PlainText: string = props.Content;
    PlainText = PlainText.replace(/<style([\s\S]*?)<\/style>/gi, '');
    PlainText = PlainText.replace(/<script([\s\S]*?)<\/script>/gi, '');
    PlainText = PlainText.replace(/<\/div>/ig, '\n');
    PlainText = PlainText.replace(/<\/li>/ig, '\n');
    PlainText = PlainText.replace(/<li>/ig, '  *  ');
    PlainText = PlainText.replace(/<\/ul>/ig, '\n');
    PlainText = PlainText.replace(/<\/p>/ig, '\n');
    PlainText = PlainText.replace(/<br\s*[\/]?>/gi, "\n");
    PlainText = PlainText.replace(/<[^>]+>/ig, '');
    PlainText = PlainText.replace(/&[^;]+;/ig, ' ');

    const FormattedName: string = props.Name.length > 21 ? 
        (props.Name.substring(0, 22) + '...') : props.Name;
    const FormattedTopic: string = props.Topic.length > 36 ? 
        (props.Topic.substring(0, 37) + '...') : props.Topic;
    const FormattedContent: string = PlainText.length > 367 ? 
        (PlainText.substring(0, 368) + '...') : PlainText;

    switch (props.Type) {
        case 0:
            TemplateType = 'Uniwersalny';
            break;
        case 1:
            TemplateType = 'Zwykły';
            break;
        case 2:
            TemplateType = 'FollowUp';
            break;
    };

    const SetTemplateContent = () => {
        Dispatch(MailsActions.UpdateMailTitle(props.Topic));
        Dispatch(MailsActions.UpdateMailContent(props.Content));
    };

    return (
        <div className={styles.CarouselLayout}>
            <div className={styles.CarouselLayoutMargin}>
                <div className={`${styles.TemplateShortcutSmall} ${styles.TemplateShortcut}`} onClick={SetTemplateContent}>
                    <img src="/images/card-img.jpg" alt="Template image" className={styles.TemplateShortcutIMG} />
                    <span className={styles.TemplateShortcutTimePassed}>
                        {props.TimePassedInDays != 1 ? props.TimePassedInDays != 0 ? 
                        `Utworzono ${props.TimePassedInDays} Dni Temu` : 
                        `Utworzono Dzisiaj` : 
                        `Utworzono Wczoraj`}
                    </span>
                    <span className={styles.TemplateShortcutName}>{FormattedName}</span>
                    <span className={styles.TemplateShortcutTopic}>{FormattedTopic}</span>
                    <p className={styles.TemplateShortcutContent}>{FormattedContent}</p>
                    <span className={styles.TemplateShortcutType}>{TemplateType}</span>
                </div>
            </div>
        </div>
    );
};

export default TemplateShortcutSmall;