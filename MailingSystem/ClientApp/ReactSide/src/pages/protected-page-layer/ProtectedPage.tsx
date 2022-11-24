import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context-store/auth-context";

interface Props {
    children?: ReactNode
}

const Protected = ({ children, ...props }: Props) => {
    const Ctx = useContext(AuthContext);

    if (!Ctx?.isLoggedIn && sessionStorage.getItem('isLoggedIn') != 'true') {
        return <Navigate to="/" replace />;
    }
    else {
        return <React.Fragment>{children}</React.Fragment>;
    }
};

export default Protected;