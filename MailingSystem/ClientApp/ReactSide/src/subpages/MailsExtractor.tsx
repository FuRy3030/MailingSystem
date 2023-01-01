import styles from './Subpages.module.css';

import React from 'react';
import { useAppSelector } from '../hooks/Hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DividerHorizontal } from '../components/divider/Divider';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import BigAutoCompleteExtractor from '../components/autocompletes/BigAutoCompleteExtractor';
import { SourceOption } from '../components/autocompletes/BigAutoCompleteExtractor';
import { useNavigate } from 'react-router-dom';

function MailsExtractor() {
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    const Navigate = useNavigate();

    const HandleMailExtractorOption = (ChosenOption: SourceOption) => {
        Navigate(`/mails/web-extractor/${ChosenOption.EnumValue}`);
    };
    
    return (
        <React.Fragment>
            <div style={{paddingTop: `${DrawerHeight}px` }}>
                <div className="SubPageContent">
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faFileArrowDown} />
                        Automatyczne Zbieranie Adresów E-mail
                    </h1>
                    <p className="paragraphText">
                        Poniżej możesz wybrać z jakiego portalu chcesz automatycznie zebrać poszczególne dane między innymi adresy e-mail. Następnie będziesz mógł / mogła zdecydować, które adresy e-mail odpowiadają twoim potrzebom i warto je włączyć do istniejącej bazy danych. To narzędzie wspiera także automatyczne sprawdzanie danych pod kątem potencjalnych powtórzeń. Uwaga! Narzędzie jest podatne na błędy pochodzące z zewnątrz (innych stron).
                    </p>
                    <DividerHorizontal />
                    <BigAutoCompleteExtractor HandleExternalChangeEvent={HandleMailExtractorOption} />
                    <img alt='ekstrakcja maili' src='/images/mail-extractor.jpg' className={styles.FullPageIMG}/>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MailsExtractor;