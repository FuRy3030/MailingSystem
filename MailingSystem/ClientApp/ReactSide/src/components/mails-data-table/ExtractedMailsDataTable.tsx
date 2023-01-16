import styles from './MailsDataTable.module.css';

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';

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
import { IExtractedMail } from '../../redux-store/redux-entities/types';

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

function ExtractedMailsDataTable(props: any) {
    const ExtractedMails = useAppSelector(state => state.Mails.ExtractedMails);
    const FirstMailId: number | undefined = useMemo(() => {
        return ExtractedMails[0] ? ExtractedMails[0].id : undefined;
    }, [ExtractedMails[0]]);

    const [TableRows, setTableRows] = useState<GridRowsProp>([]);
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

    useEffect(() => {
        setTableRows([...(ExtractedMails)]);
    }, [FirstMailId]);

    useEffect(() => {
        const SelectedEmails: Array<IExtractedMail> = [];

        selectionModel.forEach(IndexModel => {
            const SelectedTableEntity = TableRows.find(Row => Row.id == IndexModel);

            if (SelectedTableEntity) {
                SelectedEmails.push({
                    id: SelectedTableEntity.id,
                    MailAddress: SelectedTableEntity.MailAddress,
                    CompanyName: SelectedTableEntity.CompanyName,
                    DoesEmailExists: SelectedTableEntity.DoesEmailExists
                } as IExtractedMail);
            }
        });

        props.UpdateSelectedNewEmails(SelectedEmails);
    }, [selectionModel]);

    const Columns: GridColumns = [
        { 
            field: 'MailAddress', 
            headerName: 'Email', 
            flex: 2, 
            type: 'string',
            minWidth: 275,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center'
        },      
        { 
            field: 'CompanyName', 
            headerName: 'Nazwa Firmy', 
            flex: 1.5, 
            type: 'string',
            minWidth: 200,
            headerClassName: styles.DataTableHeader,
            headerAlign: 'center'
        },
        { 
            field: 'DoesEmailExists', 
            headerName: 'Czy adres już istnieje', 
            flex: 1, 
            type: 'boolean',
            minWidth: 125,
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
                    setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
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

export default ExtractedMailsDataTable;