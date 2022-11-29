import styles from './MailRecipientBox.module.css';

import EmptyNotification from '../empty-space-notification/EmptyNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { useAppSelector } from '../../hooks/Hooks';
import { Chip } from '@mui/material';
import { Button } from 'react-bootstrap';
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

function MailRecipientBox() {
    const CurrentRecipients: string[] = useAppSelector(state => state.Mails.MailBuilder.Recipients);

    return (
        <div className={styles.MailRecipientBox}>
            <h2 className={styles.Header}>Adresaci</h2>
            <div className={styles.WhiteDivider}></div>
            {CurrentRecipients.length > 0 ?
                <div className={styles.RecipientsList}>
                    <span className={styles.RecipientsListIntro}>Do:</span>
                    {CurrentRecipients.map((Recipient: string, index: number) => {
                        return <Chip 
                            key={index}
                            label={Recipient}
                            variant="outlined" 
                            color="warning" 
                            icon={<FontAwesomeIcon icon={faEnvelopeCircleCheck} />} 
                            className={styles.RecipientChip}
                        />
                    })}
                </div> 
                :
                <div className={styles.PartWhenEmpty}>
                    <div className='margin-auto' style={{width: '25%', marginTop: '2.5vh'}}>
                        <EmptyNotification />
                    </div>
                    <button className={`alt-button ${styles.MailRecipientEmptyBoxButton}`}>
                        Dodaj Adresatów
                        <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                </div>
            }
            {CurrentRecipients.length > 0 ?
                <div className='flexHorizontal' style={{width: '100%'}}>
                    <Button variant="primary" className={`site-button ${styles.RecipientContinueButton}`}
                        onClick={() => {}}>
                        Kontynuuj <FontAwesomeIcon icon={faArrowDownWideShort} />
                    </Button>
                </div>
                :
                <React.Fragment />
            }
        </div>   
    )
};

export default MailRecipientBox;