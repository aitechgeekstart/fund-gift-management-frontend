"use client";
import useEffectOnce from "@/hooks/use-effect-once";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffectOnce(() => {
    router.replace("/auth/gift_campaigns");
  });

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      sx={{ height: "30vh", justifyContent: "center", alignItems: "center" }}
    >
      LOADING...
    </Grid>
  );
}
