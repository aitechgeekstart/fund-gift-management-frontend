"use client";
import TemplateForm from "@/components/Forms/TemplateForm";
import {
  Button,
  FormLabel,
  LoadingScreen,
  Modal,
  TextField,
} from "@/components/Global";
import CustomerListInfo from "@/components/Info/CustomerListInfo";
import DigitalMessageInfo from "@/components/Info/DigitalMessageInfo";
import GiftCampaignInfo from "@/components/Info/GiftCampaignInfo";
import PostMessageInfo from "@/components/Info/PostMessageInfo";
import dayjs from "@/helpers/dayjs";
import { useApplicationConfig } from "@/hooks/use-application-config";
import { useAuth } from "@/hooks/use-auth";
import { useGiftCampaignCustomers } from "@/swr/use-gift-campaign-customers";
import { useGiftCampaign } from "@/swr/use-gift-campaigns";
import { Grid } from "@mui/material";
import { isArray, isEmpty } from "lodash";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

export default function Page() {
  const params = useParams();
  const applicationConfig = useApplicationConfig();
  const { fetcherWithToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [openDigitalMessageModal, setOpenDigitalMessageModal] = useState(false);
  const [openPhysicalMessageModal, setOpenPhysicalMessageModal] =
    useState(false);
  const [openCustomerFormModal, setOpenCustomerFormModal] = useState(false);
  const [formData, setFormData] = useImmer({});
  const [error, setError] = useState({});
  const [sortModel, setSortModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });

  const { data, isValidating, mutate } = useGiftCampaign(
    !!params.gift_campaign_id,
    params.gift_campaign_id,
  );

  const {
    data: customers,
    isValidating: loadingCustomers,
    mutate: mutateCustomers,
    rowCount: rowCountCustomers,
  } = useGiftCampaignCustomers(
    !!params.gift_campaign_id,
    params.gift_campaign_id,
    {
      page: paginationModel.page + 1,
      per_page: paginationModel.pageSize,
      sort_field: sortModel?.field,
      sort_order: sortModel?.sort,
    },
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

  const validateForm = () => {
    const keys = [
      {
        value: "mobile_number",
        label: "Customer Phone Number",
        required: true,
      },
    ];
    let formError = {};
    keys.forEach((k) => {
      if (
        k.required &&
        (!formData[k.value] ||
          isArray(formData[k.value] && formData[k.value].length === 0))
      ) {
        formError[k.value] = `${k.label} cannot be blank`;
      }
    });
    setError(formError);
    return Object.keys(formError).length < 1;
  };

  const onFormChange = (key, value) => {
    setFormData((draft) => {
      draft[key] = value;
    });
    if (Object.entries(error).length > 0) {
      validateForm();
    }
  };

  const handleOpenDigitalMessage = () => {
    setOpenDigitalMessageModal(true);
  };

  const handleCloseDigitalMessage = () => {
    setOpenDigitalMessageModal(false);
  };

  const handleOpenPhysicalMessage = () => {
    setOpenPhysicalMessageModal(true);
  };

  const handleClosePhysicalMessage = () => {
    setOpenPhysicalMessageModal(false);
  };

  const handleOpenCustomerForm = () => {
    setOpenCustomerFormModal(true);
  };

  const handleCloseCustomerForm = () => {
    setOpenCustomerFormModal(false);
  };

  const publish = async () => {
    setLoading(true);
    const response = await fetcherWithToken(
      `/api/v1/user/gift_campaigns/${params.gift_campaign_id}/publish`,
      {
        method: "POST",
      },
    );

    if (response && response.success) {
      enqueueSnackbar("Published", {
        variant: "success",
      });
      setLoading(false);
      mutate();
    } else {
      enqueueSnackbar(response.error, {
        variant: "warning",
      });
      setLoading(false);
    }
  };

  const handleSubmitMessage = async (_params) => {
    setLoading(true);
    const allParams = JSON.stringify({
      message_templates: { ...data.message_templates, ..._params },
    });
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
      setLoading(false);
      handleCloseDigitalMessage();
      handleClosePhysicalMessage();
      mutate();
    } else {
      enqueueSnackbar(response.error, {
        variant: "warning",
      });
      setLoading(false);
    }
  };

  const submitCustomer = async () => {
    setLoading(true);
    if (validateForm()) {
      const allParams = JSON.stringify({ ...formData });
      const response = await fetcherWithToken(
        `/api/v1/user/gift_campaigns/${params.gift_campaign_id}/gift_campaign_customers`,
        {
          method: "POST",
          body: allParams,
        },
      );

      if (response && response.success) {
        enqueueSnackbar("Added", {
          variant: "success",
        });
        setLoading(false);
        handleCloseCustomerForm();
        mutateCustomers();
      } else {
        enqueueSnackbar(response.error, {
          variant: "warning",
        });
        setLoading(false);
      }
    } else {
      enqueueSnackbar("Please recheck all required fields.", {
        variant: "error",
      });
    }
  };

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      sx={{ justifyContent: "center", alignItems: "baseline" }}
    >
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <GiftCampaignInfo
          id={params.gift_campaign_id}
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
          publish={publish}
          loading={loading}
          canEdit={data.canEdit()}
          canPublish={data.canPublish()}
          canRevoke={data.canRevoke()}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 6 }} container spacing={2}>
        <Grid size={12}>
          <DigitalMessageInfo
            canEdit={data.canEdit()}
            subject={data.message_templates?.digital_delivery?.email_subject}
            body={data.message_templates?.digital_delivery?.email_body}
            deliveryLineText={
              data.message_templates?.digital_delivery?.line_text
            }
            redeemLineText={data.message_templates?.digital_redeem?.line_text}
            openMessageModal={handleOpenDigitalMessage}
          />
        </Grid>

        <Grid size={12}>
          <PostMessageInfo
            canEdit={data.canEdit()}
            subject={data.message_templates?.physical_delivery?.email_subject}
            body={data.message_templates?.physical_delivery?.email_body}
            deliveryLineText={
              data.message_templates?.physical_delivery?.line_text
            }
            redeemLineText={data.message_templates?.physical_redeem?.line_text}
            openMessageModal={handleOpenPhysicalMessage}
          />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <CustomerListInfo
          data={customers}
          loading={loadingCustomers}
          rowCount={rowCountCustomers}
          openCustomerForm={handleOpenCustomerForm}
          setSortModel={setSortModel}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Grid>

      <Modal
        open={openDigitalMessageModal}
        handleCloseModal={handleCloseDigitalMessage}
        width="500px"
        title="Update Message (Digital)"
      >
        <TemplateForm
          type="digital"
          routerBack={handleCloseDigitalMessage}
          submit={handleSubmitMessage}
          loading={loading}
          initialData={data.message_templates}
        />
      </Modal>

      <Modal
        open={openPhysicalMessageModal}
        handleCloseModal={handleClosePhysicalMessage}
        width="500px"
        title="Update Message (Post)"
      >
        <TemplateForm
          type="physical"
          routerBack={handleClosePhysicalMessage}
          submit={handleSubmitMessage}
          loading={loading}
          initialData={data.message_templates}
        />
      </Modal>

      <Modal
        open={openCustomerFormModal}
        handleCloseModal={handleCloseCustomerForm}
        width="500px"
        title="Add Customer"
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} container>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FormLabel required>Customer Phone Number</FormLabel>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <TextField
                helperText={error.mobile_number}
                error={!!error.mobile_number}
                value={formData.mobile_number || ""}
                onChange={(e) => onFormChange("mobile_number", e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Button
              variant="outlined"
              color="grey"
              onClick={handleCloseCustomerForm}
            >
              Cancel
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Button
              color="primary"
              variant="contained"
              loading={loading}
              onClick={() => submitCustomer()}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Modal>
    </Grid>
  );
}
