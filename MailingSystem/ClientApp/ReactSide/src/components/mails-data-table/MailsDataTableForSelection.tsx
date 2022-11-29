import styles from './MailsDataTable.module.css';

import AuthContext from '../../context-store/auth-context';

import { useEffect, useContext, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { GetRecentMails, MailsActions } from '../../redux-store/mail-data';

import { 
    GridRowsProp, 
    GridColumns, 
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridSelectionModel
} from '@mui/x-data-grid';

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

function MailsDataTableSelection() {
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const AllRecentMails = useAppSelector(state => state.Mails.RecentMails);
    const FirstMailId: number | undefined = useMemo(() => {
        return AllRecentMails[0] ? AllRecentMails[0].MailId : undefined;
    }, [AllRecentMails[0]]);

    const [TableRows, setTableRows] = useState<GridRowsProp>([]);
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (AllRecentMails === null || AllRecentMails === undefined || AllRecentMails.length == 0) {
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
        }
    }, []);

    useEffect(() => {
        if (FirstMailId) {
            setTableRows([...AllRecentMails]);
        }
    }, [FirstMailId]);

    useEffect(() => {
        const RecipientsEmails: Array<string> = [];
        selectionModel.forEach(IndexModel => {
            const MailAdress = TableRows.find(Mail => Mail.id == IndexModel);

            if (MailAdress) {
                RecipientsEmails.push(MailAdress.MailAddress);
            }
        });
        Dispatch(MailsActions.UpdateRecipients(RecipientsEmails));
    }, [selectionModel]);

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
                checkboxSelection={true}
                onSelectionModelChange={(newSelectionModel) => {
                    console.log(newSelectionModel);
                    setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
                experimentalFeatures={{newEditingApi: true}}
                sx={{
                    boxShadow: '0px 0px 7px -1px rgb(248, 249, 250)',
                    border: '1px solid rgb(225, 225, 231)',
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

export default MailsDataTableSelection;