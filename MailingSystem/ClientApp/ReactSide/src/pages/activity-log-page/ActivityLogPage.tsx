import React from 'react';
import { ScrollTop } from 'primereact/scrolltop';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { DividerHorizontal } from '../../components/divider/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import ActivityLogTable from '../../components/activity-log-table/ActivityLogTable';
import OrganizationMemberPicker from '../../components/organization-member-picker/OrganizationMemberPicker';

const ContentWrapper = styled.div`
    width: 100%;
    padding: 5vh 4vw 4vh 4vw;
    height: auto;
    min-height: 140vh;
    transition: 0.4s all ease;
`;

function ActivityLogPage() {
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

export default ActivityLogPage;