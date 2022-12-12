function Divider() {
    return (
        <div className="divider"></div>
    )
};

const DividerHorizontalAlteration = () => {
    return (
        <div className="divider-horizontal"></div>
    )
};

const DividerExtendedVersion = () => {
    return (
        <div className="divider-extended"></div>
    )
};

export default Divider;
export const DividerHorizontal = DividerHorizontalAlteration; 
export const DividerExtended = DividerExtendedVersion;