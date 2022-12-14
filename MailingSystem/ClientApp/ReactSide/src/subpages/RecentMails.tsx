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

    const IsDataTableSuccessSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.EditDataTableSuccessSnackbarIsVisible
    });
    const IsDataTableErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.EditDataTableErrorSnackbarIsVisible
    });
    const IsDataTableDeleteErrorSnackbarVisible = useAppSelector((state) => {
        return state.UI.SnackbarsStates.RecentMails.EditDataTableErrorSnackbarIsVisible
    });

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
                    Najnowsze, naj??wie??sze maile
                </h1>
                <p className="paragraphText">
                Tutaj znajdziesz list?? ostatnich odbiorc??w twojej organizacji. Poni??ej znajduje si?? sie?? zawieraj??ca wszystkie ostatnie adresy e-mail dodane przez ciebie i innych cz??onk??w. Mo??esz edytowa??, modyfikowa?? oraz usuwa?? histori?? wys??anych maili nale????c?? zar??wno do ciebie jak i innych os??b. Zaaplikowane przez ciebie zmiany zostan?? dodane do globalnego rejestru zmian, dzi??ki czemu b??dziesz m??g?? / mog??a cofn???? naniesione poprawki.
                </p>
                <DividerHorizontal />
                <MailsDataTable />
            </div>
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsDataTableSuccessSnackbarVisible}
                content={'Twoje modyfikacje we wsp??lnej bazie maili zosta??y poprawnie zaimplementowane.'} 
                updateStateInStore={updateIsSnackbarDataTableSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Napotkano b????d!'} isOpen={IsDataTableErrorSnackbarVisible}
                content={'Sprawd?? czy ??adne pole nie pozosta??o puste lub nie zawiera??o b????dnego formatu i spr??buj ponownie.'} 
                updateStateInStore={updateIsSnackbarDataTableErrorVisible} />
            <AdjustableSnackbar type={'error'} title={'Wyst??pi?? b????d!'} isOpen={IsDataTableDeleteErrorSnackbarVisible}
                content={'Nie uda??o si?? usun???? wybranego wiersza. Pami??taj, ??e nie mo??esz usuwa?? danych stworzonych przez innych cz??onk??w.'} 
                updateStateInStore={updateIsSnackbarDataTableDeleteErrorVisible} />
        </div>
    )
};

export default RecentMails;