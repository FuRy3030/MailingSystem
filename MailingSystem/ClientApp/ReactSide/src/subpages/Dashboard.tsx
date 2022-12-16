import styles from './Subpages.module.css';

import DashboardHeader from "../components/dashboard-header/DashboardHeader";
import MailSuggestions from "../components/mail-suggestions/MailSuggestions";
import { useAppSelector } from "../hooks/Hooks";
import OverviewTiles from '../components/overview-tiles/OverviewTiles';
import { Chart } from 'primereact/chart';
import { IChartData } from '../redux-store/redux-entities/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DividerHorizontal } from '../components/divider/Divider';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import DashboardHeaderAlt from '../components/dashboard-header/DashboardHeaderAlt';
import OverviewTilesAlt from '../components/overview-tiles/OverviewTilesAlt';
import React from 'react';
import LoadingScreen from '../components/loading-screen/LoadingScreen';

const ChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: .6,
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        }
    }
};

function Dashboard() {
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    const ChartData: IChartData[] = useAppSelector((state) => state.Mails.Overview.UserMailsChartData);
    const ChartDataTeam: IChartData[] = useAppSelector((state) => state.Mails.Overview.TeamMailsChartData);
    const isLoadingPageShowed = useAppSelector((state) => state.Mails.HTTPStates.GetOverview.isLoading);

    const FormattedChartData = {
        labels: ChartData.map((ChartDataPoint: IChartData) => ChartDataPoint.DateLabel),
        datasets: [
            {
                label: 'Ilość wysłanych wiadomości e-mail w danym tygodniu',
                data: ChartData.map((ChartDataPoint: IChartData) => ChartDataPoint.Value),
                fill: true,
                borderColor: '#134ECD',
                tension: 0.4,
                backgroundColor: 'rgba(19, 78, 205, 0.25)'
            }
        ]
    };

    const FormattedChartDataTeam = {
        labels: ChartDataTeam.map((ChartDataPoint: IChartData) => ChartDataPoint.DateLabel),
        datasets: [
            {
                label: 'Ilość wysłanych wiadomości e-mail w danym tygodniu',
                data: ChartDataTeam.map((ChartDataPoint: IChartData) => ChartDataPoint.Value),
                fill: true,
                borderColor: '#134ECD',
                tension: 0.4,
                backgroundColor: 'rgba(19, 78, 205, 0.25)'
            }
        ]
    };
    
    return (
        <React.Fragment>
            <div style={{paddingTop: `${DrawerHeight}px` }}>
                <div className="SubPageContent">
                    <DashboardHeader />
                    <div className={`flexHorizontal ${styles.DashboardSuggestions}`}>
                        <MailSuggestions />
                        <OverviewTiles />
                    </div>
                    <div className={`card ${styles.ChartArea}`}>
                        <h2>Twoja aktywność w ostatnich tygodniach</h2>
                        <Chart type="line" data={FormattedChartData} options={ChartOptions} />
                    </div>
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faPeopleGroup} />
                        Aktywność Zespołu
                    </h1>
                    <p className="paragraphText">
                        Poniżej znajduje się aktywność całego zespołu w przeciągu ostatnich tygodni / miesięcy. Możesz na nią zerknąć i porównać ze swoimi statystykami. 
                    </p>
                    <DividerHorizontal />
                    <DashboardHeaderAlt />
                    <OverviewTilesAlt />
                    <div className={`card ${styles.ChartArea}`}>
                        <h2>Aktywność zespołu w ostatnich tygodniach</h2>
                        <Chart type="line" data={FormattedChartDataTeam} options={ChartOptions} />
                    </div>
                </div>
            </div>
            {isLoadingPageShowed && <LoadingScreen Text={'Zbieramy twoje dane. To może chwilę potrwać...'} />}
        </React.Fragment>
    )
};

export default Dashboard;