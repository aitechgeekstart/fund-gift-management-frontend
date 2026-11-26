"use client";
import { Button, CardHeader, StatusLabel } from "@/components/Global";
import dayjs from "@/helpers/dayjs";
import { useAuth } from "@/hooks/use-auth";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";

export default function GiftCampaignInfo(props) {
  const {
    id,
    name,
    status,
    imageUrl,
    digitalStockLimit,
    digitalStockRedeemed,
    physicalStockLimit,
    physicalStockRedeemed,
    detail,
    giftPeriod,
    createdAt,
    createdBy,
    publish,
    loading,
  } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { can } = useAuth();

  const renderGiftCampaignAction = () => {
    return (
      <Stack direction="row" spacing={2} sx={{ justifySelf: "end" }}>
        {can(["api/v1/user/gift_campaigns#create"]) && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "80px" }}
            onClick={() => {
              window.location = `/auth/gift_campaigns/${id}/edit`;
            }}
          >
            Edit
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <Card variant="outlined">
      <CardHeader
        action={!matches && renderGiftCampaignAction()}
        title="Gift Management"
        actionWidth="50%"
      />
      <CardContent>
        {matches && renderGiftCampaignAction()}
        <Grid container spacing={2}>
          <Grid container spacing={2} size={12}>
            <Grid size={8}>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {name}
              </Typography>
            </Grid>
            <Grid size={4}>
              <StatusLabel label={status} />
            </Grid>
          </Grid>

          <Grid container spacing={2} size={12}>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{
                width: "100%",
                height: "auto !important",
                backgroundColor: "#d8d8d8",
                borderRadius: "5px",
              }}
            >
              <Image
                src={imageUrl || "/images/image.png"}
                alt="Banner"
                width={150}
                height={150}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} container spacing={2}>
              <Grid
                size={12}
                sx={{
                  backgroundColor: "#d2cbbe",
                  color: (theme) => theme.palette.primary.main,
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <Typography
                  variant="body"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Claimable Digital:{" "}
                </Typography>
                <Box sx={{ paddingTop: "20px" }}>
                  <Typography
                    variant="h4"
                    color="primary"
                    sx={{ fontWeight: "bold", textAlign: "right" }}
                  >{`${digitalStockRedeemed || 0}/${digitalStockLimit || 0}`}</Typography>
                </Box>
              </Grid>

              <Grid
                size={12}
                sx={{
                  backgroundColor: "#e6dac4",
                  color: (theme) => theme.palette.primary.main,
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <Typography
                  variant="body"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Claimable Post:{" "}
                </Typography>
                <Box sx={{ paddingTop: "20px" }}>
                  <Typography
                    variant="h4"
                    color="primary"
                    sx={{ fontWeight: "bold", textAlign: "right" }}
                  >{`${physicalStockRedeemed || 0}/${physicalStockLimit || 0}`}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={2} size={12}>
            <Grid size={12}>
              <Typography
                variant="body"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                Gift Detail
              </Typography>
            </Grid>
            <Grid size={12}>{detail}</Grid>
          </Grid>

          <Grid container spacing={2} size={12}>
            <Grid size={5}>
              <Box>
                <Typography
                  variant="body"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Gift Period
                </Typography>
              </Box>
              <Box>
                <Typography variant="body" color="primary">
                  {giftPeriod}
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Box>
                <Typography
                  variant="body"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Created Date
                </Typography>
              </Box>
              <Box>
                <Typography variant="body" color="primary">
                  {dayjs(createdAt).format("DD MMM YYYY")}
                </Typography>
              </Box>
            </Grid>
            <Grid size={3}>
              <Box>
                <Typography
                  variant="body"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  Created by
                </Typography>
              </Box>
              <Box>
                <Typography variant="body" color="primary">
                  {createdBy}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            loading={loading}
            onClick={publish}
          >
            Publish
          </Button>
          <Button variant="contained" color="warning">
            Disable Claim
          </Button>
          <Button variant="outlined" color="error">
            Cancel Gift
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
