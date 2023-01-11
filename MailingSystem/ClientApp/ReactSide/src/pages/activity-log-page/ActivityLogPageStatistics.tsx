import styles from './ActivityLogPage.module.css';

import React from 'react';
import { ScrollTop } from 'primereact/scrolltop';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { DividerHorizontal } from '../../components/divider/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons';
import OrganizationMemberPicker from '../../components/organization-member-picker/OrganizationMemberPicker';
import { useAppSelector } from '../../hooks/Hooks';
import ActivityLogDashboardHeader from '../../components/dashboard-header/ActivityLogDashboardHeader';
import ActivityLogDashboardHeaderAlt from '../../components/dashboard-header/ActivityLogDashboardHeaderAlt';
import OverviewTilesActivityLog from '../../components/overview-tiles/OverviewTilesActivityLog';
import { Chart } from 'primereact/chart';
import { ChartOptions } from '../../subpages/Dashboard';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';

const ContentWrapper = styled.div`
    width: 100%;
    padding: 5vh 4vw 4vh 4vw;
    height: auto;
    min-height: 140vh;
    transition: 0.4s all ease;
`;

function ActivityLogPageStatistics() {
    const ActiveUser = useAppSelector((state) => state.ActivityHistory.ActiveUserSelected);
    const Statistics = useAppSelector((state) => state.ActivityHistory.TeamStatistics
        .filter((TeamStatistic) => {
            return TeamStatistic.Identifier == state.ActivityHistory.ActiveUserSelected;
        })[0]
    );

    let FormattedChartData = {};

    if (typeof Statistics != 'undefined') {
        FormattedChartData = {
            labels: Statistics.ChartData.map((ChartDataPoint) => ChartDataPoint.DateLabel),
            datasets: [
                {
                    label: 'Ilość wysłanych wiadomości e-mail w danym tygodniu',
                    data: Statistics.ChartData.map((ChartDataPoint) => ChartDataPoint.Value),
                    fill: true,
                    borderColor: '#134ECD',
                    tension: 0.4,
                    backgroundColor: 'rgba(19, 78, 205, 0.25)'
                }
            ]
        };
    }

    return (
        <React.Fragment>
            <ScrollTop />
            {(typeof Statistics != 'undefined') ?
                <Container fluid className="pageWrapper">
                    <Row style={{margin: '0px'}}>
                        <ScrollPanel style={{width: '100%', overflow: 'hidden'}}>
                            <ContentWrapper>
                                <h1 className="primaryHeader">
                                    <FontAwesomeIcon icon={faRankingStar} />
                                    Statystyki Członków Zespołu
                                </h1>
                                <p className="paragraphText">
                                    Ta podstrona służy do wyświetlania i analizowania kompletnych statystyk zarówno dla całego zespołu jak i każdego pojedynczego członka. Masz możliwość swobodnego przełączania między poszczególnymi wolontariuszami, a także danymi reprezentującymi organizację za pomocą panelu wyboru znajdującego się poniżej. 
                                </p>
                                <DividerHorizontal />
                                <OrganizationMemberPicker />
                                {ActiveUser == 'Wszyscy' ? 
                                    <ActivityLogDashboardHeaderAlt /> 
                                    : 
                                    <ActivityLogDashboardHeader />
                                }
                                <OverviewTilesActivityLog />
                                <div className={`flexHorizontal ${styles.StatisticsArea}`}>
                                    <div className={`card ${styles.ChartArea}`}>
                                        <h2>Aktywność w ostatnich tygodniach</h2>
                                        <Chart type="line" data={FormattedChartData} options={ChartOptions} />
                                    </div>
                                </div>
                            </ContentWrapper>
                            <ScrollTop target="parent" threshold={100} className="scrolltop" icon="pi pi-arrow-up" />
                        </ScrollPanel>
                    </Row>
                </Container> 
                :
                <LoadingScreen Text={'Zbieramy informacje. To może chwilę potrwać...'} />
            }
        </React.Fragment>
    );
};

export default ActivityLogPageStatistics;