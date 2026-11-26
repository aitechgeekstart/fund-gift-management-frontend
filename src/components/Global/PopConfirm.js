import Button from "@/components/Global/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function PopConfirm(props) {
  const {
    open,
    title,
    content,
    handleClose,
    handleApproveFunction,
    buttonColorConfirm,
    buttonTextConfirm,
    buttonTextCancel,
    width,
    loading,
  } = props;

  const styleDialogContent = {
    width: {
      xs: "200px",
      sm: "200px",
      md: "300px",
    },
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent sx={styleDialogContent}>
        <DialogContentText
          component="div"
          sx={{
            textAlign: "center",
            width: width || "auto",
          }}
        >
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleClose} sx={{ width: "50%" }}>
          {buttonTextCancel || "No"}
        </Button>
        <Button
          variant="contained"
          loading={loading}
          disabled={loading}
          color={buttonColorConfirm || "success"}
          autoFocus
          onClick={handleApproveFunction}
          sx={{ width: "50%" }}
        >
          {buttonTextConfirm || "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
