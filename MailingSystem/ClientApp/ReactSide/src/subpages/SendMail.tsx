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
                        Konfiguruj Kampani??
                    </h1>
                    <p className="paragraphText">
                        Na pocz??tku musisz zdefiniowa?? podstawowe informacje dotycz??ce kampani takie jak ilo???? follow-up'??w czy jej nazwa. 
                    </p>
                    <DividerHorizontal />
                    <ConfigureMailCampaign />
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faUserPlus} />
                        Dodaj Adresat??w
                    </h1>
                    <p className="paragraphText">
                        Aby doda?? adresy e-mail do pola z adresatami zaznacz na poni??szej li??cie wszystkie wiersze spe??niaj??ce twoje wymagania. Adresy e-mail z wymienionych rz??d??w zostan?? automatycznie przeniesione do pola adresat??w.
                    </p>
                    <DividerHorizontal />
                    <MailRecipientBox ScrollIntoViewMailForm={ScrollIntoViewMailForm} />
                    <MailsDataTableSelection />
                    <MailSendForm ref={MailFormRef} />
                </div>
            </div>
            <AdjustableSnackbar type={'success'} title={'Pomy??lnie wys??ano maila'} isOpen={IsSuccessSnackbarVisible}
                content={'Tw??j mail zosta?? pomy??lnie wys??any do wybranych przez ciebie odbiorc??w.'} 
                updateStateInStore={updateIsSnackbarSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Nie uda??o si?? wys??a?? maila!'} isOpen={IsErrorSnackbarVisible}
                content={'Z powodu b????du operacja nie powiod??a si??. Sprawd?? czy tw??j mail nie przekracza limit??w i spr??buj ponownie.'} 
                updateStateInStore={updateIsSnackbarErrorVisible} />
            <AdjustableSnackbar type={'error'} title={'Nie uzupe??niono wszystkich p??l!'} isOpen={IsInvalidInputSnackbarVisible}
                content={`Niekt??re z wymaganych p??l nie zosta??y w pe??ni wype??nione. Sprawd?? czy nazwa kampanii lub data follow'upu zosta??a poprawnie uzupe??niona i spr??buj ponownie.`} 
                updateStateInStore={updateIsSnackbarInvalidInputVisible} />
        </React.Fragment>
    )
};

export default SendMail;