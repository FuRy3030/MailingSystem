import styles from './FollowUpForm.module.css';

import { Calendar, CalendarChangeParams } from 'primereact/calendar';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useRef, useState } from 'react';

function DateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

function FollowUpForm(props: any) {
    const [Behavior, setBehavior] = useState<number | string>('');
    const EditorRef = useRef<TinyMCEEditor | null>(null);
    
    const TodayDate = new Date();
    let TomorrowDate =  new Date();
    TomorrowDate.setDate(TodayDate.getDate() + 1);

    const Types = [
        { name: `Brak odpowiedzi`, value: 'r' },
        { name: 'Brak otwarcia', value: 'o' },
        { name: `Brak kliknięcia (linku)`, value: 'c' }
    ];

    const OnCalendarChange = (event: CalendarChangeParams) => {
        var SelectedDate = event.value;
        if (SelectedDate && !Array.isArray(SelectedDate)) {
            const Today = new Date();
            const DaySpan: number = DateDiffInDays(Today, SelectedDate);
            props.HandleFollowUpChange(props.ArrayIndex, DaySpan, 0);
        }
    };

    const OnBehaviorChange = (event: DropdownChangeParams) => {
        setBehavior(event.value);
        props.HandleFollowUpChange(props.ArrayIndex, event.value, 1);
    };

    const HandleEditorContent = (event: any) => {
        props.HandleFollowUpChange(props.ArrayIndex, event.target.getContent(), 2);
    };

    return (
        <div>
            <div className={styles.FollowUpFormInputs}>
                <div className="field defaultSiteCalendarField" style={{width: '50%'}}>
                    <Calendar minDate={TomorrowDate} placeholder="Data wysłania follow-up'u*" 
                        id="FollowUpCalendarField" showIcon onChange={OnCalendarChange} />
                </div>
                <span className="p-float-label defaultSiteSelectField" style={{marginLeft: '2.5vw', width: '40%'}}>
                    <Dropdown inputId="FollowupBehaviour" options={Types} optionLabel="name" 
                        onChange={OnBehaviorChange} value={Behavior} />
                    <label htmlFor="FollowupBehavior">Warunek wysłania follow-up'u*</label>
                </span>
            </div>
            <Editor
                tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => {
                    if (EditorRef.current) {
                        EditorRef.current = editor;
                    };                  
                }}
                initialValue=''
                init={{
                    height: 300,
                    menubar: true,
                    width: '100%',
                    resize: 'both',
                    placeholder: "Tutaj zamieść treść swojego follow-up'a",
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
    );
};

export default FollowUpForm;