import { useContext } from "react";
import { useEffect } from "react";
import Config from "../config/config";
import AuthContext from "../context-store/auth-context";
import { useAppDispatch } from "../hooks/Hooks";
import { ActivityHistoryActions } from "../redux-store/activity-log";
import { IAggregateStatisticsInstance } from "../redux-store/redux-entities/types";

export const useInitiateStatisticsLogLiveConnection = () => {
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    let Token: string = "";

    if (Ctx?.accessToken.token != undefined && Ctx?.accessToken.token != '') {
        Token = Ctx?.accessToken.token;
    }
    else {
        const TokenObject: string | null = sessionStorage.getItem('accessToken');
        if (TokenObject) {
            Token = (JSON.parse(TokenObject)).token;
        }
    }

    try {
        useEffect(() => {
            let ifCreated = false;
            let SendingInterval: NodeJS.Timer;

            if (!ifCreated && Token != '') {
                const ActivityLogWebSocket = new WebSocket(`${Config.webSocketURL}/ActivityLog/getstatistics?access_token=${Token}`);
    
                ActivityLogWebSocket.onopen = () => {
                    ActivityLogWebSocket.send(Token);
                    SendingInterval = setInterval(() => {
                        ActivityLogWebSocket.send(Token);
                    }, 5000);
                }
        
                ActivityLogWebSocket.onmessage = (response: any) => {
                    const Data = JSON.parse(response.data);

                    const NewAggregateStatistics: IAggregateStatisticsInstance[] = Data.map((Statistics: any) => {
                        return {
                            MailCount: Statistics.MailCount,
                            Identifier: Statistics.Identifier,
                            PictureURL: Statistics.PictureURL,
                            TrackingStatistics: {
                                UniqueCampaigns: Statistics.TrackingStatistics.UniqueCampaigns,
                                UniqueOpens: Statistics.TrackingStatistics.UniqueOpens,
                                UniqueClicks: Statistics.TrackingStatistics.UniqueClicks,
                                UniqueReplies: Statistics.TrackingStatistics.UniqueReplies
                            },
                            ChartData: Statistics.ChartData.map((Data: any) => {
                                return {
                                    Value: Data.Value,
                                    DateLabel: Data.DateLabel
                                }
                            })
                        } as IAggregateStatisticsInstance;
                    });

                    Dispatch(ActivityHistoryActions.UpdateStatistics(NewAggregateStatistics));
                }
            }

            return () => {
                ifCreated = true;
                if (SendingInterval) {
                    clearInterval(SendingInterval);
                }
            }
        }, []);
    }
    catch {

    }
};