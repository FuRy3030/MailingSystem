import styles from './Subpages.module.css';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/Hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DividerHorizontal } from '../components/divider/Divider';
import { faEnvelopeCircleCheck, faGears } from '@fortawesome/free-solid-svg-icons';
import ExtractorConfigurationForm from '../components/auto-check-forms/ExtractorConfigurationForm';
import ExtractedMailsDataTable from '../components/mails-data-table/ExtractedMailsDataTable';
import { IExtractedMail } from '../redux-store/redux-entities/types';
import { Button } from 'react-bootstrap';
import AddMailsToDatabaseFromExtractor from '../api/AddMailsToDatabaseFromExtractor';
import { UIActions } from '../redux-store/ui';

function MailsExtractorOption() {
    const [SelectedNewEmails, setSelectedNewEmails] = useState<Array<IExtractedMail>>([]);
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    const Dispatch = useAppDispatch();

    const UpdateSelectedEmails = (SelectedEmails: Array<IExtractedMail>) => {
        setSelectedNewEmails(SelectedEmails);
    };

    const AddNewSelectedMails = async (event: React.SyntheticEvent<HTMLButtonElement>) => {
        Dispatch(UIActions.setDefaultSnackbarVisibility({
            type: 'Success', 
            isVisible: false
        }));
        
        Dispatch(UIActions.setDefaultSnackbarVisibility({
            type: 'Error', 
            isVisible: false
        }));

        const IsAPIResultSuccessful: boolean = await AddMailsToDatabaseFromExtractor(SelectedNewEmails);

        if (IsAPIResultSuccessful == true) {
            Dispatch(UIActions.setDefaultSnackbarVisibility({
                type: 'Success', 
                isVisible: true
            }));
        }
        else {
            Dispatch(UIActions.setDefaultSnackbarVisibility({
                type: 'Error', 
                isVisible: true
            }));
        }
    };
    
    return (
        <React.Fragment>
            <div style={{paddingTop: `${DrawerHeight}px` }}>
                <div className="SubPageContent">
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faGears} />
                        Konfiguracja Źródła
                    </h1>
                    <p className="paragraphText">
                        Przed zebraniem adresów e-mail z wybranego przez Ciebie źródła musisz jedynie skonfigurować ile i jakiego typu adresy powinny być ekstraktowane. Następnie musisz jedynie zatwierdzić swój wybór i poczekać na wyniki.
                    </p>
                    <DividerHorizontal />
                    <ExtractorConfigurationForm />
                    <ExtractedMailsDataTable UpdateSelectedNewEmails={UpdateSelectedEmails} />
                    <Button variant="primary" className={`site-button ${styles.BigSiteButton}`}
                        onClick={AddNewSelectedMails}>
                        Dodaj Adresy E-mail <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MailsExtractorOption;