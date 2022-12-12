import styles from './MailsDataTable.module.css';

import AuthContext from '../../context-store/auth-context';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { useEffect, useContext, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { GetRecentMails, MailsActions } from '../../redux-store/mail-data';
import { IRecentEmail } from '../../redux-store/redux-entities/types';
import { UIActions } from '../../redux-store/ui';
import Config from '../../config/config';

import { 
    GridRowsProp, 
    GridRowModesModel, 
    GridRowModes, 
    GridColumns, 
    GridRowParams,
    MuiEvent,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport
} from '@mui/x-data-grid';

const moment = require('moment-timezone');

interface DataTableOperations {
    EditRowRequest: (EditedRow: GridRowModel, Token: string) => 
        Promise<{TextResponse: string, EditedElement: IRecentEmail}>;
    DeleteRowRequest: (MailId: number, Token: string) => Promise<{TextResponse: string, Id: number}>;
};

const DeleteRow: DataTableOperations["DeleteRowRequest"] = (MailId: number, Token: string) => {
    return new Promise(function(resolve, reject) {
        try {
            const requestOptions = {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Token}` 
                }
            };

            fetch(`${Config.sourceURL}/Mails/delete?Token=${Token}&MailId=${MailId}`, requestOptions)
                .then(Response => {
                    if (Response.ok && Response.body) {
                        return Response.text();
                    }
                    else {
                        reject('Error');
                    }
                }).then(ResponseText => {
                    if (ResponseText) {
                        resolve({
                            TextResponse: ResponseText, 
                            Id: MailId
                        });
                    }
                });
        }
        catch {
            reject('Error');
        }
    });
};

const EditRow: DataTableOperations["EditRowRequest"] = (EditedRow: GridRowModel, Token: string) => {
    return new Promise(function(resolve, reject) {
        try {
            const CurrentRecentMailAfterEdit: IRecentEmail = {
                id: EditedRow.id,
                MailId: EditedRow.MailId,
                MailAddress: EditedRow.MailAddress,
                OrganizationName: EditedRow.OrganizationName,
                UserWhoAdded: EditedRow.UserWhoAdded,
                UserVerificatiorName: EditedRow.UserVerificatiorName,
                NumberOfEmailsSent: EditedRow.NumberOfEmailsSent,
                DateOfLastEmailSent: typeof EditedRow.DateOfLastEmailSent === 'string' ? 
                    (new Date(EditedRow.DateOfLastEmailSent)).toISOString() : 
                    EditedRow.DateOfLastEmailSent.toISOString()
            };

            const requestOptions = {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Token}` 
                },
                body: JSON.stringify({
                    RecentEmail: CurrentRecentMailAfterEdit,
                    AccessToken: Token
                })
            };

            fetch(`${Config.sourceURL}/Mails/edit`, requestOptions)
                .then(Response => {
                    if (Response.ok && Response.body) {
                        return Response.text();
                    }
                    else {
                        reject('Error');
                    }
                }).then(ResponseText => {
                    if (ResponseText) {
                        resolve({
                            TextResponse: ResponseText, 
                            EditedElement: CurrentRecentMailAfterEdit
                        });
                    }
                });
        }
        catch {
            reject('Error');
        }
    });
};

function AdjustedToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton className={styles.ToolbarContainerButton} />
        <GridToolbarFilterButton className={styles.ToolbarContainerButton} />
        <GridToolbarDensitySelector className={styles.ToolbarContainerButton} />
        <GridToolbarExport className={styles.ToolbarContainerButton} />
      </GridToolbarContainer>
    );
};

