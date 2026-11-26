import Typography from "@mui/material/Typography";
export default function AppCopyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {`${new Date().getFullYear()} © `}
      Pine Wealth Solution Securities Company Limited
    </Typography>
  );
}
