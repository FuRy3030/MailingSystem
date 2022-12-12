import { useAppDispatch, useAppSelector } from "../hooks/Hooks";

import { faGears, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DividerHorizontal } from "../components/divider/Divider";
import MailsDataTableSelection from "../components/mails-data-table/MailsDataTableForSelection";
import MailRecipientBox from "../components/mail-recipient-box/MailRecipientBox";
import MailSendForm from "../components/mail-send-form/MailSendForm";
import AdjustableSnackbar from "../components/snackbars/AdjustableSnackbar";
import React, { useRef } from "react";
import { UIActions } from "../redux-store/ui";
import ConfigureMailCampaign from "../components/configure-mail-campaign/ConfigureMailCampaign";


function SendMail() {
    const MailFormRef = useRef<HTMLDivElement | null>(null);
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    const Dispatch = useAppDispatch();
    
    const IsSuccessSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.SendMail.SendMailSuccessSnackbarIsVisible
    });
    const IsErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.SendMail.SendMailErrorSnackbarIsVisible
    });
    const IsInvalidInputSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.SendMail.SendMailInvalidInputsSnackbarIsVisible
    });

    const updateIsSnackbarSuccessVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setSendMailSnackbarVisibility({type: 'Success', isVisible: isVisible}));
    };

    const updateIsSnackbarErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setSendMailSnackbarVisibility({type: 'Error', isVisible: isVisible}));
    };

    const updateIsSnackbarInvalidInputVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setSendMailSnackbarVisibility({type: 'InvalidInput', isVisible: isVisible}));
    };

    const ScrollIntoViewMailForm = () => {
        if (MailFormRef.current) {
            MailFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }
    };

    return (
        <React.Fragment>
            <div style={{paddingTop: `${DrawerHeight}px`}}>
                <div className="SubPageContent">
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faGears} />
                        Konfiguruj Kampanię
                    </h1>
                    <p className="paragraphText">
                        Na początku musisz zdefiniować podstawowe informacje dotyczące kampani takie jak ilość follow-up'ów czy jej nazwa. 
                    </p>
                    <DividerHorizontal />
                    <ConfigureMailCampaign />
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faUserPlus} />
                        Dodaj Adresatów
                    </h1>
                    <p className="paragraphText">
                        Aby dodać adresy e-mail do pola z adresatami zaznacz na poniższej liście wszystkie wiersze spełniające twoje wymagania. Adresy e-mail z wymienionych rzędów zostaną automatycznie przeniesione do pola adresatów.
                    </p>
                    <DividerHorizontal />
                    <MailRecipientBox ScrollIntoViewMailForm={ScrollIntoViewMailForm} />
                    <MailsDataTableSelection />
                    <MailSendForm ref={MailFormRef} />
                </div>
            </div>
            <AdjustableSnackbar type={'success'} title={'Pomyślnie wysłano maila'} isOpen={IsSuccessSnackbarVisible}
                content={'Twój mail został pomyślnie wysłany do wybranych przez ciebie odbiorców.'} 
                updateStateInStore={updateIsSnackbarSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Nie udało się wysłać maila!'} isOpen={IsErrorSnackbarVisible}
                content={'Z powodu błędu operacja nie powiodła się. Sprawdź czy twój mail nie przekracza limitów i spróbuj ponownie.'} 
                updateStateInStore={updateIsSnackbarErrorVisible} />
            <AdjustableSnackbar type={'error'} title={'Nie uzupełniono wszystkich pól!'} isOpen={IsInvalidInputSnackbarVisible}
                content={`Niektóre z wymaganych pól nie zostały w pełni wypełnione. Sprawdź czy nazwa kampanii lub data follow'upu została poprawnie uzupełniona i spróbuj ponownie.`} 
                updateStateInStore={updateIsSnackbarInvalidInputVisible} />
        </React.Fragment>
    )
};

export default SendMail;