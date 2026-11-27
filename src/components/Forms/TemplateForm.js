import { Button, FormLabel, TextField } from "@/components/Global";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useImmer } from "use-immer";

export default function TemplateForm(props) {
  const { type, routerBack, submit, loading, initialData } = props;
  const [error, setError] = useState({});
  const [formData, setFormData] = useImmer({
    [`${type}_redeem`]: { ...initialData[`${type}_redeem`] },
    [`${type}_delivery`]: { ...initialData[`${type}_delivery`] },
  });

  const onFormChange = (objKey, key, value) => {
    setFormData((draft) => {
      draft[objKey][key] = value;
    });
  };

  const _handleSubmit = () => {
    submit(formData);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="body" color="primary">
          {`ใส่ {gitt_code} เพื่อแสดง Gift Code ใน Message | ใส่ {start_date} หรือ {end_date} เพื่อแสดง วันที่เริ่มหรือวันที่สิ้นสุดของ Gift ใน Message | ใส่ {tracking_number} เพื่อแสดง
                  Tracking Number ใน Message`}
        </Typography>
      </Grid>
      <Grid size={12} container>
        <Grid size={12}>
          <FormLabel>After Customer Claim</FormLabel>
        </Grid>
        <Grid size={12}>
          <TextField
            multiline
            rows={4}
            helperText={error[`${type}_redeem_line_text`]}
            error={!!error[`${type}_redeem_line_text`]}
            value={formData[`${type}_redeem`].line_text || ""}
            onChange={(e) =>
              onFormChange(`${type}_redeem`, "line_text", e.target.value)
            }
          />
        </Grid>
      </Grid>
      <Grid size={12} container>
        <Grid size={12}>
          <FormLabel>Message From Admin</FormLabel>
        </Grid>
        <Grid size={12}>
          <TextField
            multiline
            rows={4}
            helperText={error[`${type}_delivery_line_text`]}
            error={!!error[`${type}_delivery_line_text`]}
            value={formData[`${type}_delivery`].line_text || ""}
            onChange={(e) =>
              onFormChange(`${type}_delivery`, "line_text", e.target.value)
            }
          />
        </Grid>
      </Grid>
      <Grid size={12} container>
        <Grid size={12}>
          <FormLabel>Email Aftere Claim</FormLabel>
        </Grid>
        <Grid size={12}>
          <TextField
            helperText={error[`${type}_delivery_email_subject`]}
            error={!!error[`${type}_delivery_email_subject`]}
            value={formData[`${type}_delivery`].email_subject || ""}
            placeholder="กรุณากรอกตัวอย่าง Subject Email หากต้องการให้ระบบไม่ส่ง Email ให้ปล่อยไว้เป็นค่าว่าง"
            onChange={(e) =>
              onFormChange(`${type}_delivery`, "email_subject", e.target.value)
            }
          />
        </Grid>
        <Grid size={12}>
          <TextField
            multiline
            rows={4}
            helperText={error[`${type}_delivery_email_body`]}
            error={!!error[`${type}_delivery_email_body`]}
            value={formData[`${type}_delivery`].email_body || ""}
            placeholder="กรุณากรอกตัวอย่าง Body Email หากต้องการให้ระบบไม่ส่ง Email ให้ปล่อยไว้เป็นค่าว่าง"
            onChange={(e) =>
              onFormChange(`${type}_delivery`, "email_body", e.target.value)
            }
          />
        </Grid>
      </Grid>

      <Grid size={12} container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Button variant="outlined" color="primary" onClick={routerBack}>
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
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
