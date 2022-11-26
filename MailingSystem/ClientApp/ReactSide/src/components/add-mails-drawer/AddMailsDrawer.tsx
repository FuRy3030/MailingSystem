import styles from './AddMailsDrawer.module.css';
import { MeasurementsActions } from '../../redux-store/html-measurements';
import { UIActions } from '../../redux-store/ui';

import Button from 'react-bootstrap/Button';
import AdditionInput from '../addition-input/AdditionInput';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin, faChevronCircleDown, faEye } from "@fortawesome/free-solid-svg-icons";
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { IRecentEmail } from '../../redux-store/redux-entities/types';
import { List } from '../../types/data-structures';

import { useContext } from "react";
import AuthContext from "../../context-store/auth-context";
import Config from '../../config/config';
import React from 'react';
import NewMailsResultsBox from '../new-mails-results-box/NewMailsResultsBox';

type MailsDrawerProps = {};

const AddMailsDrawer = React.forwardRef<HTMLDivElement, MailsDrawerProps>(({}, MailsDrawerContentRefExternal) => {
    const MailsDrawerContentRef = useRef<HTMLDivElement | null>(null);
    const MailsDrawerRef = useRef<HTMLDivElement | null>(null);
    const EmailsInputRef = useRef<HTMLInputElement | null>(null);

    const Dispatch = useAppDispatch();
    const NavigationBarHeight = useAppSelector((state) => state.Measurements.NavigationBarHeight);

    const [stateOfResultsBox, setStateOfResultsBox] = useState('notEvoked');
    const [emailsString, setEmailsString] = useState('');
    const [ValidatedEmails, setValidatedEmails] = useState({
        NewUniqueEmails: new List<IRecentEmail>([]),
        RepeatedEmails: new List<IRecentEmail>([])
    });

    const Ctx = useContext(AuthContext);

    useEffect(() => {
        let isApplied: boolean = false;

        if (MailsDrawerRef.current && !isApplied) {
            const Height = MailsDrawerRef.current.offsetHeight;
            Dispatch(MeasurementsActions.setAddMailsDrawerHeight(Height));
        };

        return () => {
            isApplied = true;
        }
    }, []);

    const HandleScroll: (event: any) => void = (event) => {
        if (MailsDrawerContentRef != null) {
            if (MailsDrawerContentRef.current) {
                const ContentHeight = MailsDrawerContentRef.current.offsetHeight;       
                const CurrentPosition = window.scrollY;

                if (CurrentPosition <= ContentHeight && MailsDrawerRef.current) {
                    MailsDrawerRef.current.style.marginTop = `-${CurrentPosition}px`;
                }
                else if (MailsDrawerRef.current) {
                    MailsDrawerRef.current.style.marginTop = `-${ContentHeight}px`;
                }
            }
        };
    };

    useEffect(() => {
        window.addEventListener('scroll', HandleScroll);

        return () => {
            window.removeEventListener('scroll', HandleScroll);
        }
    }, []);

    const updateEmailsString = (EmailsString: string) => {
        setEmailsString(EmailsString);
    };

    const AddEmailsHandleClick = () => {
        setStateOfResultsBox('loading');

        try {
            if (EmailsInputRef.current) {
                EmailsInputRef.current.value = "";
            };

            Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                type: 'Success', 
                isVisible: false
            }));

            Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                type: 'Error', 
                isVisible: false
            }));

            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Ctx?.accessToken.token}` 
                },
                body: JSON.stringify({
                    Emails: emailsString,
                    AccessToken: Ctx?.accessToken.token
                })
            };

            fetch(`${Config.sourceURL}/Mails/add`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                        type: 'Success', 
                        isVisible: true
                    }));

                    console.log(data);
                    const ValidatedEmailsResponse = {
                        NewUniqueEmails: new List<IRecentEmail>(data.NewMails),
                        RepeatedEmails: new List<IRecentEmail>(data.MailsRepeated),
                    };
                    console.log(ValidatedEmailsResponse.NewUniqueEmails);
                    setValidatedEmails(ValidatedEmailsResponse);
                    setStateOfResultsBox('success');

                }).catch((err) => {
                    console.log('aaa');
                    setStateOfResultsBox('error');
                    Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                        type: 'Error', 
                        isVisible: true
                    }));
                });

            setEmailsString('');
        }
        catch (err) {
            setStateOfResultsBox('error');
            Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                type: 'Error', 
                isVisible: true
            }));
        }
    };

    return (
        <div className={styles.Drawer} ref={MailsDrawerRef} style={{top: `${NavigationBarHeight}px`}}>
            <div ref={(refObj: any) => {
                (MailsDrawerContentRef as MutableRefObject<HTMLDivElement>).current = refObj;
                if (typeof MailsDrawerContentRefExternal === 'function') {
                    MailsDrawerContentRefExternal(refObj);
                } 
                else if (MailsDrawerContentRefExternal) {
                    MailsDrawerContentRefExternal.current = refObj;
                }
            }}>
                <h2 className={styles.DrawerHeader}>Dodaj Maile</h2>
                <p className={styles.DrawerSubHeader}>
                    Wszystkie zebrane przes siebie maile wklej poniżej, aby zsynchronizować je z istniejącą listą i otrzymać nowy zestaw maili sprawdzony pod kątem powtórzeń. 
                    <span style={{color: '#2563eb', fontWeight: '800'}}>Zbiór maili powinien powielać poniższy schemat: aczarnocki@caritasaw.pl, rebecca.thomlinson@sddirect.org.uk, acted.polska@acted.org.</span>
                </p>
            </div>
            <div className='flexHorizontal'>
                <AdditionInput updateEmailsString={updateEmailsString} ref={EmailsInputRef} />
                <Button variant="primary" className={`site-button ${styles.DrawerSyncButton}`}
                    onClick={AddEmailsHandleClick}>
                    Synchronizuj <FontAwesomeIcon icon={faArrowsSpin} />
                </Button>
            </div>
            {stateOfResultsBox == 'notEvoked' ? <React.Fragment></React.Fragment> : 
            <Accordion className={styles.DrawerAccordion}>
                <AccordionSummary className={styles.DrawerAccordionHeader} 
                    expandIcon={<FontAwesomeIcon icon={faChevronCircleDown} style={{color: '#2563eb'}} />}>
                    <FontAwesomeIcon icon={faEye} className={styles.DrawerAccordionIcon} />
                    <span className={styles.DrawerAccordionHeaderText}>
                        Wyświetl / Schowaj Wyniki Ostatniej Synchronizacji
                    </span>
                </AccordionSummary>
                <AccordionDetails>
                    <NewMailsResultsBox NewUniqueEmails={ValidatedEmails.NewUniqueEmails}
                        RepeatedEmails={ValidatedEmails.RepeatedEmails} ResultsState={stateOfResultsBox} />
                </AccordionDetails>
            </Accordion>}
        </div>
    )
});

export default AddMailsDrawer;