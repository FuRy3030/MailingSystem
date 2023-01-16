import { useFetchMailsData } from "../../api-hooks/useFetchMailsData";
import { useInitiateActivityLogLiveConnection } from "../../api-hooks/useInitiateActivityLogLiveConnection";
import { useInitiateStatisticsLogLiveConnection } from "../../api-hooks/useInitiateStatisticsLogLiveConnection";

function UtilityLoad() {
    // Initial API Load
    useFetchMailsData();
    useInitiateActivityLogLiveConnection();
    useInitiateStatisticsLogLiveConnection();

    return (
        <div style={{display: 'none'}}>

        </div>
    );
};

export default UtilityLoad;