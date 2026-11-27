import { decorate } from "@/decorators";
import useCustomSWR from "@/swr/use-custom-swr";

export function useGiftCampaignCustomers(
  isReady = false,
  giftCampaignId,
  params = {},
) {
  const swr = useCustomSWR(
    isReady && !!giftCampaignId,
    `/api/v1/user/gift_campaigns/${giftCampaignId}/gift_campaign_customers`,
    true,
    null,
    params,
  );
  const data = swr.data?.gift_campaign_customers
    ? decorate(swr.data?.gift_campaign_customers, "giftCampaignCustomer")
    : [];
  const rowCount =
    swr.data && swr.data?.response.status === 200 ? swr.data.total_count : 0;

  return {
    ...swr,
    data,
    rowCount,
  };
}
