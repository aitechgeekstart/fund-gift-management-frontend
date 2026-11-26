"use client";
import { Button, CardHeader } from "@/components/Global";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function PostMessageInfo(props) {
  const { subject, body } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { can } = useAuth();

  const renderPostMessageAction = () => {
    return (
      <Stack direction="row" spacing={2} sx={{ justifySelf: "end" }}>
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
        action={!matches && renderPostMessageAction()}
        title="Auto Message(Post)"
        actionWidth="50%"
      />
      <CardContent>
        {matches && renderPostMessageAction()}
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography
              variant="body"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              After Customer Claim
            </Typography>
            <Typography variant="body" color="grey" sx={{ fontWeight: "bold" }}>
              Message From Admin Email After Claim
            </Typography>
          </Grid>
          <Grid size={12}>{subject}</Grid>
          <Grid size={12}>{body}</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
