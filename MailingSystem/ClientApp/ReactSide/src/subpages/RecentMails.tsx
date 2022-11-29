import { useEffect, useRef } from "react";
import AdjustableSnackbar from "../components/snackbars/AdjustableSnackbar";

import { useAppSelector, useAppDispatch } from "../hooks/Hooks";
import { UIActions } from "../redux-store/ui";
import { DividerHorizontal } from "../components/divider/Divider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import MailsDataTable from "../components/mails-data-table/MailsDataTable";

function RecentMails() {
    // const MailsDrawerContentRef = useRef<HTMLDivElement | null>(null);
    const SubPageRef = useRef<HTMLDivElement | null>(null);
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);  

    const Dispatch = useAppDispatch();
    const IsSuccessSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.SuccessSnackbarIsVisible
    });
    const IsErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.ErrorSnackbarIsVisible
    });
    const IsInfoSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.InfoSnackbarIsVisible
    });
    const IsDataTableSuccessSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.EditDataTableSuccessSnackbarIsVisible
    });
    const IsDataTableErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.EditDataTableErrorSnackbarIsVisible
    });
    const IsDataTableDeleteErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.EditDataTableErrorSnackbarIsVisible
    });

    const updateIsSnackbarSuccessVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Success', isVisible: isVisible}));
    };

    const updateIsSnackbarErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Error', isVisible: isVisible}));
    };

    const updateIsSnackbarInfoVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Info', isVisible: isVisible}));
    };

    const updateIsSnackbarDataTableSuccessVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({
            type: 'DataTableSuccess', 
            isVisible: isVisible
        }));
    };

    const updateIsSnackbarDataTableErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({
            type: 'DataTableError', 
            isVisible: isVisible
        }));
    };

    const updateIsSnackbarDataTableDeleteErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({
            type: 'DataTableErrorDelete', 
            isVisible: isVisible
        }));
    };

    // const HandleScroll: (event: any) => void = (event) => {
    //     if (MailsDrawerContentRef != null) {
    //         if (MailsDrawerContentRef.current) {
    //             const ContentHeight = MailsDrawerContentRef.current.offsetHeight;       
    //             const CurrentPosition = window.scrollY;

    //             if (CurrentPosition <= ContentHeight && SubPageRef.current) {
    //                 SubPageRef.current.style.marginTop = `${ContentHeight - CurrentPosition}px`;
    //             }
    //             else if (SubPageRef.current) {
    //                 SubPageRef.current.style.marginTop = `0px`;
    //             }
    //         }
    //     };
    // };

    // useEffect(() => {
    //     window.addEventListener('scroll', HandleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', HandleScroll);
    //     }
    // }, []);

    return (
        <div ref={SubPageRef} style={{paddingTop: `${DrawerHeight}px`}}>
            <div className="SubPageContent">
                <h1 className="primaryHeader">
                    <FontAwesomeIcon icon={faEnvelope} />
                    Najnowsze, najświeższe maile
                </h1>
                <p className="paragraphText">
                Tutaj znajdziesz listę ostatnich odbiorców twojej organizacji. Poniżej znajduje się sieć zawierająca wszystkie ostatnie adresy e-mail dodane przez ciebie i innych członków. Możesz edytować, modyfikować oraz usuwać historię wysłanych maili należącą zarówno do ciebie jak i innych osób. Zaaplikowane przez ciebie zmiany zostaną dodane do globalnego rejestru zmian, dzięki czemu będziesz mógł / mogła cofnąć naniesione poprawki.
                </p>
                <DividerHorizontal />
                <MailsDataTable />
            </div>
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsSuccessSnackbarVisible}
                content={'Twoje zmiany zostały zapisane i zsynchronizowane. Możesz teraz dodać kolejne elementy.'} 
                updateStateInStore={updateIsSnackbarSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsErrorSnackbarVisible}
                content={'Twoje zmiany nie zostały zapisane. Sprawdź czy lista twoich adresów e-mail jest poprawnie sformatowana i spróbuj ponownie później.'} 
                updateStateInStore={updateIsSnackbarErrorVisible} />
            <AdjustableSnackbar type={'info'} title={'Skopiowano do schowka'} isOpen={IsInfoSnackbarVisible}
                content={'Nowe maile oddzielone przecinkiem i spacją zostały skopiowane do twojego schowka.'} 
                updateStateInStore={updateIsSnackbarInfoVisible} />
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsDataTableSuccessSnackbarVisible}
                content={'Twoje modyfikacje we wspólnej bazie maili zostały poprawnie zaimplementowane.'} 
                updateStateInStore={updateIsSnackbarDataTableSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Napotkano błąd!'} isOpen={IsDataTableErrorSnackbarVisible}
                content={'Sprawdź czy żadne pole nie pozostało puste lub nie zawierało błędnego formatu i spróbuj ponownie.'} 
                updateStateInStore={updateIsSnackbarDataTableErrorVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsDataTableDeleteErrorSnackbarVisible}
                content={'Nie udało się usunąć wybranego wiersza. Pamiętaj, że nie możesz usuwać danych stworzonych przez innych członków.'} 
                updateStateInStore={updateIsSnackbarDataTableDeleteErrorVisible} />
        </div>
    )
};

export default RecentMails;