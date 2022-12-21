import styles from './Subpages.module.css';

import React from 'react';
import { useAppSelector } from '../hooks/Hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DividerHorizontal } from '../components/divider/Divider';
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import BigAutoComplete from '../components/autocompletes/BigAutoComplete';

function MailsExtractor() {
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    
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
                    <BigAutoComplete />
                    <img alt='ekstrakcja maili' src='/images/mail-extractor.jpg' className={styles.FullPageIMG}/>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MailsExtractor;