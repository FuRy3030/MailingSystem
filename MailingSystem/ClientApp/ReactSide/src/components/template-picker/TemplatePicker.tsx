import styles from './TemplatePicker.module.css';

import { faBars, faMailReplyAll, faPenRuler, faSquareUpRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmptyNotification from '../empty-space-notification/EmptyNotification';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { IUserTemplate } from '../../redux-store/redux-entities/types';
import TemplateShortcutSmall from '../template-shortcut/TemplateShortcutSmall';
import SearchBar from '../search-bar/SearchBar';
import { TabMenu, TabMenuTabChangeParams } from 'primereact/tabmenu';
import { faEnvelope, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { Carousel } from 'primereact/carousel';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { GetTemplates } from '../../redux-store/templates-data';
import AuthContext from '../../context-store/auth-context';

function TemplatePicker() {
    const Templates: IUserTemplate[] = useAppSelector((state) => state.Templates.Templates);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeIndexArray, setActiveIndexArray] = useState<number[]>([0, 1, 2]);
    const [SearchBarValue, setSearchBarValue] = useState<string>('');
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();

    useEffect(() => {
        if (Templates === null || Templates === undefined || Templates.length == 0) {
            let isSend: boolean = false;
            if (Ctx?.accessToken.token != undefined && Ctx?.accessToken.token != '' && isSend == false) {
                Dispatch(GetTemplates(Ctx?.accessToken.token));
            }      
            else if (isSend == false) {
                const TokenObject: string | null = sessionStorage.getItem('accessToken');
                if (TokenObject != null) {
                    Dispatch(GetTemplates((JSON.parse(TokenObject)).token));
                }
            }
            
            return () => {
                isSend = true;
            }
        }
    }, []);
    
    const Navigate = useNavigate();

    const NavigateToTemplates = () => {
        Navigate('/mails/templates');
    };

    const TabItems = [
        {label: 'Wszystkie', icon: <FontAwesomeIcon icon={faBars} />},
        {label: 'Uniwersalne', icon: <FontAwesomeIcon icon={faPaperPlane} />},
        {label: 'Zwykłe', icon: <FontAwesomeIcon icon={faEnvelope} />},
        {label: 'Follow-up / Odpowiedź', icon: <FontAwesomeIcon icon={faMailReplyAll} />}
    ];

    const HandleTabChange = (event: TabMenuTabChangeParams) => {
        if (event.index === 0) {
            setActiveIndex(0);
            setActiveIndexArray([0, 1, 2]);
        }
        else {
            setActiveIndex(event.index);
            setActiveIndexArray([event.index - 1]);
        }
    };

    const HandleSearchBarChange = (SearchBarString: string) => {
        setSearchBarValue(SearchBarString.toLowerCase());
    };

    const FilteredTemplates: IUserTemplate[] = useMemo(() => {
        return Templates.filter((Template: IUserTemplate) => {
            return activeIndexArray.includes(Template.Type) && 
                (Template.Name.toLowerCase()).includes(SearchBarValue);
        });
    }, [SearchBarValue, activeIndexArray, Templates]);

    return (
        <div className={styles.TemplatePicker}>
            {Templates.length < 1 ?
            <React.Fragment>
                <div className={styles.TemplatePickerDescription}>
                    <FontAwesomeIcon icon={faPenRuler} className={styles.TemplatePickerDescriptionIcon} />
                    <span className={styles.TemplateTextBig}>
                        Twoje Szablony
                    </span>
                    <span className={styles.TemplateTextSmall}>
                        Wybierz interesujący cię szablon z listy aby zastosować go do treści maila
                    </span>
                </div>
                <div className={styles.PartWhenEmpty}>
                    <div className='margin-auto' style={{width: '65%'}}>
                        <EmptyNotification />
                        <Button variant="primary" className={`site-button ${styles.NavigateToTemplatesButton}`}
                            onClick={NavigateToTemplates}>
                            Utwórz Nowy Szablon <FontAwesomeIcon icon={faSquareUpRight} />
                        </Button>
                    </div>
                </div>
            </React.Fragment>
            :
            <div className={styles.TemplatePickerActiveLayout}>
                <div className={styles.TemplatePickerDescriptionActive}>
                    <FontAwesomeIcon icon={faPenRuler} className={styles.TemplatePickerDescriptionIcon} />
                    <div className={styles.TemplatePickerDescriptionActiveText}>
                        <span className={styles.TemplateTextBig}>
                            Twoje Szablony
                        </span>
                        <span className={styles.TemplateTextSmall}>
                            Wybierz interesujący cię szablon z listy aby zastosować go do treści maila
                        </span>
                    </div>
                </div>
                <SearchBar onChangeFunction={HandleSearchBarChange} />
                <TabMenu model={TabItems} activeIndex={activeIndex} className="siteTabMenu"
                    onTabChange={HandleTabChange} />
                {FilteredTemplates.length > 0 ? 
                    FilteredTemplates.length < 3 ? 
                        FilteredTemplates.length == 1 ? 
                        <div className={`card ${styles.PickerCarousel}`} style={{width: '42%'}}>
                            <Carousel value={FilteredTemplates} numVisible={3} numScroll={1} circular
                                autoplayInterval={3000} itemTemplate={TemplateShortcutSmall} />
                        </div>
                        :
                        <div className={`card ${styles.PickerCarousel}`} style={{width: '70%'}}>
                            <Carousel value={FilteredTemplates} numVisible={3} numScroll={1} circular
                                autoplayInterval={3000} itemTemplate={TemplateShortcutSmall} />
                        </div>
                        :
                        <div className={`card ${styles.PickerCarousel}`} style={{width: '100%'}}>
                            <Carousel value={FilteredTemplates} numVisible={3} numScroll={1} circular
                                autoplayInterval={3000} itemTemplate={TemplateShortcutSmall} />
                        </div>
                    :
                    <div className={styles.PartWhenEmpty}>
                        <div className='margin-auto' style={{width: '65%', marginTop: '2.15vh'}}>
                            <EmptyNotification />
                            <Button variant="primary" className={`site-button ${styles.NavigateToTemplatesButton}`}
                                onClick={NavigateToTemplates}>
                                Utwórz Nowy Szablon <FontAwesomeIcon icon={faSquareUpRight} />
                            </Button>
                        </div>
                    </div>
                }
            </div>}
        </div>
    );
};

export default TemplatePicker;