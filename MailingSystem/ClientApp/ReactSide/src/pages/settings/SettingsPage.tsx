import styles from './SettingsPage.module.css';

import React from 'react';
import { ScrollTop } from 'primereact/scrolltop';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { DividerHorizontal } from '../../components/divider/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import MailsSettingsForm from '../../components/settings-forms/MailsSettingsForm';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { UIActions } from '../../redux-store/ui';
import AdjustableSnackbar from '../../components/snackbars/AdjustableSnackbar';

const ContentWrapper = styled.div`
    width: 100%;
    padding: 5vh 4vw 4vh 4vw;
    height: auto;
    min-height: 140vh;
    transition: 0.4s all ease;
`;

function SettingsPage() {
    const Dispatch = useAppDispatch();

    const IsSuccessSaveSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.Configuration.SaveSuccessSnackbar
    });

    const IsErrorSaveSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.Configuration.ErrorSaveSnackbar
    });

    const updateIsSnackbarSuccessSaveVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setConfigSnackbarVisibility({type: 'Success', isVisible: isVisible}));
    };

    const updateIsSnackbarErrorSaveVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setConfigSnackbarVisibility({type: 'Error', isVisible: isVisible}));
    };

    return (
        <React.Fragment>
            <ScrollTop />
            <Container fluid className="pageWrapper">
                <Row style={{margin: '0px'}}>
                    <ScrollPanel style={{width: '100%', overflow: 'hidden'}}>
                        <ContentWrapper>
                            <h1 className="primaryHeader">
                                <FontAwesomeIcon icon={faScrewdriverWrench} />
                                Ustawienia
                            </h1>
                            <p className="paragraphText">
                                W tym miejscu znajdziesz ustawienia dla wszystkich narzędzi dostępnych na stronie. Możesz je dowolnie skonfigurować tak aby spełniały twoje preferencje. W celu zaaplikowania wszystkich zmian konieczne może być odświeżenie przeglądarki.
                            </p>
                            <DividerHorizontal />
                            <MailsSettingsForm />
                        </ContentWrapper>
                        <ScrollTop target="parent" threshold={100} className="scrolltop" icon="pi pi-arrow-up" />
                    </ScrollPanel>
                </Row>
            </Container>
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsSuccessSaveSnackbarVisible}
                content={'Twoje nowe ustawienia zostały zapisane i zsynchronizowane. Uruchom ponownie aplikację aby zostały one zaaplikowane.'} 
                updateStateInStore={updateIsSnackbarSuccessSaveVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsErrorSaveSnackbarVisible}
                content={'Nie udało zapisać się twoich nowych ustawień. Sprawdź czy wszystkie pola są uzupełnione i spróbuj ponownie później.'} 
                updateStateInStore={updateIsSnackbarErrorSaveVisible} />
        </React.Fragment>
    );
};

export default SettingsPage;