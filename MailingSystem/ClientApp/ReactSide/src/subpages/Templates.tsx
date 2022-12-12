import styles from './Subpages.module.css';

import React, { useState } from "react";
import { DividerHorizontal } from "../components/divider/Divider";
import { useAppDispatch, useAppSelector } from "../hooks/Hooks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faBars, faMailReplyAll, faSquareUpRight } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { TabMenu, TabMenuTabChangeParams } from 'primereact/tabmenu';
import SearchBar from "../components/search-bar/SearchBar";
import TemplatesBrowseList from "../components/templates-browse-list/TemplatesBrowseList";

import "primereact/resources/themes/lara-light-indigo/theme.css";  
import "primereact/resources/primereact.min.css";                  
import "primeicons/primeicons.css";                                
import AdjustableSnackbar from '../components/snackbars/AdjustableSnackbar';
import { UIActions } from '../redux-store/ui';

function Templates() {
    const Dispatch = useAppDispatch();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeIndexArray, setActiveIndexArray] = useState<number[]>([0, 1, 2]);
    const [SearchBarValue, setSearchBarValue] = useState<string>('');
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);

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

    const IsDeleteTemplateSuccessSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.Templates.DeleteTemplateSuccessSnackbarIsVisible
    });
    const IsDeleteTemplateErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.Templates.DeleteTemplateErrorSnackbarIsVisible
    });

    const updateIsDeleteTemplateSuccessSnackbarVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setTemplatesSnackbarVisibility({
            type: 'DeleteSuccess', 
            isVisible: isVisible
        }));
    };

    const updateIsDeleteTemplateErrorSnackbarVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setTemplatesSnackbarVisibility({
            type: 'DeleteError', 
            isVisible: isVisible
        }));
    };

    return (
        <React.Fragment>
            <div style={{paddingTop: `${DrawerHeight}px`}}>
                <div className="SubPageContent">
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faEnvelopeOpenText} />
                        Twoje Szablony Maili
                    </h1>
                    <p className="paragraphText">
                        W tym miejscu znajdziesz wszystkie stworzone przez ciebie szablony składające się z tytułu i treści maila. Możesz dodawać i usuwać wzorce oraz modyfikować swój zbiór szablonów w dowolny sposób. Masz także możliwość na pogrupowanie swoich schematów na uniwersalne, dedykowane zwykłym mailom czy zaprojektowane pod follow-up'y i odpowiedzi.
                    </p>
                    <DividerHorizontal />
                    <SearchBar onChangeFunction={HandleSearchBarChange} />
                    <TabMenu model={TabItems} activeIndex={activeIndex} className="siteTabMenu"
                        onTabChange={HandleTabChange} />
                    <TemplatesBrowseList ActiveTabMenuIndexArray={activeIndexArray} 
                        SearchBarValue={SearchBarValue} />             
                </div>
            </div>
            <AdjustableSnackbar type={'success'} title={'Usunięto szablon'} isOpen={IsDeleteTemplateSuccessSnackbarVisible}
                content={'Pomyślnie usunięto wybrano szablon.'} 
                updateStateInStore={updateIsDeleteTemplateSuccessSnackbarVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsDeleteTemplateErrorSnackbarVisible}
                content={'Niestety nie udało się usunąć wybranego szablonu. Spróbuj ponownie później.'} 
                updateStateInStore={updateIsDeleteTemplateErrorSnackbarVisible} />
        </React.Fragment>
    )
};

export default Templates;