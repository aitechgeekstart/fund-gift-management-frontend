"use client";
import { convertToFormData } from "@/helpers/convertToFormData";
import { Alert, Card, CardContent } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import GiftCampaignForm from "/src/components/Forms/GiftCampaignForm";
import { CardHeader } from "/src/components/Global";
import { useApplicationConfig } from "/src/hooks/use-application-config";
import { useAuth } from "/src/hooks/use-auth";

export default function Page() {
  const applicationConfig = useApplicationConfig();
  const { fetcherWithToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    applicationConfig.setBreadcrumbs([
      {
        name: "Gift Management",
        to: "/gift_campaigns",
      },
      {
        name: <strong>{"New"}</strong>,
      },
    ]);
  }, []);

  const handleSubmit = async (_params) => {
    setLoading(true);
    setError(null);
    const allParams = convertToFormData(_params, "gift_campaign", ["images"]);
    const response = await fetcherWithToken("/api/v1/user/gift_campaigns", {
      method: "POST",
      body: allParams,
      is_form_data: true,
    });

    if (response && response.success) {
      enqueueSnackbar("Created", {
        variant: "success",
      });
      routerBack();
    } else {
      enqueueSnackbar(response.error, {
        variant: "warning",
      });
      setLoading(false);
    }
  };

  const routerBack = () => {
    window.location = "/auth/gift_campaigns";
  };

  return (
    <Card variant="outlined">
      <CardHeader title="Create Gift" />
      <CardContent>
        {error && <Alert severity="warning">{error}</Alert>}
        <GiftCampaignForm
          handleSubmit={handleSubmit}
          loading={loading}
          routerBack={routerBack}
          setLoading={setLoading}
        />
      </CardContent>
    </Card>
  );
}
