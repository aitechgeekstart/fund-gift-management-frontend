import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

const StyledDataGrid = styled((props) => <DataGrid {...props} />)(() => ({
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    // color: "#687182",
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-virtualScroller": {
    minHeight: "70px",
  },
}));

export default function GKDataGrid(props) {
  let {
    density,
    disableNoDataText,
    loading,
    paginationModel,
    rowCount,
    rowsPerPageOptions,
    onPaginationModelChange,
    setSortModel,
    headerHeight,
    controlState = {
      enablePagination: true,
      enableSorting: true,
      enableFiltering: false,
    }, // New prop to control various states
    ...others
  } = props;

  const { enablePagination, enableSorting, enableFiltering } = controlState;

  density ||= "standard";
  rowsPerPageOptions ||= [20, 50, 100];
  paginationModel ||= { page: 0, pageSize: 20 };

  // Configure the initialState based on enablePagination
  const initialState = enablePagination
    ? {
        pagination: {
          paginationModel: {
            pageSize: paginationModel.pageSize,
            page: paginationModel.page,
          },
        },
      }
    : {};

  return (
    <StyledDataGrid
      {...others}
      density={density}
      columnHeaderHeight={headerHeight || 40}
      disableColumnFilter={!enableFiltering}
      disableColumnSelector
      disableSelectionOnClick
      hideFooterSelectedRowCount
      loading={loading}
      rowCount={rowCount}
      hideFooter={!enablePagination}
      paginationMode={enablePagination ? "server" : "undefined"}
      sortingMode={enableSorting ? "server" : "undefined"}
      initialState={initialState}
      paginationModel={paginationModel}
      pageSizeOptions={enablePagination ? rowsPerPageOptions : "undefined"}
      onPaginationModelChange={
        enablePagination ? onPaginationModelChange : "undefined"
      }
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            {!disableNoDataText ? "No Data" : ""}
          </Stack>
        ),
      }}
      onSortModelChange={
        enableSorting
          ? (newSortModel) => setSortModel(newSortModel[0])
          : "undefined"
      }
      sx={{
        "& .MuiTablePagination-toolbar": {
          display: enablePagination ? "flex" : "none",
        },
      }}
    />
  );
}
