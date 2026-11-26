"use client";
import { Button, CardHeader, DatePicker, Search } from "@/components/Global";
import GiftCampaignTable from "@/components/Tables/GiftCampaignTable";
import { useApplicationConfig } from "@/hooks/use-application-config";
import { useAuth } from "@/hooks/use-auth";
import { useGiftCampaigns } from "@/swr/use-gift-campaigns";
import { Card, CardContent, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

const defaultFilters = {
  q: "",
  status: "",
  starts_at: "",
  ends_at: "",
};

export default function Page() {
  const { can } = useAuth();
  const applicationConfig = useApplicationConfig();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [filters, setFilters] = useImmer(defaultFilters);
  const [sortModel, setSortModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });

  const { data, isValidating, rowCount, mutate } = useGiftCampaigns(true, {
    page: paginationModel.page + 1,
    per_page: paginationModel.pageSize,
    q: filters.q,
    sort_field: sortModel?.field,
    sort_order: sortModel?.sort,
  });

  useEffect(() => {
    applicationConfig.setBreadcrumbs([]);
  }, []);

  const onFiltersChange = (key, value) => {
    setFilters((draft) => {
      draft[key] = value;
    });
  };

  const renderAction = () => {
    return (
      <Grid container spacing={1} sx={{ justifyContent: "end " }}>
        {can(["api/v1/user/gift_campaigns#create"]) && (
          <Grid size={{ xs: 12, sm: 5, md: 3.5 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                window.location = "/auth/gift_campaigns/new";
              }}
            >
              New Gift
            </Button>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Card variant="outlined">
      <CardHeader
        action={!matches && renderAction()}
        title="Gift Management"
        actionWidth="50%"
      />
      <CardContent>
        {matches && renderAction()}
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Search
              setSearchTerm={(value) => onFiltersChange("q", value)}
              setPaginationModel={setPaginationModel}
              pageSize={paginationModel.pageSize}
              md={12}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker
              type="date"
              isClearable
              value={filters.starts_at}
              placeholder="Period Start Date"
              onRemove={() => onFiltersChange("starts_at", "")}
              onChange={(e) => onFiltersChange("starts_at", e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker
              type="date"
              isClearable
              value={filters.ends_at}
              placeholder="Period Ended Date"
              onRemove={() => onFiltersChange("ends_at", "")}
              onChange={(e) => onFiltersChange("ends_at", e)}
            />
          </Grid>
        </Grid>
        <GiftCampaignTable
          data={data}
          loading={isValidating}
          mutate={mutate}
          rowCount={rowCount}
          setSortModel={setSortModel}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </CardContent>
    </Card>
  );
}
