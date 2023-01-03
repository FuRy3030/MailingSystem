import styled from 'styled-components';
import styles from './MailBasePage.module.css';
import { Outlet, useNavigate } from 'react-router-dom';

import { Container, Row } from "react-bootstrap";
import SideBarNavigation from '../../components/side-bar-navigation/SideBarNavigation';
import AddMailsDrawer from '../../components/add-mails-drawer/AddMailsDrawer';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { UIActions } from '../../redux-store/ui';
import React from 'react';
import AdjustableSnackbar from '../../components/snackbars/AdjustableSnackbar';

import { ScrollTop } from 'primereact/scrolltop';
import { ScrollPanel } from 'primereact/scrollpanel';
import ConfirmModal from '../../components/confirm-modal/ConfirmModal';
import { GetSettings } from '../../redux-store/settings';
import AuthContext from '../../context-store/auth-context';

const ContentWrapper = styled.div`
    width: 100%;
    padding: 5vh 4vw 0vh 4vw;
    height: auto;
    min-height: 140vh;
    transition: 0.4s all ease;
`;

const SideBarWrapper = styled.div`
    display: flex;
    width: 23%;
    height: auto;
`;

function MailBasePage() {
    const [isDrawerResultVisible, setIsDrawerResultVisible] = useState<boolean>(false);
    const [isConfirmationModalShowed, setIsConfirmationModalShowed] = useState<boolean>(false);
    const MailsDrawerContentRef = useRef<HTMLDivElement | null>(null);
    const MailSettings = useAppSelector((state) => state.UserConfig.UserConfiguration.UserMailsSettings);
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const Navigate = useNavigate();

    useEffect(() => {
        if (MailSettings.GMassAPIKey == 'NotLoaded') {
            let isSend: boolean = false;
            if (Ctx?.accessToken.token != undefined && Ctx?.accessToken.token != '' && isSend == false) {
                Dispatch(GetSettings(Ctx?.accessToken.token));
            }      
            else if (isSend == false) {
                const TokenObject: string | null = sessionStorage.getItem('accessToken');
                if (TokenObject != null) {
                    Dispatch(GetSettings((JSON.parse(TokenObject)).token));
                }
            }
            
            return () => {
                isSend = true;
            }
        }
    }, []);

    useEffect(() => {
        if (MailSettings.GMassAPIKey == '') {
            setIsConfirmationModalShowed(true);
        }
    }, [MailSettings.GMassAPIKey]);

    const UpdateContentWrapper = (areResultsVisible: boolean) => {
        setIsDrawerResultVisible(areResultsVisible);
    };

    const IsSuccessSnackbarDefaultVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.SuccessDefaultIsVisible
    });
    const IsErrorSnackbarDefaultVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.ErrorDefaultIsVisible
    });

    const IsSuccessSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.SuccessSnackbarIsVisible
    });
    const IsErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.ErrorSnackbarIsVisible
    });
    const IsInfoSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.InfoSnackbarIsVisible
    });

    const IsAddTemplateSuccessSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.Templates.AddTemplateSuccessSnackbarIsVisible
    });
    const IsAddTemplateErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.Templates.AddTemplateErrorSnackbarIsVisible
    });
    const IsEditTemplateErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.Templates.EditTemplateErrorSnackbarIsVisible
    });

    const updateIsSnackbarSuccessDefaultVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setDefaultSnackbarVisibility({type: 'Success', isVisible: isVisible}));
    };
    const updateIsSnackbarErrorDefaultVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setDefaultSnackbarVisibility({type: 'Error', isVisible: isVisible}));
    };

    const updateIsSnackbarSuccessVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Success', isVisible: isVisible}));
    };
    const updateIsSnackbarErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Error', isVisible: isVisible}));
    };
    const updateIsSnackbarInfoVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Info', isVisible: isVisible}));
    };

    const updateIsAddTemplateSnackbarSuccessVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setTemplatesSnackbarVisibility({type: 'AddSuccess', isVisible: isVisible}));
    };
    const updateIsAddTemplateSnackbarErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setTemplatesSnackbarVisibility({type: 'AddError', isVisible: isVisible}));
    };
    const updateIsEditTemplateSnackbarErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setTemplatesSnackbarVisibility({type: 'EditError', isVisible: isVisible}));
    };

    const CloseModal = () => {
        setIsConfirmationModalShowed(false);
    };

    const NavigateToSettings = () => {
        Navigate("/settings");
    };

    return (
        <React.Fragment>
            <ScrollTop />
            <Container fluid className="pageWrapper">
                <Row style={{margin: '0px'}}>
                    <SideBarWrapper style={{zIndex: '4'}}>
                        <SideBarNavigation />
                    </SideBarWrapper> 
                    <ScrollPanel style={{width: '77%', overflow: 'hidden'}}>
                        <ContentWrapper className={isDrawerResultVisible && styles.WrapperWithGreaterMargin}>
                            <AddMailsDrawer ref={MailsDrawerContentRef} UpdateWrapperClass={UpdateContentWrapper} />
                            <Outlet />
                        </ContentWrapper>
                        <ScrollTop target="parent" threshold={100} className="scrolltop" icon="pi pi-arrow-up" />
                    </ScrollPanel>
                </Row>
            </Container>
            <ConfirmModal Title={'Brak Klucza API'} ButtonText={'Zabierz mnie do ustawień'}
                Content={`Aby móc korzystać z bazy mailing'owej musisz wpierw ustawić swój klucz API do swojego konta GMass w ustawieniach.`} 
                isShowed={isConfirmationModalShowed} ConfirmFunction={NavigateToSettings} 
                CloseModal={CloseModal} />
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsSuccessSnackbarDefaultVisible}
                content={'Twoje zmiany zostały zapisane i zsynchronizowane. Możesz teraz dodać / modyfikować kolejne elementy lub zasoby.'} 
                updateStateInStore={updateIsSnackbarSuccessDefaultVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsErrorSnackbarDefaultVisible}
                content={'Operacja niestety nie powiodła się z powodu nieznanego błędu. Spróbuj ponownie później.'} 
                updateStateInStore={updateIsSnackbarErrorDefaultVisible} />
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsSuccessSnackbarVisible}
                content={'Twoje zmiany zostały zapisane i zsynchronizowane. Możesz teraz dodać kolejne elementy.'} 
                updateStateInStore={updateIsSnackbarSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsErrorSnackbarVisible}
                content={'Twoje zmiany nie zostały zapisane. Sprawdź czy lista twoich adresów e-mail jest poprawnie sformatowana i spróbuj ponownie później.'} 
                updateStateInStore={updateIsSnackbarErrorVisible} />
            <AdjustableSnackbar type={'info'} title={'Skopiowano do schowka'} isOpen={IsInfoSnackbarVisible}
                content={'Nowe maile oddzielone przecinkiem i spacją zostały skopiowane do twojego schowka.'} 
                updateStateInStore={updateIsSnackbarInfoVisible} />
            <AdjustableSnackbar type={'success'} title={'Dodano Szablon'} isOpen={IsAddTemplateSuccessSnackbarVisible}
                content={'Nowo stworzony szablon maila został dodany do twoich zasobów i jest gotowy do użycia.'} 
                updateStateInStore={updateIsAddTemplateSnackbarSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Operacja nie powiodła się!'} isOpen={IsAddTemplateErrorSnackbarVisible}
                content={'Podczas dodawania nowego szablonu wystąpił błąd. Sprawdź czy twój szablon zawiera nazwę i spróbuj ponownie później.'} 
                updateStateInStore={updateIsAddTemplateSnackbarErrorVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsEditTemplateErrorSnackbarVisible}
                content={'Twoje zmiany nie zostały zapisane. Sprawdź czy twój szablon zawiera nazwę i spróbuj ponownie później.'} 
                updateStateInStore={updateIsEditTemplateSnackbarErrorVisible} />
        </React.Fragment>
    )
};

export default MailBasePage;
