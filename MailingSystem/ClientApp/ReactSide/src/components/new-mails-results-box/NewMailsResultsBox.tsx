import styles from './NewMailsResultsBox.module.css';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Chip } from '@mui/material';
import Button from 'react-bootstrap/Button';
import Skeleton from '@mui/material/Skeleton';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck, faClone } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { IRecentEmail } from '../../redux-store/redux-entities/types';
import { useAppDispatch } from '../../hooks/Hooks';
import React from 'react';
import { UIActions } from '../../redux-store/ui';

function NewMailsResultsBox(props: any) {
    const Dispatch = useAppDispatch();

    const CopyEmailsHandler = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        let emailsString: string = '';

        props.NewUniqueEmails.Items.forEach((Item: IRecentEmail) => {
            emailsString = emailsString + Item.MailAddress + ', ';
        });
        emailsString = emailsString.substring(0, emailsString.length - 2);

        navigator.clipboard.writeText(emailsString);

        Dispatch(UIActions.setRecentMailsSnackbarVisibility({
            type: 'Info', 
            isVisible: true
        }));
    }

    switch(props.ResultsState) {
        case 'loading':
            return (
                <div style={{marginTop: '2.5vh'}}>
                    <Skeleton variant="rounded" width={'100%'} height={'10vh'} />
                    <Skeleton variant="text" sx={{ fontSize: '1.65vw' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.05vw' }} />
                </div>
            );
        case 'error':
            return (
                <div className={styles.Box}>
                    <Alert severity="error" className={styles.BoxAlert}>
                        <AlertTitle className={styles.BoxAlertTitle}>
                            Synchronizacja Nie Powiodła Się
                        </AlertTitle>
                        Z powodu napotkanego błędu twoje żądanie nie mogło być zrealizowane.
                        Sprawdź czy twoja lista adresów e-mail spełnia pożądany format i spróbuj ponownie.
                    </Alert>
                </div>
            );
        case 'success':
            return (
                <div className={styles.Box}>
                    <Alert severity="success" className={styles.BoxAlert}>
                        <AlertTitle className={styles.BoxAlertTitle}>
                            Synchronizacja Przebiegła Pomyślnie
                        </AlertTitle>
                        Maile zostały zsynchronizowane z całą bazą i sprawdzone pod kątem duplikatów.
                        Poniżej znajdują się nowe, unikalne adresy e-mail, które czekają na skopiowanie.
                    </Alert>
                    {props.RepeatedEmails.Size() > 0 ?
                    <React.Fragment>
                        <span className={styles.BoxMailsSpaceHeader}>Istniejące adresy email:</span>
                        <div className={styles.BoxMailsSpace}> 
                            {props.RepeatedEmails.Items.map((email: IRecentEmail, index: number) => {
                                return <Chip variant="outlined" color="error" label={email.MailAddress} 
                                    icon = {<FontAwesomeIcon icon={faClone} />} key={index} 
                                    className={styles.BoxMailsChip} />
                            })}
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment></React.Fragment>}
                    {props.NewUniqueEmails.Size() > 0 ? 
                    <React.Fragment>
                        <span className={styles.BoxMailsSpaceHeader}>Nowe adresy email:</span>
                        <div className={styles.BoxMailsSpace}> 
                            {props.NewUniqueEmails.Items.map((email: IRecentEmail, index: number) => {
                                return <Chip variant="outlined" color="success" label={email.MailAddress} 
                                    icon = {<FontAwesomeIcon icon={faEnvelopeCircleCheck} />} key={index}
                                    className={styles.BoxMailsChip} />
                            })}
                        </div>        
                        <Button variant="primary" className={`site-button ${styles.BoxMailsCopyButton}`}
                            onClick={CopyEmailsHandler}>
                            Kopiuj Maile Do Schowka <FontAwesomeIcon icon={faClipboard} />
                        </Button> 
                    </React.Fragment>
                    : 
                    <React.Fragment></React.Fragment>}
                </div>
            );
        default:
            return <React.Fragment></React.Fragment>
    }
};

export default NewMailsResultsBox;