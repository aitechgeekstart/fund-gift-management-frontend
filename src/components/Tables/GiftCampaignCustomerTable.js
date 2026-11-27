import { DataGrid, LoadingScreen, StatusLabel } from "@/components/Global";
import dayjs from "@/helpers/dayjs";
import { useAuth } from "@/hooks/use-auth";
import FeedIcon from "@mui/icons-material/Feed";
import { Box, Grid, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { isEmpty } from "lodash";

export default function GiftCampaignCustomerTable(props) {
  const {
    data,
    loading,
    rowCount,
    paginationModel,
    setPaginationModel,
    setSortModel,
  } = props;
  const { can } = useAuth();

  if (loading && isEmpty(data)) {
    return <LoadingScreen />;
  } else if (isEmpty(data)) {
    return (
      <Grid
        container
        direction="row"
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={12}>No Data</Grid>
      </Grid>
    );
  }

  const columns = [
    {
      disableColumnMenu: true,
      sortable: false,
      field: "action",
      headerName: "",
      width: 80,
      renderCell: (params) => {
        return (
          can(["api/v1/user/gift_campaigns#show"]) && (
            <Tooltip title="Info" placement="top">
              <IconButton
                aria-label="Info"
                size="small"
                onClick={() => {
                  window.location = `/auth/gift_campaigns/${params.row.id}`;
                }}
              >
                <FeedIcon fontSize="small" color="info" />
              </IconButton>
            </Tooltip>
          )
        );
      },
    },
    {
      disableColumnMenu: true,
      field: "created_at",
      headerName: "Created Date",
      minWidth: 150,
      valueGetter: (value, row) => {
        return dayjs(row.created_at).format("DD MMM YYYY");
      },
    },
    {
      disableColumnMenu: true,
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 160,
      valueGetter: (value, row) => {
        return row.name || "-";
      },
    },
    {
      disableColumnMenu: true,
      field: "eligible",
      headerName: "Number of Customer",
      minWidth: 160,
      valueGetter: (value, row) => {
        return row.eligible || "0";
      },
    },
    {
      disableColumnMenu: true,
      field: "redeemed",
      headerName: "Claimed",
      minWidth: 80,
      valueGetter: (value, row) => {
        return row.redeemed || "0";
      },
    },
    {
      disableColumnMenu: true,
      field: "delivered",
      headerName: "Unclaimed",
      minWidth: 80,
      valueGetter: (value, row) => {
        return row.delivered || "0";
      },
    },
    {
      disableColumnMenu: true,
      field: "created_by",
      headerName: "Created by",
      minWidth: 120,
      valueGetter: (value, row) => {
        return row.created_by || "-";
      },
    },
    {
      disableColumnMenu: true,
      field: "gift_period",
      headerName: "Gift Period",
      minWidth: 180,
      valueGetter: (value, row) => {
        return `${dayjs(row.gift_valid_from).format("DD MMM YYYY")} ถึง ${dayjs(row.gift_valid_until).format("DD MMM YYYY")}`;
      },
    },
    {
      disableColumnMenu: true,
      field: "status",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      width: 130,
      renderCell: (params) => {
        return <StatusLabel label={params.row.status} />;
      },
    },
  ];

  return (
    <>
      <Box>
        <DataGrid
          columns={columns}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={rowCount}
          rows={data}
          setSortModel={setSortModel}
        />
      </Box>
    </>
  );
}
