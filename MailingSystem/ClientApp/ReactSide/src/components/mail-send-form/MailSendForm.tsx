import styles from './MailSendForm.module.css';

import MailTitleInput from '../inputs/MailTitleInput';
import TemplatePicker from '../template-picker/TemplatePicker';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import Config from '../../config/config';
import AuthContext from '../../context-store/auth-context';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { MailsActions } from '../../redux-store/mail-data';
import { IMailBuilder } from '../../redux-store/redux-entities/types';
import { UIActions } from '../../redux-store/ui';
import ConfirmModal from '../confirm-modal/ConfirmModal';
import React from 'react';
import { DividerHorizontal } from '../divider/Divider';
import { faFileArrowUp, faReplyAll } from '@fortawesome/free-solid-svg-icons';
import FollowUpForm from '../follow-up-form/FollowUpForm';
import LoadingScreen from '../loading-screen/LoadingScreen';
import { InputText } from 'primereact/inputtext';

interface FollowUpEntity {
    DaySpan: number;
    Behavior: string;
    Content: string;
}

const MailSendForm = React.forwardRef<HTMLDivElement, {}>(({}, MailSendFormRef) => {
    const [AttachmentFileName, setAttachmentFileName] = useState<string>("");
    const [isLoadingPageShowed, setIsLoadingPageShowed] = useState<boolean>(false);
    const [isConfirmationModalShowed, setIsConfirmationModalShowed] = useState<boolean>(false);
    const [FollowUpArray, setFollowUpArray] = useState<FollowUpEntity[]>([{
        DaySpan: 0,
        Behavior: 'r',
        Content: ''
    }, {
        DaySpan: 0,
        Behavior: 'r',
        Content: ''
    }]);

    const Ctx = useContext(AuthContext);
    const EditorRef = useRef<TinyMCEEditor | null>(null);
    const MailTitleInputRef = useRef<HTMLInputElement | null>(null);
    const Dispatch = useAppDispatch();
    const FollowUpsCount = useAppSelector((state) => state.Mails.CurrentCampaignConiguration.FollowUps);
    const CamapignName = useAppSelector((state) => state.Mails.CurrentCampaignConiguration.Name);
    const CurrentMail: IMailBuilder = useAppSelector(state => state.Mails.MailBuilder);

    const CloseModal = () => {
        setIsConfirmationModalShowed(false);
    };

    const HandleClickSendEmail = () => {
        if (CurrentMail.Content == '' || CurrentMail.Topic == '') {
            setIsConfirmationModalShowed(true);
        }
        else {
            HandleSendEmail();
        }
    };

    const HandleSendEmail = () => {
        Dispatch(UIActions.setSendMailSnackbarVisibility({
            type: 'InvalidInput', isVisible: false
        }));

        if (CamapignName == '' || CamapignName == null || CamapignName == undefined) {
            Dispatch(UIActions.setSendMailSnackbarVisibility({
                type: 'InvalidInput', isVisible: true
            }));

            return;
        }
        else if (FollowUpsCount > 0) {
            for (let i = 0; i < FollowUpsCount; i++) {
                if (FollowUpArray[i].DaySpan < 1) {
                    Dispatch(UIActions.setSendMailSnackbarVisibility({
                        type: 'InvalidInput', isVisible: true
                    }));

                    return;
                }
            }
        }

        try {
            setIsLoadingPageShowed(true);

            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Ctx?.accessToken.token}` 
                },
                body: JSON.stringify({
                    Token: Ctx?.accessToken.token,
                    Recipients: CurrentMail.Recipients,
                    Topic: CurrentMail.Topic,
                    Content: CurrentMail.Content,
                    Name: CamapignName,
                    FollowUpsNumber: FollowUpsCount,
                    FollowUps: FollowUpArray,
                    AttachmentFileName: AttachmentFileName
                })
            };

            fetch(`${Config.sourceURL}/SendingMails/send`, requestOptions)
                .then(ServerResponse => ServerResponse.text())
                .then(TextResponse => {
                    Dispatch(UIActions.setSendMailSnackbarVisibility({
                        type: 'Error', 
                        isVisible: false
                    }));

                    Dispatch(UIActions.setSendMailSnackbarVisibility({
                        type: 'Success', 
                        isVisible: false
                    }));

                    if (TextResponse == 'Success') {
                        setIsLoadingPageShowed(false);
                        Dispatch(UIActions.setSendMailSnackbarVisibility({
                            type: 'Success', 
                            isVisible: true
                        }));

                        Dispatch(MailsActions.ClearMailContent());                       
                    }
                    else {
                        setIsLoadingPageShowed(false);
                        Dispatch(UIActions.setSendMailSnackbarVisibility({
                            type: 'Error', 
                            isVisible: true
                        }));
                    }
                })
                .catch(error => {
                    setIsLoadingPageShowed(false);
                    Dispatch(UIActions.setSendMailSnackbarVisibility({
                        type: 'Error', 
                        isVisible: true
                    }));
                });
        }
        catch {
            setIsLoadingPageShowed(false);
            Dispatch(UIActions.setSendMailSnackbarVisibility({
                type: 'Error', 
                isVisible: true
            }));
        }
    };

    const HandleEditorContent = (event: any) => {
        Dispatch(MailsActions.UpdateMailContent(event.target.getContent()));
    };

    const HandleFollowUpChange = (ArrayIndex: number, VariableToUpdate: string | number, 
        propertyIndex: number) => 
    {
        setFollowUpArray((prevState) => {
            const CurrentFollowUpsArray = prevState;
            console.log(CurrentFollowUpsArray);
            switch (propertyIndex) {
                case 0:
                    CurrentFollowUpsArray[ArrayIndex].DaySpan = parseInt(VariableToUpdate.toString());
                    return [...CurrentFollowUpsArray];
                case 1:
                    CurrentFollowUpsArray[ArrayIndex].Behavior = VariableToUpdate.toString();
                    return [...CurrentFollowUpsArray];
                case 2:
                    CurrentFollowUpsArray[ArrayIndex].Content = VariableToUpdate.toString();
                    return [...CurrentFollowUpsArray];  
            }
            return [...CurrentFollowUpsArray];
        });
    };

    useEffect(() => {
        if (EditorRef.current != null) {
            EditorRef.current.setContent(CurrentMail.Content);         
        }
        if (MailTitleInputRef.current) {
            MailTitleInputRef.current.value = CurrentMail.Topic;
        }
    }, [CurrentMail.Content, CurrentMail.Topic]);

    const HandleAttachmentFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttachmentFileName(event.currentTarget.value);
    };

    return (
        <React.Fragment>
            {CurrentMail.Recipients.length > 0 && 
            <div style={{marginTop: '10vh', scrollMarginTop: '25vh'}} ref={MailSendFormRef}>
                <h1 className="primaryHeader">
                    <FontAwesomeIcon icon={faFileWord} />
                    Dodaj Treść Maila
                </h1>
                <p className="paragraphText">
                    Teraz dodaj treść maila razem z tytułem i opcjonalnym załącznikiem. Treść maila możesz edytować samemu używając funkcji edytora albo skorzystać ze stworzonych przez siebie szablonów wiadomości. Twój e-mail zostanie wysłany domyślnie ze stopką, jeżeli ją zapisałeś w ustawieniach.
                </p>
                <DividerHorizontal />
                <div className={styles.MailSendForm}>
                    <MailTitleInput ref={MailTitleInputRef} />
                    <TemplatePicker />
                    <Editor
                        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                        onInit={(evt, editor) => {
                            if (EditorRef.current == null) {
                                EditorRef.current = editor;
                            };                  
                        }}
                        initialValue=''
                        init={{
                            height: 500,
                            menubar: true,
                            width: '100%',
                            resize: 'both',
                            placeholder: "Tutaj zamieść treść swojej wiadomości",
                            font_family_formats: `Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats; 'Quicksand', sans-serif`,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help' + 'charmap | image | insertdatetime | numlist bullist | ' +
                                'link | codesample | code | wordcount | table tabledelete | ' +
                                'tableprops tablerowprops tablecellprops | tableinsertrowbefore ' +
                                'tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter ' +
                                'tabledeletecol',
                            content_style: `body { font-family: 'Quicksand', sans-serif; font-size: 14px }`
                        }}
                        onChange={HandleEditorContent}
                    />
                    {(FollowUpsCount > 0 && CurrentMail.Recipients.length > 0) && <div style={{marginTop: '5vh'}}>
                        <h1 className="primaryHeader">
                            <FontAwesomeIcon icon={faReplyAll} />
                            Dodaj Follow-up'y
                        </h1>
                        <p className="paragraphText">
                            W tym miejscu możesz skonfigurować swoje automatyczne follow-up'y. Dostosuj ich treść i zdecyduj kiedy oraz w jakich okolicznościach mają zostać wysłane w ramach obecnej kampanii.
                        </p>
                        <DividerHorizontal />
                        {Array.from(Array(FollowUpsCount).keys()).map((index: number) => {
                            console.log(index);
                            return <FollowUpForm key={index} ArrayIndex={index} 
                                HandleFollowUpChange={HandleFollowUpChange} />
                        })}
                    </div>}
                    <div className={styles.SubmitCampaignSection}>
                        <span className="p-float-label p-input-icon-right defaultSiteInputField">
                            <FontAwesomeIcon icon={faFileArrowUp} />
                            <InputText id="fileName" defaultValue={""} onChange={HandleAttachmentFileNameChange} />
                            <label htmlFor="fileName">(Opcjonalnie) Nazwa Załącznika</label>
                        </span>
                        <Button variant="primary" className={`site-button ${styles.SendMailButton}`}
                            onClick={HandleClickSendEmail}>
                            Wyślij Maila <FontAwesomeIcon icon={faPaperPlane} />
                        </Button>
                    </div>
                </div>
            </div>}
            <ConfirmModal Title={'Brak tematu lub treści'} ButtonText={'Wyślij'}
                Content={'Na pewno chcesz wysłać tą wiadomość e-mail bez tematu lub treści? Może ona trafić do spamu.'} 
                isShowed={isConfirmationModalShowed} ConfirmFunction={HandleSendEmail} 
                CloseModal={CloseModal} />
            {isLoadingPageShowed && <LoadingScreen Text={'Wysyłamy twoją kampanię. To może chwilę potrwać...'} />}
        </React.Fragment>
    )
});

export default MailSendForm;