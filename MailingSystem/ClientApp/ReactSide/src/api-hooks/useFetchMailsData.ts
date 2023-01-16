import { useContext, useEffect } from "react";
import AuthContext from "../context-store/auth-context";
import { useAppDispatch } from "../hooks/Hooks";
import { GetRecentMails } from "../redux-store/mail-data";

export const useFetchMailsData = () => {
    const Dispatch = useAppDispatch();
    const Ctx = useContext(AuthContext);
    
    useEffect(() => {
        let isSend: boolean = false;
        if (Ctx?.accessToken.token != undefined && Ctx?.accessToken.token != '' && isSend == false) {
            Dispatch(GetRecentMails(Ctx?.accessToken.token));
        }      
        else if (isSend == false) {
            const TokenObject: string | null = sessionStorage.getItem('accessToken');
            if (TokenObject != null) {
                Dispatch(GetRecentMails((JSON.parse(TokenObject)).token));
            }
        }
        
        return () => {
            isSend = true;
        }
    }, [Dispatch]);
};