import styles from './ActivityLogPage.module.css';

import React from 'react';
import { ScrollTop } from 'primereact/scrolltop';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { DividerHorizontal } from '../../components/divider/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import ActivityLogTable from '../../components/activity-log-table/ActivityLogTable';
import OrganizationMemberPicker from '../../components/organization-member-picker/OrganizationMemberPicker';

const ContentWrapper = styled.div`
    width: 100%;
    padding: 5vh 4vw 4vh 4vw;
    height: auto;
    min-height: 140vh;
    transition: 0.4s all ease;
`;

function ActivityLogPageHistory() {
    return (
        <React.Fragment>
            <ScrollTop />
            <Container fluid className="pageWrapper">
                <Row style={{margin: '0px'}}>
                    <ScrollPanel style={{width: '100%', overflow: 'hidden'}}>
                        <ContentWrapper>
                            <h1 className="primaryHeader">
                                <FontAwesomeIcon icon={faClockRotateLeft} />
                                Historia Aktywności Zespołu
                            </h1>
                            <p className="paragraphText">
                                W tym miejscu znajdziesz historię zmian obejmująca wszystkie elementy / obiekty zapisywane w bazie danych. Masz możliwość swobodnego przełączania pomiędzy historią poszczególnych wolontariuszy a kompletną tabelą reprezentującą całą organizację za pomocą panelu wyboru znajdującego się poniżej. Informacje zawarte w na tej podstronie możesz wykorzystać do przywracania własnych danych oraz tych należących do pozostałych członków. Ponadto jesteś w stanie analizować swój postęp, a także wyświetlać przeszłe stany wybranych elementów na przykład szablonów. Miej na uwadze, że rekordy starsze niż 30 dni będą automatycznie usuwane w celu poprawy wydajności pamięci!
                            </p>
                            <DividerHorizontal />
                            <OrganizationMemberPicker />
                            <ActivityLogTable />
                        </ContentWrapper>
                        <ScrollTop target="parent" threshold={100} className="scrolltop" icon="pi pi-arrow-up" />
                    </ScrollPanel>
                </Row>
            </Container> 
        </React.Fragment>
    );
};

export default ActivityLogPageHistory;