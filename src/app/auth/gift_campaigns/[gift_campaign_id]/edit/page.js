"use client";
import { convertToFormData } from "@/helpers/convertToFormData";
import { useGiftCampaign } from "@/swr/use-gift-campaigns";
import { Alert, Card, CardContent } from "@mui/material";
import { isEmpty } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import GiftCampaignForm from "/src/components/Forms/GiftCampaignForm";
import { CardHeader, LoadingScreen } from "/src/components/Global";
import { useApplicationConfig } from "/src/hooks/use-application-config";
import { useAuth } from "/src/hooks/use-auth";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const applicationConfig = useApplicationConfig();
  const { fetcherWithToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data, isValidating } = useGiftCampaign(
    !!params.gift_campaign_id,
    params.gift_campaign_id,
  );

  useEffect(() => {
    if (!isValidating && !isEmpty(data)) {
      applicationConfig.setBreadcrumbs([
        {
          name: "Gift Management",
          to: "/gift_campaigns",
        },
        {
          name: <strong>{data.name}</strong>,
          to: `/gift_campaigns/${params.gift_campaign_id}`,
        },
        {
          name: <strong>{"Edit"}</strong>,
        },
      ]);
    }
  }, [isValidating, data]);

  if (isValidating && isEmpty(data)) {
    return <LoadingScreen />;
  }

  const handleSubmit = async (_params) => {
    setLoading(true);
    setError("");
    const allParams = convertToFormData(_params, "gift_campaign", ["images"]);
    const response = await fetcherWithToken(
      `/api/v1/user/gift_campaigns/${params.gift_campaign_id}`,
      {
        method: "PATCH",
        body: allParams,
      },
    );

    if (response && response.success) {
      enqueueSnackbar("Updated", {
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
    window.location = `/auth/gift_campaigns/${params.gift_campaign_id}`;
  };

  return (
    <Card variant="outlined">
      <CardHeader title="Edit Gift" />
      <CardContent>
        {error && <Alert severity="warning">{error}</Alert>}
        {!isEmpty(data) && (
          <GiftCampaignForm
            handleSubmit={handleSubmit}
            initialData={data}
            loading={loading}
            routerBack={routerBack}
            setLoading={setLoading}
          />
        )}
      </CardContent>
    </Card>
  );
}
