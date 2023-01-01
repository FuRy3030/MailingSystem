import styles from './Subpages.module.css';

import React from 'react';
import { useAppSelector } from '../hooks/Hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DividerHorizontal } from '../components/divider/Divider';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import ExtractorConfigurationForm from '../components/auto-check-forms/ExtractorConfigurationForm';

function MailsExtractorOption() {
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    
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
                </div>
            </div>
        </React.Fragment>
    );
};

export default MailsExtractorOption;