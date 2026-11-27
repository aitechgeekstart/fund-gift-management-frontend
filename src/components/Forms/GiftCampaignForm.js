import {
  Button,
  DatePicker,
  FormLabel,
  NumberField,
  TextField,
  Upload,
} from "@/components/Global";
import dayjs from "@/helpers/dayjs";
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { isArray } from "lodash";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

const buttonStyle = {
  flex: 1,
  border: "none !important",
  borderRadius: "5px !important",
  bgcolor: "#D5D0C3",
  color: (theme) => theme.palette.primary.main,
  // fontSize: 24,
  fontWeight: "bold",
  textTransform: "none",
  "&.Mui-selected": {
    bgcolor: (theme) => theme.palette.primary.main,
    color: (theme) => theme.palette.primary.contrastText,
  },
  "&.Mui-selected:hover": {
    bgcolor: (theme) => theme.palette.primary.dark,
  },
  "&:hover": {
    bgcolor: "#C8C3B6",
  },
};

function CustomToggleButton({ value, options, onChange }) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, newValue) => {
        if (newValue !== null) {
          onChange(newValue);
        }
      }}
      sx={{
        display: "flex",
        width: "100%",
        gap: 1.5,
        "& .MuiToggleButtonGroup-grouped": {
          margin: 0,
        },
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value} sx={buttonStyle}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

const defaultParams = {
  name: "",
  description: "",
  gift_valid_from: "",
  gift_valid_until: "",
  digital_enabled: true,
  physical_enabled: true,
  digital_stock_mode: "limit",
  digital_stock_limit: "",
  digital_gifts_per_redemption: 1,
  physical_stock_mode: "limit",
  physical_stock_limit: "",
  image: "",
};

export default function GiftCampaignForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { initialData, handleSubmit, routerBack, loading } = props;
  const [formData, setFormData] = useImmer(
    !!initialData?.id
      ? {
          ...defaultParams,
          ...initialData,
        }
      : { ...defaultParams },
  );
  const [error, setError] = useState({});

  const validateForm = () => {
    const keys = [
      {
        value: "name",
        label: "Name",
        required: true,
      },
      {
        value: "gift_valid_from",
        label: "Start Date",
        required: true,
      },
      {
        value: "gift_valid_until",
        label: "End Date",
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

  useEffect(() => {
    if (Object.entries(error).length > 0) {
      validateForm();
    }
  }, [formData]);

  const onFormChange = (key, value) => {
    setFormData((draft) => {
      draft[key] = value;
    });
    if (Object.entries(error).length > 0) {
      validateForm();
    }
  };

  const onMultipleFormChange = (obj) => {
    setFormData((draft) => {
      Object.entries(obj).forEach(([key, value]) => {
        draft[key] = value;
      });
    });
    if (Object.entries(error).length > 0) {
      validateForm();
    }
  };

  const onDigitalTypeChange = (value) => {
    if (value === "no") {
      onMultipleFormChange({
        digital_enabled: false,
        digital_stock_mode: value,
        digital_stock_limit: "",
        digital_gifts_per_redemption: "",
      });
    } else {
      onMultipleFormChange({
        digital_enabled: true,
        digital_stock_mode: value,
        digital_gifts_per_redemption:
          formData.digital_gifts_per_redemption === ""
            ? 1
            : formData.digital_gifts_per_redemption,
      });
    }
  };

  const onPhysicalTypeChange = (value) => {
    if (value === "not_allow") {
      onMultipleFormChange({
        physical_enabled: false,
        physical_stock_mode: value,
        physical_stock_limit: "",
      });
    } else {
      onMultipleFormChange({
        physical_enabled: true,
        physical_stock_mode: value,
      });
    }
  };

  const _handleSubmit = async () => {
    if (validateForm()) {
      // reformat data
      let _params = {
        name: formData.name,
        description: formData.description,
        starts_at: dayjs(formData.gift_valid_from).format("YYYY-MM-DD"),
        ends_at: dayjs(formData.gift_valid_until).format("YYYY-MM-DD"),
        gift_valid_from: dayjs(formData.gift_valid_from).format("YYYY-MM-DD"),
        gift_valid_until: dayjs(formData.gift_valid_until).format("YYYY-MM-DD"),
        digital_stock_mode: formData.digital_stock_mode,
        physical_stock_mode: formData.physical_stock_mode,
        digital_enabled: formData.digital_enabled,
        physical_enabled: formData.physical_enabled,
      };
      if (!!formData.images[0]?.url) {
        const file = await urlToFile(
          formData.images[0].url,
          formData.images[0].name,
          formData.images[0].content_type,
        );
        _params["images"] = file;
      } else {
        _params["images"] = [formData.image];
      }
      if (formData.digital_enabled) {
        _params = {
          ..._params,
          digital_stock_limit: formData.digital_stock_limit,
          digital_gifts_per_redemption: formData.digital_gifts_per_redemption,
        };
      }
      if (formData.physical_enabled) {
        _params["physical_stock_limit"] = formData.physical_stock_limit;
      }
      if (!!formData.id) {
        _params["id"] = formData.id;
      }
      handleSubmit(_params);
    } else {
      enqueueSnackbar("Please recheck all required fields.", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        direction="row"
        sx={{ justifyContent: "space-between" }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 12 }} container>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <FormLabel required>Gift Name</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <TextField
              helperText={error.name}
              error={!!error.name}
              value={formData.name || ""}
              onChange={(e) => onFormChange("name", e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid size={12}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            Allow Gift Type
          </Typography>
        </Grid>

        <Grid size={12} container spacing={10} sx={{ alignItems: "baseline" }}>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} container spacing={1}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FormLabel>Digital</FormLabel>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <CustomToggleButton
                  value={formData.digital_stock_mode}
                  onChange={onDigitalTypeChange}
                  options={[
                    { value: "unlimited", label: "No" },
                    { value: "limit", label: "Manual" },
                    { value: "code_pool", label: "Auto" },
                  ]}
                />
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, sm: 12, md: 12 }}
              container
              sx={{ alignItems: "center" }}
            >
              <Grid size={{ xs: 4, sm: 2, md: 2 }}>
                <FormLabel>Limit</FormLabel>
              </Grid>
              <Grid size={{ xs: 8, sm: 10, md: 10 }}>
                <NumberField
                  helperText={error.digital_stock_limit}
                  error={!!error.digital_stock_limit}
                  value={formData.digital_stock_limit}
                  allowNegative={false}
                  disabled={formData.digital_stock_mode === "no"}
                  onValueChange={(e) =>
                    onFormChange("digital_stock_limit", e.value)
                  }
                />
              </Grid>
            </Grid>

            <Grid
              size={{ xs: 12, sm: 12, md: 12 }}
              container
              sx={{ alignItems: "center" }}
            >
              <Grid size={{ xs: 4, sm: 2, md: 2 }}>
                <FormLabel>Usage</FormLabel>
              </Grid>
              <Grid size={{ xs: 8, sm: 10, md: 10 }}>
                <NumberField
                  helperText={error.digital_gifts_per_redemption}
                  error={!!error.digital_gifts_per_redemption}
                  value={formData.digital_gifts_per_redemption}
                  allowNegative={false}
                  disabled={formData.digital_stock_mode === "no"}
                  onValueChange={(e) =>
                    onFormChange("digital_gifts_per_redemption", e.value)
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }} container spacing={1}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <FormLabel>Post</FormLabel>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <CustomToggleButton
                  value={formData.physical_stock_mode}
                  onChange={onPhysicalTypeChange}
                  options={[
                    { value: "unlimited", label: "Not Allow Post" },
                    { value: "limit", label: "Allow Post" },
                  ]}
                />
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, sm: 12, md: 12 }}
              container
              sx={{ alignItems: "center" }}
            >
              <Grid size={{ xs: 4, sm: 2, md: 2 }}>
                <FormLabel>Limit</FormLabel>
              </Grid>
              <Grid size={{ xs: 8, sm: 10, md: 10 }}>
                <NumberField
                  helperText={error.physical_stock_limit}
                  error={!!error.physical_stock_limit}
                  value={formData.physical_stock_limit}
                  allowNegative={false}
                  disabled={formData.digital_stock_mode === "not_allow"}
                  onValueChange={(e) =>
                    onFormChange("physical_stock_limit", e.value)
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 12, md: 12 }}
          container
          sx={{ alignItems: "center" }}
        >
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <FormLabel>Gift Photo</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Upload
              fileList="image"
              label="Update Gift Photo"
              variant="contained"
              attachment={formData.image || ""}
              error={error.image}
              imgSize={{ width: 150, height: 150, cols: 1 }}
              boxStyle={{ marginLeft: 0 }}
              updateToParent={(image) => {
                onFormChange("image", image);
              }}
            />
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 12 }} container>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <FormLabel>Gift Detail</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <TextField
              multiline
              rows={3}
              helperText={error.description}
              error={!!error.description}
              value={formData.description || ""}
              onChange={(e) => onFormChange("description", e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }} container>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <FormLabel required>Gift Period Date</FormLabel>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <DatePicker
              type="date"
              helperText={error.gift_valid_from}
              error={!!error.gift_valid_from}
              value={formData.gift_valid_from}
              placeholder="Start Date"
              onChange={(e) => onFormChange("gift_valid_from", e)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <DatePicker
              type="date"
              helperText={error.gift_valid_until}
              error={!!error.gift_valid_until}
              value={formData.gift_valid_until}
              placeholder="End Date"
              onChange={(e) => onFormChange("gift_valid_until", e)}
            />
          </Grid>
        </Grid>
      </Grid>
      <br />

      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Button variant="outlined" color="grey" onClick={() => routerBack()}>
            Cancel
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Button
            color="primary"
            variant="contained"
            loading={loading}
            onClick={() => _handleSubmit()}
          >
            Save Gift
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
