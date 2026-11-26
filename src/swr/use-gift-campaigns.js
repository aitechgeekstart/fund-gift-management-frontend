import { decorate } from "/src/decorators";
import useCustomSWR from "/src/swr/use-custom-swr";

export function useGiftCampaigns(isReady = false, params = {}) {
  const swr = useCustomSWR(
    isReady,
    "/api/v1/user/gift_campaigns",
    true,
    null,
    params,
  );
  const data = swr.data?.gift_campaigns
    ? decorate(swr.data?.gift_campaigns, "giftCampaign")
    : [];
  const rowCount =
    swr.data && swr.data?.response.status === 200 ? swr.data.total_count : 0;

  return {
    ...swr,
    data,
    rowCount,
  };
}

export function useGiftCampaign(isReady = false, id, params = {}) {
  const swr = useCustomSWR(
    isReady && !!id,
    `/api/v1/user/gift_campaigns/${id}`,
    true,
    null,
    params,
  );
  const data = swr.data?.gift_campaign
    ? decorate(swr.data?.gift_campaign, "giftCampaign")
    : {};

  return {
    ...swr,
    data,
  };
}
