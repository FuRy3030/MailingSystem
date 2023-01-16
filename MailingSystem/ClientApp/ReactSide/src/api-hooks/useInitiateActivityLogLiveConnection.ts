import { useContext } from "react";
import { useEffect } from "react";
import Config from "../config/config";
import AuthContext from "../context-store/auth-context";
import { useAppDispatch } from "../hooks/Hooks";
import { ActivityHistoryActions } from "../redux-store/activity-log";
import { IActivityHistory, ICampaignActivityLog, IMailActivityLog, ITemplateActivityLog } from "../redux-store/redux-entities/types";

const moment = require('moment-timezone');

export const useInitiateActivityLogLiveConnection = () => {
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
                const ActivityLogWebSocket = new WebSocket(`${Config.webSocketURL}/ActivityLog/gethistory?access_token=${Token}`);
    
                ActivityLogWebSocket.onopen = () => {
                    ActivityLogWebSocket.send(Token);
                    SendingInterval = setInterval(() => {
                        ActivityLogWebSocket.send(Token);
                    }, 5000);
                }
        
                ActivityLogWebSocket.onmessage = (response: any) => {
                    const Data = JSON.parse(response.data);

                    const DataProperties: string[] = Object.keys(Data);

                    DataProperties.forEach((Property: string) => {
                        Data[Property].forEach((Log: any) => {
                            Log.ActivityTime = moment.utc(Log.ActivityTime).local().format('HH:mm:ss DD-MM-YYYY');
                        });
                    });

                    const NewActivityHistory: IActivityHistory = {
                        CampaignLogs: Data.CampaignLogs.map((Log: any) => {
                            return {
                                Id: Log.Id,
                                LogType: 0,
                                PictureURL: Log.PictureURL,
                                UserRealName: Log.UserRealName,
                                EntityName: Log.EntityName,
                                ActivityType: Log.ActivityType,
                                ActivityTime: Log.ActivityTime,
                                NumberOfFollowUps: Log.NumberOfFollowUps,
                                EmailsString: Log.EmailsString
                            } as ICampaignActivityLog
                        }),
                        MailLogs: Data.MailLogs.map((Log: any) => {
                            return {
                                Id: Log.Id,
                                LogType: 1,
                                PictureURL: Log.PictureURL,
                                UserRealName: Log.UserRealName,
                                EntityName: Log.EntityName,
                                ActivityType: Log.ActivityType,
                                ActivityTime: Log.ActivityTime
                            } as IMailActivityLog
                        }),
                        TemplateLogs: Data.TemplateLogs.map((Log: any) => {
                            return {
                                Id: Log.Id,
                                LogType: 2,
                                PictureURL: Log.PictureURL,
                                UserRealName: Log.UserRealName,
                                EntityName: Log.EntityName,
                                ActivityType: Log.ActivityType,
                                ActivityTime: Log.ActivityTime,
                                Type: Log.Type,
                                Topic: Log.Topic,
                                Content: Log.Content
                            } as ITemplateActivityLog
                        })
                    };

                    Dispatch(ActivityHistoryActions.UpdateActivityHistory(NewActivityHistory));
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