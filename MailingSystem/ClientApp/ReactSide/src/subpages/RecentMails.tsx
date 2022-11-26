import { useEffect, useRef } from "react";
import AddMailsDrawer from "../components/add-mails-drawer/AddMailsDrawer";
import AdjustableSnackbar from "../components/snackbars/AdjustableSnackbar";
import { useAppSelector, useAppDispatch } from "../hooks/Hooks";
import { UIActions } from "../redux-store/ui";

function RecentMails() {
    const MailsDrawerContentRef = useRef<HTMLDivElement | null>(null);
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

    const updateIsSnackbarSuccessVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Success', isVisible: isVisible}));
    };

    const updateIsSnackbarErrorVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Error', isVisible: isVisible}));
    };

    const updateIsSnackbarInfoVisible = (isVisible: boolean) => {
        Dispatch(UIActions.setRecentMailsSnackbarVisibility({type: 'Info', isVisible: isVisible}));
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
            <AddMailsDrawer ref={MailsDrawerContentRef}/>
            <AdjustableSnackbar type={'success'} title={'Zapisano Zmiany'} isOpen={IsSuccessSnackbarVisible}
                content={'Twoje zmiany zostały zapisane i zsynchronizowane. Możesz teraz dodać kolejne elementy.'} 
                updateStateInStore={updateIsSnackbarSuccessVisible} />
            <AdjustableSnackbar type={'error'} title={'Wystąpił błąd!'} isOpen={IsErrorSnackbarVisible}
                content={'Twoje zmiany nie zostały zapisane. Sprawdź czy lista twoich adresów e-mail jest poprawnie sformatowana i spróbuj ponownie później.'} 
                updateStateInStore={updateIsSnackbarErrorVisible} />
            <AdjustableSnackbar type={'info'} title={'Skopiowano do schowka'} isOpen={IsInfoSnackbarVisible}
                content={'Nowe maile oddzielone przecinkiem i spacją zostały skopiowane do twojego schowka.'} 
                updateStateInStore={updateIsSnackbarInfoVisible} />
        </div>
    )
};

export default RecentMails;