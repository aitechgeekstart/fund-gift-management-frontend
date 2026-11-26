"use client";
import { LoadingScreen } from "@/components/Global";
import CustomerListInfo from "@/components/Info/CustomerListInfo";
import DigitalMessageInfo from "@/components/Info/DigitalMessageInfo";
import GiftCampaignInfo from "@/components/Info/GiftCampaignInfo";
import PostMessageInfo from "@/components/Info/PostMessageInfo";
import dayjs from "@/helpers/dayjs";
import { useApplicationConfig } from "@/hooks/use-application-config";
import { useGiftCampaign } from "@/swr/use-gift-campaigns";
import { Grid } from "@mui/material";
import { isEmpty } from "lodash";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const params = useParams();
  const applicationConfig = useApplicationConfig();

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
        },
      ]);
    }
  }, [isValidating, data]);

  if (isEmpty(data) || (isValidating && isEmpty(data))) {
    return <LoadingScreen />;
  }

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      sx={{ justifyContent: "center", alignItems: "baseline" }}
    >
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <GiftCampaignInfo
          name={data.name}
          status={data.status}
          imageUrl={data.images[0]?.url}
          digitalStockLimit={data.stock.digital.limit}
          digitalStockRedeemed={data.stock.digital.redeemed}
          physicalStockLimit={data.stock.physical.limit}
          physicalStockRedeemed={data.stock.physical.redeemed}
          detail={data.detail}
          giftPeriod={`${dayjs(data.gift_valid_from).format("DD MMM YYYY")} ถึง ${dayjs(data.gift_valid_until).format("DD MMM YYYY")}`}
          createdAt={data.created_at}
          createdBy={data.created_by}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }} container spacing={2}>
        <Grid size={12}>
          <DigitalMessageInfo
            subject={data.message_templates?.digital_redeem?.email_subject}
            body={data.message_templates?.digital_redeem?.email_body}
          />
        </Grid>

        <Grid size={12}>
          <PostMessageInfo
            subject={data.message_templates?.post_redeem?.email_subject}
            body={data.message_templates?.post_redeem?.email_body}
          />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <CustomerListInfo />
      </Grid>
    </Grid>
  );
}
