import styles from './MailsDataTable.module.css';

import AuthContext from '../../context-store/auth-context';

import { useEffect, useContext, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { GetOverview } from '../../redux-store/mail-data';

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
        <GridToolbarColumnsButton className={styles.ToolbarContainerButtonSmaller} />
        <GridToolbarFilterButton className={styles.ToolbarContainerButtonSmaller} />
        <GridToolbarDensitySelector className={styles.ToolbarContainerButtonSmaller} />
      </GridToolbarContainer>
    );
};

function MailsDataTableSuggestions() {
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const SuggestedMails = useAppSelector(state => state.Mails.Overview.SuggestedMails);
    const FirstMailId: number | undefined = useMemo(() => {
        return SuggestedMails[0] ? SuggestedMails[0].id : undefined;
    }, [SuggestedMails[0]]);

    const [TableRows, setTableRows] = useState<GridRowsProp>([]);
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        if (SuggestedMails === null || SuggestedMails === undefined || SuggestedMails.length == 0) {
            let isSend: boolean = false;
            if (Ctx?.accessToken.token != undefined && Ctx?.accessToken.token != '' && isSend == false) {
                Dispatch(GetOverview(Ctx?.accessToken.token));
            }      
            else if (isSend == false) {
                const TokenObject: string | null = sessionStorage.getItem('accessToken');
                if (TokenObject != null) {
                    Dispatch(GetOverview((JSON.parse(TokenObject)).token));
                }
            }
            
            return () => {
                isSend = true;
            }
        }
    }, []);

    useEffect(() => {
        setTableRows([...SuggestedMails]);
    }, [FirstMailId]);

    // useEffect(() => {
    //     const RecipientsEmails: Array<string> = [];
    //     selectionModel.forEach(IndexModel => {
    //         const MailAdress = TableRows.find(Mail => Mail.id == IndexModel);

    //         if (MailAdress) {
    //             RecipientsEmails.push(MailAdress.MailAddress);
    //         }
    //     });
    //     Dispatch(MailsActions.UpdateRecipients(RecipientsEmails));
    // }, [selectionModel]);

    const Columns: GridColumns = [
        { 
            field: 'MailAddress', 
            headerName: 'Email', 
            flex: 1.15, 
            type: 'string',
            minWidth: 150,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
        },      
        { 
            field: 'NumberOfEmailsSent', 
            headerName: 'Ilość wysłanych maili', 
            flex: 0.3, 
            type: 'number',
            minWidth: 40,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
            align: 'center'
        },
        { 
            field: 'DateOfLastEmailSent', 
            headerName: 'Data ostatniego maila', 
            flex: 1, 
            type: 'dateTime',
            minWidth: 125,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center',
            align: 'center'
        }
    ];

    return (
        <div className={styles.DataTableWrapperSuggestions}>
            <DataGrid 
                autoHeight
                initialState={{
                    pagination: {
                      pageSize: 8
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
                sx={{
                    border: 'none',
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

export default MailsDataTableSuggestions;