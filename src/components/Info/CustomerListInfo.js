"use client";
import { Button, CardHeader } from "@/components/Global";
import GiftCampaignCustomerTable from "@/components/Tables/GiftCampaignCustomerTable";
import { Card, CardContent, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function CustomerListInfo(props) {
  const {
    data,
    loading,
    rowCount,
    openCustomerForm,
    setSortModel,
    paginationModel,
    setPaginationModel,
  } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const renderCustomerListAction = () => {
    return (
      <Stack direction="row" spacing={2} sx={{ justifySelf: "end" }}>
        <Button
          variant="contained"
          color="white"
          sx={{ width: "150px" }}
          onClick={() => {
            window.location = "/auth/gift_campaigns/new";
          }}
        >
          Import Customer
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "150px" }}
          onClick={openCustomerForm}
        >
          Add Customer
        </Button>
      </Stack>
    );
  };

  return (
    <Card variant="outlined">
      <CardHeader
        action={!matches && renderCustomerListAction()}
        title="Customer List : แสดงจำนวน Customer ใน List"
        actionWidth="50%"
      />
      <CardContent>
        {matches && renderCustomerListAction()}
        <GiftCampaignCustomerTable
          data={data}
          loading={loading}
          rowCount={rowCount}
          setSortModel={setSortModel}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </CardContent>
    </Card>
  );
}
