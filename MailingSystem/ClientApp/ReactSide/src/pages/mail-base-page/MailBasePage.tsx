import styled from 'styled-components';
import styles from './MailBasePage.module.css';
import { Outlet } from 'react-router-dom';

import { Container, Row } from "react-bootstrap";
import SideBarNavigation from '../../components/side-bar-navigation/SideBarNavigation';
import AddMailsDrawer from '../../components/add-mails-drawer/AddMailsDrawer';
import { useCallback, useEffect, useRef, useState } from 'react';

const ContentWrapper = styled.div`
    width: 77%;
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
    const MailsDrawerContentRef = useRef<HTMLDivElement | null>(null);

    const UpdateContentWrapper = (areResultsVisible: boolean) => {
        setIsDrawerResultVisible(areResultsVisible);
    };

    // console.log(MailsDrawerContentRef.current?.nextSibling?.nextSibling);
    // useEffect(() => {
    //     console.log('a');
    //     if (MailsDrawerContentRef.current?.nextSibling?.nextSibling != null && 
    //         MailsDrawerContentRef.current?.nextSibling?.nextSibling != undefined) 
    //     {
    //         console.log('a');
    //         setIsDrawerResultVisible(prevState => !prevState.valueOf());
    //     }
    // }, [MailsDrawerContentRef.current]);

    return (
        <Container fluid className="pageWrapper">
            <Row style={{margin: '0px'}}>
                <SideBarWrapper style={{zIndex: '4'}}>
                    <SideBarNavigation />
                </SideBarWrapper> 
                <ContentWrapper className={isDrawerResultVisible && styles.WrapperWithGreaterMargin}>
                    <AddMailsDrawer ref={MailsDrawerContentRef} UpdateWrapperClass={UpdateContentWrapper} />
                    <Outlet />
                </ContentWrapper>
            </Row>
        </Container>
    )
};

export default MailBasePage;
