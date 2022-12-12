import styles from './TemplatePicker.module.css';

import { faPenRuler, faSquareUpRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmptyNotification from '../empty-space-notification/EmptyNotification';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TemplatePicker() {
    const Navigate = useNavigate();

    const NavigateToTemplates = () => {
        Navigate('/mails/templates');
    };

    return (
        <div className={styles.TemplatePicker}>
            <div className={styles.TemplatePickerDescription}>
                <FontAwesomeIcon icon={faPenRuler} className={styles.TemplatePickerDescriptionIcon} />
                <span className={styles.TemplateTextBig}>
                    Twoje Szablony
                </span>
                <span className={styles.TemplateTextSmall}>
                    Wybierz interesujący cię szablon z listy aby zastosować go do treści maila
                </span>
            </div>
            <div className={styles.PartWhenEmpty}>
                <div className='margin-auto' style={{width: '65%'}}>
                    <EmptyNotification />
                    <Button variant="primary" className={`site-button ${styles.NavigateToTemplatesButton}`}
                        onClick={NavigateToTemplates}>
                        Utwórz Nowy Szablon <FontAwesomeIcon icon={faSquareUpRight} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TemplatePicker;