import { createSlice, PayloadAction, createAsyncThunk  } from '@reduxjs/toolkit';
import Config from '../config/config';
import { ITemplateBuilder, IUserTemplate, IUserTemplateForEdit } from './redux-entities/types';

const moment = require('moment-timezone');

export const GetTemplates = createAsyncThunk(
    'templates/getalltemplates',
    async (Token: string) => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Token}` },
            };

            const Response = await fetch(`${Config.sourceURL}/Templates/getall?Token=${Token}`, requestOptions);

            if (Response.ok) {
                const ParsedResponse = await Response.json();

                const UserTemplates = ParsedResponse.map((Template: any) => {
                    return { 
                        TemplateId: Template.TemplateId, 
                        OwnerEmail: Template.OwnerEmail,
                        Name: Template.Name,
                        Type: Template.Type,
                        Topic: Template.Topic,
                        Content: Template.Content,
                        TimePassedInDays: Template.TimePassedInDays,
                        CreationDate: moment.utc(Template.CreationDate)
                            .local().format('YYYY-MM-DD HH:mm:ss')
                    }
                });

                console.log(UserTemplates);
                
                return UserTemplates as Array<IUserTemplate>;
            }
            else {
                return new Array<IUserTemplate>;
            }
        }
        catch {
            return new Array<IUserTemplate>;
        }
    }
);

interface ITemplatesData {
    TemplateBuilder: ITemplateBuilder;
    Templates: Array<IUserTemplate>;
    HTTPStates: {
        GetTemplates: {
            isLoading: boolean;
            Error: boolean;
        };
    };
};

const InitialTemplatesState: ITemplatesData = { 
    TemplateBuilder: {
        Name: '',
        Type: 0,
        Topic: '',
        Content: ''
    },
    Templates: new Array<IUserTemplate>,
    HTTPStates: {
        GetTemplates: {
            isLoading: false,
            Error: false
        }
    }
};

const TemplatesSlice = createSlice({
	name: 'TemplatesData',
	initialState: InitialTemplatesState,
	reducers: {
        AddTemplate(State, Action: PayloadAction<IUserTemplate>) {
			State.Templates = [Action.payload, ...State.Templates];
		},
        UpdateTemplate(State, Action: PayloadAction<IUserTemplateForEdit>) {
            const CurrentTemplatesArray: IUserTemplate[] = State.Templates;
            const CurrentNewTemplateVersion = Action.payload;

            const ElementIndex: number = CurrentTemplatesArray.findIndex(Template => 
                Template.TemplateId == Action.payload.TemplateId);

            CurrentTemplatesArray[ElementIndex].Name = CurrentNewTemplateVersion.Name;
            CurrentTemplatesArray[ElementIndex].Topic = CurrentNewTemplateVersion.Topic;
            CurrentTemplatesArray[ElementIndex].Type = CurrentNewTemplateVersion.Type;
            CurrentTemplatesArray[ElementIndex].Content = CurrentNewTemplateVersion.Content;

			State.Templates = [...CurrentTemplatesArray];
        },
        DeleteTemplate(State, Action: PayloadAction<number>) {
			const CurrentTemplatesArray: IUserTemplate[] = State.Templates;

            const ElementIndex: number = CurrentTemplatesArray.findIndex(Template => 
                Template.TemplateId == Action.payload);

            CurrentTemplatesArray.splice(ElementIndex, 1);
            State.Templates = [...CurrentTemplatesArray];    
		},
    },
    extraReducers: (builder) => {
        builder.addCase(GetTemplates.pending, (state) => {
            state.HTTPStates.GetTemplates.isLoading = true;
            state.HTTPStates.GetTemplates.Error = false;
        });

        builder.addCase(GetTemplates.fulfilled, (state, action) => {
            state.HTTPStates.GetTemplates.isLoading = false;
            state.HTTPStates.GetTemplates.Error = false;
            state.Templates = action.payload;
        });

        builder.addCase(GetTemplates.rejected, (state) => {
            state.HTTPStates.GetTemplates.isLoading = false;
            state.HTTPStates.GetTemplates.Error = true;
        });
    }
});

export const TemplatesActions = TemplatesSlice.actions;

export default TemplatesSlice.reducer;