function MailsDataTable() {
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const AllRecentMails = useAppSelector(state => state.Mails.RecentMails);
    const FirstMailId: number | undefined = useMemo(() => {
        return AllRecentMails[0] ? AllRecentMails[0].MailId : undefined;
    }, [AllRecentMails[0]]);

    const [TableRows, setTableRows] = useState<GridRowsProp>([]);
    const [RowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

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
    }, []);

    useEffect(() => {
        if (FirstMailId) {
            setTableRows([...AllRecentMails]);
        }
    }, [FirstMailId]);

    const HandleRowEditStart = (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
        event.defaultMuiPrevented = true;
    };
    
    const HandleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const ProcessRowUpdate = (NewRow: GridRowModel) => {
        if (Ctx?.accessToken.token) {
            EditRow({...NewRow}, Ctx?.accessToken.token)
                .then(ServerResponse => {
                    Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                        type: 'DataTableError', 
                        isVisible: false
                    }));

                    Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                        type: 'DataTableSuccess', 
                        isVisible: false
                    }));

                    if (ServerResponse.TextResponse == 'Success') {
                        Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                            type: 'DataTableSuccess', 
                            isVisible: true
                        }));

                        Dispatch(MailsActions.EditRecentMail(ServerResponse.EditedElement));

                        const UpdatedRow = { ...NewRow, isNew: false };
                        setTableRows(TableRows.map((Row) => (Row.id === NewRow.id ? UpdatedRow : Row)));
                        return UpdatedRow;
                    }
                    else {
                        Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                            type: 'DataTableError', 
                            isVisible: true
                        }));
                    }
                })
                .catch(error => {
                    Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                        type: 'DataTableError', 
                        isVisible: true
                    }));
                });
        }

        const UpdatedRow = { ...NewRow, isNew: false };
        setTableRows(TableRows.map((Row) => (Row.id === NewRow.id ? UpdatedRow : Row)));
        return UpdatedRow;
    };

    const HandleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...RowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    
    const HandleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...RowModesModel, [id]: { mode: GridRowModes.View } });
    };
    
    const HandleDeleteClick = (id: GridRowId) => () => {
        console.log(id);
        const CurrentRecentEmail = TableRows.find((Row) => Row.id === id);
        if (CurrentRecentEmail && Ctx?.accessToken.token) {
            DeleteRow(CurrentRecentEmail.MailId, Ctx?.accessToken.token)
            .then(ServerResponse => {
                Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                    type: 'DataTableErrorDelete', 
                    isVisible: false
                }));

                Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                    type: 'DataTableSuccess', 
                    isVisible: false
                }));

                if (ServerResponse.TextResponse == 'Success') {
                    Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                        type: 'DataTableSuccess', 
                        isVisible: true
                    }));

                    Dispatch(MailsActions.DeleteRecentEmail(ServerResponse.Id));
                    setTableRows(TableRows.filter((Row) => Row.id !== id));
                }
                else {
                    Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                        type: 'DataTableErrorDelete', 
                        isVisible: true
                    }));
                }
            })
            .catch(error => {
                Dispatch(UIActions.setRecentMailsSnackbarVisibility({
                    type: 'DataTableErrorDelete', 
                    isVisible: true
                }));
            });
        }
    };
    
    const HandleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
          ...RowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = TableRows.find((Row) => Row.id === id);
        if (editedRow!.isNew) {
          setTableRows(TableRows.filter((Row) => Row.id !== id));
        }
    };

    const Columns: GridColumns = [
        { 
            field: 'MailId', 
            headerName: 'Id', 
            flex: 0.3, 
            type: 'number',
            minWidth: 40,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
            align: 'center'
        },
        { 
            field: 'MailAddress', 
            headerName: 'Email', 
            flex: 1.15, 
            type: 'string',
            minWidth: 150,
            editable: true,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
        },
        { 
            field: 'OrganizationName', 
            headerName: 'Alias organizacji', 
            flex: 0.5, 
            type: 'string',
            minWidth: 75,
            editable: true,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
        },
        { 
            field: 'UserWhoAdded', 
            headerName: 'Członek organizacji', 
            flex: 0.75, 
            type: 'string',
            minWidth: 75,
            editable: true,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
        },
        { 
            field: 'NumberOfEmailsSent', 
            headerName: 'Ilość wysłanych maili', 
            flex: 0.3, 
            type: 'number',
            minWidth: 40,
            editable: true,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
            align: 'center'
        },
        { 
            field: 'DateOfLastEmailSent', 
            headerName: 'Data ostatniego maila', 
            flex: 1.15, 
            type: 'dateTime',
            minWidth: 150,
            editable: true,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edycja',
            flex: 0.75,
            minWidth: 75,
            cellClassName: 'actions',
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
            getActions: ({ id }) => {
              const isInEditMode = RowModesModel[id]?.mode === GridRowModes.Edit;
      
              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={HandleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={HandleCancelClick(id)}
                    color="inherit"
                  />,
                ];
              }
      
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={HandleEditClick(id)}
                  color="inherit"
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={HandleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            }
        }
    ];

    return (
        <div className={styles.DataTableWrapper}>
            <DataGrid 
                autoHeight 
                editMode="row"
                initialState={{
                    pagination: {
                      pageSize: 25
                    },
                }}
                rows={TableRows} 
                columns={Columns} 
                components={{Toolbar: AdjustedToolbar}}
                rowModesModel={RowModesModel}
                onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
                onRowEditStart={HandleRowEditStart}
                onRowEditStop={HandleRowEditStop}
                processRowUpdate={ProcessRowUpdate}
                experimentalFeatures={{newEditingApi: true}}
                sx={{
                    boxShadow: 2,
                    border: 1,
                    borderColor: 'rgb(225, 225, 231)',
                    '& .MuiDataGrid-cell': {
                      color: '#303545',
                      fontFamily: `'Quicksand', sans-serif`,
                      fontWeight: 600,
                      fontSize: `clamp(10px, 1vw, 40px)`
                    },
                }}
            />
        </div>
    )
};

export default MailsDataTable;