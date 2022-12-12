import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Config from '../../config/config';
import AuthContext from '../../context-store/auth-context';
import { useAppDispatch } from '../../hooks/Hooks';
import { TemplatesActions } from '../../redux-store/templates-data';
import { UIActions } from '../../redux-store/ui';
import styles from './TemplateShortcut.module.css';

function TemplateShortcut(props: any) {
    const Navigate = useNavigate();
    const Ctx = useContext(AuthContext);
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

    const FormattedName: string = props.Name.length > 23 ? 
        (props.Name.substring(0, 24) + '...') : props.Name;
    const FormattedTopic: string = props.Topic.length > 41 ? 
        (props.Topic.substring(0, 42) + '...') : props.Topic;
    const FormattedContent: string = PlainText.length > 397 ? 
        (PlainText.substring(0, 398) + '...') : PlainText;

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

    const OnEditClick = () => {
        Navigate(`/mails/templates/edit/${props.TemplateId}`);
    };

    const OnDeleteClick = () => {
        try {
            Dispatch(UIActions.setTemplatesSnackbarVisibility({
                type: 'DeleteSuccess', 
                isVisible: false
            }));

            Dispatch(UIActions.setTemplatesSnackbarVisibility({
                type: 'DeleteError', 
                isVisible: false
            }));

            const requestOptions = {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Ctx?.accessToken.token}` 
                }
            };

            fetch(`${Config.sourceURL}/Templates/delete?Token=${Ctx?.accessToken.token}&TemplateId=${props.TemplateId}`, requestOptions)
                .then(Response => {
                    if (Response.ok && Response.body) {
                        return Response.text();
                    }
                }).then(ResponseText => {
                    if (ResponseText == 'Success') {
                        Dispatch(UIActions.setTemplatesSnackbarVisibility({
                            type: 'DeleteSuccess', 
                            isVisible: true
                        }));

                        Dispatch(TemplatesActions.DeleteTemplate(props.TemplateId));
                    }
                    else {
                        Dispatch(UIActions.setTemplatesSnackbarVisibility({
                            type: 'DeleteError', 
                            isVisible: true
                        }));
                    }
                }).catch(() => {
                    Dispatch(UIActions.setTemplatesSnackbarVisibility({
                        type: 'DeleteError', 
                        isVisible: true
                    }));
                });
        }
        catch {
            Dispatch(UIActions.setTemplatesSnackbarVisibility({
                type: 'DeleteError', 
                isVisible: true
            }));
        }
    };

    return (
        <div className={styles.TemplateShortcut}>
            <img src="/images/card-img.jpg" alt="Template image" className={styles.TemplateShortcutIMG} />
            <span className={styles.TemplateShortcutTimePassed}>
                {props.TimePassed != 1 ? props.TimePassed != 0 ? 
                `Utworzono ${props.TimePassed} Dni Temu` : 
                `Utworzono Dzisiaj` : 
                `Utworzono Wczoraj`}
            </span>
            <span className={styles.TemplateShortcutName}>{FormattedName}</span>
            <span className={styles.TemplateShortcutTopic}>{FormattedTopic}</span>
            <p className={styles.TemplateShortcutContent}>{FormattedContent}</p>
            <div className={styles.TemplateShortcutButtons}>
                <button onClick={OnEditClick}>Edytuj <FontAwesomeIcon icon={faPencil} /></button>
                <button onClick={OnDeleteClick}>Usuń <FontAwesomeIcon icon={faTrashCan} /></button>
            </div>
            <span className={styles.TemplateShortcutType}>{TemplateType}</span>
        </div>
    );
};

export default TemplateShortcut;