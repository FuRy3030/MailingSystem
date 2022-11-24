import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

import { Container, Row } from "react-bootstrap";
import SideBarNavigation from '../../components/side-bar-navigation/SideBarNavigation';

const ContentWrapper = styled.div`
    width: 77%;
    padding: 7vh 4vw 0 4vw;
    height: auto;
    min-height: 140vh;
`;

const SideBarWrapper = styled.div`
    display: flex;
    width: 23%;
    height: auto;
`;

function MailBasePage() {
    return (
        <Container fluid className="pageWrapper">
            <Row style={{margin: '0px'}}>
                <SideBarWrapper>
                    <SideBarNavigation />
                </SideBarWrapper>
                <ContentWrapper>
                    <Outlet />
                </ContentWrapper>
            </Row>
        </Container>
    )
};

export default MailBasePage;