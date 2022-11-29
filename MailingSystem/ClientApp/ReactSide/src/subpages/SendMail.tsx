import { useAppSelector } from "../hooks/Hooks";

import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DividerHorizontal } from "../components/divider/Divider";
import MailsDataTableSelection from "../components/mails-data-table/MailsDataTableForSelection";
import MailRecipientBox from "../components/mail-recipient-box/MailRecipientBox";


function SendMail() {
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);

    return (
        <div style={{paddingTop: `${DrawerHeight}px`}}>
            <div className="SubPageContent">
                <h1 className="primaryHeader">
                    <FontAwesomeIcon icon={faUserPlus} />
                    Dodaj Adresatów
                </h1>
                <p className="paragraphText">
                    Aby dodać adresy e-mail do pola z adresatami zaznacz na poniższej liście wszystkie wiersze spełniające twoje wymagania. Adresy e-mail z wymienionych rzędów zostaną automatycznie przeniesione do pola adresatów.
                </p>
                <DividerHorizontal />
                <MailRecipientBox />
                <MailsDataTableSelection />
            </div>
        </div>
    )
};

export default SendMail;