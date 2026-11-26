"use client";
import { Button, CardHeader } from "@/components/Global";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function CustomerListInfo() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { can } = useAuth();

  const renderCustomerListAction = () => {
    return (
      <Stack direction="row" spacing={2} sx={{ justifySelf: "end" }}>
        {can(["api/v1/user/gift_campaigns#create"]) && (
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
        )}
        {can(["api/v1/user/gift_campaigns#create"]) && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "150px" }}
            onClick={() => {
              window.location = "/auth/gift_campaigns/new";
            }}
          >
            Update Message
          </Button>
        )}
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
      <CardContent>{matches && renderCustomerListAction()}</CardContent>
    </Card>
  );
}
