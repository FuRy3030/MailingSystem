import { faGears, faHandshake, faPhoneSlash, faRetweet, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GridColumns } from "@mui/x-data-grid";
import React, { useRef } from "react";
import ConfigureMailCampaign from "../components/configure-mail-campaign/ConfigureMailCampaign";
import { DividerHorizontal } from "../components/divider/Divider";
import LoadingScreen from "../components/loading-screen/LoadingScreen";
import MailRecipientBox from "../components/mail-recipient-box/MailRecipientBox";
import MailSendForm from "../components/mail-send-form/MailSendForm";
import MailsDataTableStatistics from "../components/mails-data-table/MailsDataTableStatistics";
import { useAppSelector } from "../hooks/Hooks";

const ColumnsStatisticsBasics: GridColumns = [
    { 
        field: 'MailAddress', 
        headerName: 'Adres Email', 
        flex: 1, 
        type: 'string',
        minWidth: 120,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
    },
    { 
        field: 'NumberOfEmailsSent', 
        headerName: 'Ilość wysłanych maili', 
        flex: 0.35, 
        type: 'number',
        minWidth: 40,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'DateOfLastEmailSent', 
        headerName: 'Data ostatniego maila', 
        flex: 1, 
        type: 'dateTime',
        minWidth: 120,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'HasOpenedCampaign', 
        headerName: 'Otwarcie', 
        flex: 0.4, 
        type: 'boolean',
        minWidth: 50,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'HasClickedLink', 
        headerName: 'Kliknięcie', 
        flex: 0.4, 
        type: 'boolean',
        minWidth: 50,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'HasReplied', 
        headerName: 'Odpowiedź', 
        flex: 0.4, 
        type: 'boolean',
        minWidth: 50,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    }
];

const ColumnsStatisticsNoReply: GridColumns = [
    { 
        field: 'MailAddress', 
        headerName: 'Adres Email', 
        flex: 1, 
        type: 'string',
        minWidth: 120,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
    },
    { 
        field: 'NumberOfEmailsSent', 
        headerName: 'Ilość wysłanych maili', 
        flex: 0.35, 
        type: 'number',
        minWidth: 40,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'DateOfLastOpen', 
        headerName: 'Data ostatniego otworzenia', 
        flex: 1, 
        type: 'dateTime',
        minWidth: 120,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'HasOpenedCampaign', 
        headerName: 'Otwarcie', 
        flex: 0.4, 
        type: 'boolean',
        minWidth: 50,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    }
];

const ColumnsStatisticsEngaged: GridColumns = [
    { 
        field: 'MailAddress', 
        headerName: 'Adres Email', 
        flex: 1, 
        type: 'string',
        minWidth: 120,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
    },
    { 
        field: 'NumberOfEmailsSent', 
        headerName: 'Ilość wysłanych maili', 
        flex: 0.35, 
        type: 'number',
        minWidth: 40,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'DateOfLastReply', 
        headerName: 'Data ostatniej odpowiedzi', 
        flex: 1, 
        type: 'dateTime',
        minWidth: 120,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'DateOfLastClick', 
        headerName: 'Data ostatniego kliknięcia', 
        flex: 1, 
        type: 'dateTime',
        minWidth: 120,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'HasClickedLink', 
        headerName: 'Kliknięcie', 
        flex: 0.4, 
        type: 'boolean',
        minWidth: 50,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    },
    { 
        field: 'HasReplied', 
        headerName: 'Odpowiedź', 
        flex: 0.4, 
        type: 'boolean',
        minWidth: 50,
        headerClassName: 'CustomDataTableHeader',
        headerAlign: 'center',
        align: 'center'
    }
];

function Dashboard() {
    const MailFormRef = useRef<HTMLDivElement | null>(null);
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    const isLoadingPageShowed = useAppSelector((state) => state.Mails.HTTPStates.GetMailsStatistics.isLoading);
    const GeneralReminderMails = useAppSelector((state) => state.Mails.MailStatistics.MailsWithStatistics);
    const NoReplyMails = useAppSelector((state) => state.Mails.MailStatistics.MailsWithStatisticsSmallActivity);
    const ActiveMails = useAppSelector((state) => state.Mails.MailStatistics.MailsWithStatisticsEngaged);
    const CurrentRecipients = useAppSelector((state) => state.Mails.MailBuilder.Recipients);

    const ScrollIntoViewMailForm = () => {
        if (MailFormRef.current) {
            MailFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }
    };
    
    return (
        <React.Fragment>
            <div style={{paddingTop: `${DrawerHeight}px`}}>
                <div className="SubPageContent">
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faRetweet} />
                        Odśwież Kontakt z Organizacją
                    </h1>
                    <p className="paragraphText">
                        Minęło już trochę czasu i dobrą opcją byłoby odświeżenie kontaktu mailowego z daną organizacją. Niezależnie czy chodzi o wzmiankę medialną, opublikowanie nowej oferty czy inny rodzaj współpracy, poniżej znajdziesz propozycje adresów email, do których można by było wysłać nową wiadomość. 
                    </p>
                    <DividerHorizontal />
                    <MailsDataTableStatistics Columns={[...ColumnsStatisticsBasics]} 
                        MailAggregateStatistics={[...GeneralReminderMails]} /> 
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faHandshake} />
                        Udana Współpraca
                    </h1>
                    <p className="paragraphText">
                        Uzyskałeś odpowiedź na swoją wiadomość e-mail, a może nawet udało Ci się pozyskać ofertę. W rezultacie, może to czas aby napisać ponownie do danej firmy/organizacji aby odświeżyła swoją propozycję.
                    </p>
                    <DividerHorizontal />
                    <MailsDataTableStatistics Columns={[...ColumnsStatisticsEngaged]} 
                        MailAggregateStatistics={[...ActiveMails]} />  
                    <h1 className="primaryHeader">
                        <FontAwesomeIcon icon={faPhoneSlash} />
                        Brak Odpowiedzi?
                    </h1>
                    <p className="paragraphText">
                        Nie otrzymałeś/otrzymałaś odpowiedzi albo wiadomość e-mail nie została nawet wyświetlona. Zawsze warto ponowić próbę kontaktu z tymi organizacjami.
                    </p>
                    <DividerHorizontal />
                    <MailsDataTableStatistics Columns={[...ColumnsStatisticsNoReply]} 
                        MailAggregateStatistics={[...NoReplyMails]} />   
                    {CurrentRecipients.length > 0 && <div>
                        <h1 className="primaryHeader">
                            <FontAwesomeIcon icon={faUser} />
                            Adresaci
                        </h1>
                        <p className="paragraphText">
                            Poniżej znajdują się wybrane przez Ciebie adresy e-mail, na które zaraz zostanie wysłany przypominająca wiadomość e-mail.
                        </p>
                        <DividerHorizontal />
                        <MailRecipientBox ScrollIntoViewMailForm={ScrollIntoViewMailForm} />
                        <h1 className="primaryHeader">
                            <FontAwesomeIcon icon={faGears} />
                            Konfiguruj Kampanię
                        </h1>
                        <p className="paragraphText">
                            Na początku musisz zdefiniować podstawowe informacje dotyczące kampani takie jak ilość follow-up'ów czy jej nazwa. 
                        </p>
                        <DividerHorizontal />
                        <ConfigureMailCampaign />
                        <MailSendForm ref={MailFormRef} />
                    </div>}
                </div>
            </div>
            {isLoadingPageShowed && <LoadingScreen Text={'Uaktualniamy twoje zasoby. To może chwilę potrwać...'} />}
        </React.Fragment>
    )
};

export default Dashboard;