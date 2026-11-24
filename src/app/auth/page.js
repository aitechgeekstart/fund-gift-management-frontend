"use client";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import useEffectOnce from "/src/hooks/use-effect-once";
export default function Home() {
  const router = useRouter();

  useEffectOnce(() => {
    router.replace(`/auth/dashboard`);
  });

  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "30vh" }}
    >
      LOADING...
    </Grid>
  );
}
