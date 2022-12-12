import styles from './EditTemplateForm.module.css';

import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useContext, useEffect, useRef, useState } from 'react';
import TemplateTitleInput from '../inputs/TemplateTitleInput';
import { Dropdown } from 'primereact/dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faSpellCheck } from '@fortawesome/free-solid-svg-icons';
import { InputText } from 'primereact/inputtext';
import { Button } from 'react-bootstrap';
import AuthContext from '../../context-store/auth-context';
import Config from '../../config/config';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { UIActions } from '../../redux-store/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { IUserTemplate } from '../../redux-store/redux-entities/types';
import { TemplatesActions } from '../../redux-store/templates-data';

function AddTemplateForm() {
    const { TemplateId } = useParams();
    const EditorRef = useRef<TinyMCEEditor | null>(null);
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const Navigate = useNavigate();
    const Templates = useAppSelector(state => state.Templates.Templates);
    let CurrentTemplate: IUserTemplate | undefined;

    if (TemplateId) {
        CurrentTemplate = Templates.find((Template: IUserTemplate) => {
                return Template.TemplateId == parseInt(TemplateId);
        });
    }

    useEffect(() => {
        if (Templates.length === 0) {
            Navigate('/mails/templates');
        }
    }, []);

    const [Type, setType] = useState<number | string>(CurrentTemplate?.Type != undefined ? 
        CurrentTemplate?.Type : '');
    const [Name, setName] = useState<string>(CurrentTemplate?.Name != undefined ? 
        CurrentTemplate?.Name : '');
    const [Topic, setTopic] = useState<string>(CurrentTemplate?.Topic != undefined ? 
        CurrentTemplate?.Topic : '');
    const [Content, setContent] = useState<string>(CurrentTemplate?.Content != undefined ? 
        CurrentTemplate?.Content : '');

    const Types = [
        { name: 'Uniwersalny', value: 0 },
        { name: 'Zwykły Mail', value: 1 },
        { name: 'Follow-up', value: 2 }
    ];

    const HandleClickEditTemplate = () => {
        try {
            const requestOptions = {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Ctx?.accessToken.token}` 
                },
                body: JSON.stringify({
                    Token: Ctx?.accessToken.token,
                    TemplateId: TemplateId,
                    Name: Name,
                    Type: typeof Type === 'string' ? 0 : Type,
                    Topic: Topic,
                    Content: Content
                })
            };

            fetch(`${Config.sourceURL}/Templates/edit`, requestOptions)
                .then(ServerResponse => ServerResponse.text())
                .then(TextResponse => {
                    Dispatch(UIActions.setTemplatesSnackbarVisibility({
                        type: 'EditError', 
                        isVisible: false
                    }));

                    Dispatch(UIActions.setDefaultSnackbarVisibility({
                        type: 'Success', 
                        isVisible: false
                    }));

                    if (TextResponse == 'Success') {
                        Dispatch(UIActions.setDefaultSnackbarVisibility({
                            type: 'Success', 
                            isVisible: true
                        }));  

                        if (TemplateId) {
                            Dispatch(TemplatesActions.UpdateTemplate({
                                TemplateId: parseInt(TemplateId),
                                Name: Name,
                                Type: typeof Type === 'string' ? 0 : Type,
                                Topic: Topic,
                                Content: Content
                            }));
                        }
                        
                        Navigate('/mails/templates');
                    }
                    else {
                        Dispatch(UIActions.setTemplatesSnackbarVisibility({
                            type: 'EditError', 
                            isVisible: true
                        }));
                    }
                })
                .catch(error => {
                    Dispatch(UIActions.setTemplatesSnackbarVisibility({
                        type: 'EditError', 
                        isVisible: true
                    }))
                });
        }
        catch {
            Dispatch(UIActions.setTemplatesSnackbarVisibility({
                type: 'EditError', 
                isVisible: true
            }))
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
        <div className={styles.EditTemplateForm}>
            <div className={styles.EditTemplateFormAttributes}>
                <span className="p-float-label p-input-icon-right defaultSiteInputField">
                    <FontAwesomeIcon icon={faSpellCheck} />
                    <InputText id="name" defaultValue={CurrentTemplate?.Name} onChange={HandleNameChange} />
                    <label htmlFor="name">Nazwa Szablonu*</label>
                </span>
                <span className="p-float-label defaultSiteSelectField" style={{marginLeft: '2.5vw'}}>
                    <Dropdown inputId="type" value={Type} options={Types} optionLabel="name" 
                        onChange={(e) => setType(e.value)}/>
                    <label htmlFor="type">Rodzaj Szablonu*</label>
                </span>
            </div>
            <TemplateTitleInput onChangeFunction={HandleTopicChange} value={CurrentTemplate?.Topic} />
            <div style={{marginTop: '1.25vh', width: '100%'}}>
                <Editor
                    tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                    onInit={(evt, editor) => {
                        if (EditorRef.current) {
                            EditorRef.current = editor;
                        };                  
                    }}
                    initialValue={CurrentTemplate?.Content != undefined ? CurrentTemplate?.Content : ''}
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
            <Button variant="primary" className={`site-button ${styles.EditTemplateButton}`}
                onClick={HandleClickEditTemplate}>
                Modyfikuj Szablon <FontAwesomeIcon icon={faPencil} />
            </Button>
        </div>
    );
};

export default AddTemplateForm;