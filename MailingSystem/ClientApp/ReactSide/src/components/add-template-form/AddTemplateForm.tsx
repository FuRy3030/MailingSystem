import styles from './AddTemplateForm.module.css';

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useContext, useRef, useState } from 'react';
import TemplateTitleInput from '../inputs/TemplateTitleInput';
import { Dropdown } from 'primereact/dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus, faSpellCheck } from '@fortawesome/free-solid-svg-icons';
import { InputText } from 'primereact/inputtext';
import { Button } from 'react-bootstrap';
import AuthContext from '../../context-store/auth-context';
import Config from '../../config/config';
import { useAppDispatch } from '../../hooks/Hooks';
import { UIActions } from '../../redux-store/ui';
import { useNavigate } from 'react-router-dom';
import { TemplatesActions } from '../../redux-store/templates-data';

const moment = require('moment-timezone');

function AddTemplateForm() {
    const [Type, setType] = useState<number | string>('');
    const [Name, setName] = useState<string>('');
    const [Topic, setTopic] = useState<string>('');
    const [Content, setContent] = useState<string>('');

    const EditorRef = useRef<TinyMCEEditor | null>(null);
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const Navigate = useNavigate();

    const Types = [
        { name: 'Uniwersalny', value: 0 },
        { name: 'Zwykły Mail', value: 1 },
        { name: 'Follow-up', value: 2 }
    ];

    const HandleClickAddTemplate = () => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Ctx?.accessToken.token}` 
                },
                body: JSON.stringify({
                    Token: Ctx?.accessToken.token,
                    Name: Name,
                    Type: typeof Type === 'string' ? 0 : Type,
                    Topic: Topic,
                    Content: Content
                })
            };

            fetch(`${Config.sourceURL}/Templates/add`, requestOptions)
                .then(ServerResponse => ServerResponse.json())
                .then(Response => {
                    Dispatch(UIActions.setTemplatesSnackbarVisibility({
                        type: 'AddError', 
                        isVisible: false
                    }));

                    Dispatch(UIActions.setTemplatesSnackbarVisibility({
                        type: 'AddSuccess', 
                        isVisible: false
                    }));

                    if (Response.ResponseText == 'Success') {
                        Dispatch(UIActions.setTemplatesSnackbarVisibility({
                            type: 'AddSuccess', 
                            isVisible: true
                        }));   

                        Dispatch(TemplatesActions.AddTemplate({
                            TemplateId: Response.ResponseBody.TemplateId, 
                            OwnerEmail: Response.ResponseBody.OwnerEmail,
                            Name: Response.ResponseBody.Name,
                            Type: Response.ResponseBody.Type,
                            Topic: Response.ResponseBody.Topic,
                            Content: Response.ResponseBody.Content,
                            TimePassedInDays: Response.ResponseBody.TimePassedInDays,
                            CreationDate: moment.utc(Response.ResponseBody.CreationDate)
                                .local().format('YYYY-MM-DD HH:mm:ss')
                        }));
                        
                        Navigate('/mails/templates');
                    }
                    else {
                        Dispatch(UIActions.setTemplatesSnackbarVisibility({
                            type: 'AddError', 
                            isVisible: true
                        }));
                    }
                })
                .catch(error => {
                    Dispatch(UIActions.setTemplatesSnackbarVisibility({
                        type: 'AddError', 
                        isVisible: true
                    }));
                });
        }
        catch {
            Dispatch(UIActions.setTemplatesSnackbarVisibility({
                type: 'AddError', 
                isVisible: true
            }));
        }
    };

    const HandleEditorContent = (event: any) => {
        setContent(event.target.getContent());
    };

    const HandleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.currentTarget.value);
    };

    const HandleTopicChange = (Topic: string) => {
        setTopic(Topic);
    };

    return (
        <div className={styles.AddTemplateForm}>
            <div className={styles.AddTemplateFormAttributes}>
                <span className="p-float-label p-input-icon-right defaultSiteInputField">
                    <FontAwesomeIcon icon={faSpellCheck} />
                    <InputText id="name" onChange={HandleNameChange} />
                    <label htmlFor="name">Nazwa Szablonu*</label>
                </span>
                <span className="p-float-label defaultSiteSelectField" style={{marginLeft: '2.5vw'}}>
                    <Dropdown inputId="type" value={Type} options={Types} optionLabel="name" 
                        onChange={(e) => setType(e.value)}/>
                    <label htmlFor="type">Rodzaj Szablonu*</label>
                </span>
            </div>
            <TemplateTitleInput onChangeFunction={HandleTopicChange} value={''} />
            <div style={{marginTop: '1.25vh', width: '100%'}}>
                <Editor
                    tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                    onInit={(evt, editor) => {
                        if (EditorRef.current) {
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
            </div>
            <Button variant="primary" className={`site-button ${styles.AddTemplateButton}`}
                onClick={HandleClickAddTemplate}>
                Dodaj Nowy Szablon <FontAwesomeIcon icon={faFileCirclePlus} />
            </Button>
        </div>
    );
};

export default AddTemplateForm;