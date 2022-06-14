import { DataGrid, DataGridProps, ptBR } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
  },
});

export default function SimpleTable(props: DataGridProps) {
  const classes = useStyles();

  return (
    <DataGrid
      localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      classes={{ root: classes.root }}
      autoHeight
      disableSelectionOnClick
      {...props}
    />
  );
}
