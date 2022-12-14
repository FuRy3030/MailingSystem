import styles from './MailsDataTable.module.css';

import AuthContext from '../../context-store/auth-context';

import { useEffect, useContext, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { GetMailsStatistics, GetRecentMails, MailsActions } from '../../redux-store/mail-data';

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

function MailsDataTableStatistics(props: any) {
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const FirstMailId: number | undefined = useMemo(() => {
        return props.MailAggregateStatistics[0] ? props.MailAggregateStatistics[0].id : undefined;
    }, [props.MailAggregateStatistics[0]]);

    const [TableRows, setTableRows] = useState<GridRowsProp>([]);
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    console.log(props.MailAggregateStatistics);
    console.log(TableRows);

    useEffect(() => {
        if (props.MailAggregateStatistics === null || props.MailAggregateStatistics === undefined || 
            props.MailAggregateStatistics.length == 0) 
        {
            let isSend: boolean = false;
            if (Ctx?.accessToken.token != undefined && Ctx?.accessToken.token != '' && isSend == false) {
                Dispatch(GetMailsStatistics(Ctx?.accessToken.token));
            }      
            else if (isSend == false) {
                const TokenObject: string | null = sessionStorage.getItem('accessToken');
                if (TokenObject != null) {
                    Dispatch(GetMailsStatistics((JSON.parse(TokenObject)).token));
                }
            }
            
            return () => {
                isSend = true;
            }
        }
    }, []);

    useEffect(() => {
        setTableRows([...(props.MailAggregateStatistics)]);
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
                columns={props.Columns} 
                components={{Toolbar: AdjustedToolbar}}
                checkboxSelection={true}
                onSelectionModelChange={(newSelectionModel) => {
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
    );
};

export default MailsDataTableStatistics;