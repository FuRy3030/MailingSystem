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
                                W tym miejscu znajdziesz ustawienia dla wszystkich narz??dzi dost??pnych na stronie. Mo??esz je dowolnie skonfigurowa?? tak aby spe??nia??y twoje preferencje. W celu zaaplikowania wszystkich zmian konieczne mo??e by?? od??wie??enie przegl??darki.
                            </p>
                            <DividerHorizontal />
                            <MailsSettingsForm />
                        </ContentWrapper>
                        <ScrollTop target="parent" threshold={100} className="scrolltop" icon="pi pi-arrow-up" />
                    </ScrollPanel>
                </Row>
            </Container>
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsSuccessSaveSnackbarVisible}
                content={'Twoje nowe ustawienia zosta??y zapisane i zsynchronizowane. Uruchom ponownie aplikacj?? aby zosta??y one zaaplikowane.'} 
                updateStateInStore={updateIsSnackbarSuccessSaveVisible} />
            <AdjustableSnackbar type={'error'} title={'Wyst??pi?? b????d!'} isOpen={IsErrorSaveSnackbarVisible}
                content={'Nie uda??o zapisa?? si?? twoich nowych ustawie??. Sprawd?? czy wszystkie pola s?? uzupe??nione i spr??buj ponownie p????niej.'} 
                updateStateInStore={updateIsSnackbarErrorSaveVisible} />
        </React.Fragment>
    );
};

export default SettingsPage;