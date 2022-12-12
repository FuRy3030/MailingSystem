import styles from './TemplatesBrowseList.module.css';

import TemplateShortcut from '../template-shortcut/TemplateShortcut';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { IUserTemplate } from '../../redux-store/redux-entities/types';
import AuthContext from '../../context-store/auth-context';
import { useContext, useEffect } from 'react';
import { GetTemplates } from '../../redux-store/templates-data';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import EmptyNotification from '../empty-space-notification/EmptyNotification';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus, faPenRuler } from '@fortawesome/free-solid-svg-icons';

function TemplatesBrowseList(props: any) {
    const Templates: IUserTemplate[] = useAppSelector(state => state.Templates.Templates);
    const Dispatch = useAppDispatch();
    const Ctx = useContext(AuthContext);
    const Navigate = useNavigate();

    const NavigateToAddTemplates = () => {
        Navigate('/mails/templates/add');
    };

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
    
    return (
        <React.Fragment>
            {Templates.filter((Template: IUserTemplate) => {
            return props.ActiveTabMenuIndexArray.includes(Template.Type) && 
                (Template.Name.toLowerCase()).includes(props.SearchBarValue);
            }).length > 0 ?
                <div className={styles.TemplatesBrowseList}>
                    <div className={styles.AddTemplateCard}>
                        <FontAwesomeIcon icon={faPenRuler} />
                        <Button variant="primary" className={`site-button`}
                            onClick={NavigateToAddTemplates}>
                            Dodaj Szablon <FontAwesomeIcon icon={faFileCirclePlus} />
                        </Button>
                    </div>
                    {Templates.filter((Template: IUserTemplate) => {
                        return props.ActiveTabMenuIndexArray.includes(Template.Type) && 
                            (Template.Name.toLowerCase()).includes(props.SearchBarValue);
                    }).map((Template: IUserTemplate, index: number) => {
                        return <TemplateShortcut 
                            key={index}
                            TemplateId={Template.TemplateId}
                            Name={Template.Name}
                            Topic={Template.Topic}
                            Content={Template.Content}
                            Type={Template.Type}
                            CreationTime={Template.CreationDate}
                            TimePassed={Template.TimePassedInDays}
                        />
                    })}
                </div>
                :
                <div className='margin-auto' style={{
                    width: '72.5%', 
                    marginBottom: '7.5vh', 
                    marginTop: '7.5vh'
                }}>
                    <EmptyNotification />
                    <Button variant="primary" className={`site-button ${styles.NavigateToAddTemplatesButton}`}
                        onClick={NavigateToAddTemplates}>
                        Utwórz Nowy Szablon <FontAwesomeIcon icon={faFileCirclePlus} />
                    </Button>
                </div>
            }
        </React.Fragment>
    );
};

export default TemplatesBrowseList;
