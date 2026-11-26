import OtpInput from "react-otp-input";
import { useImmer } from "use-immer";

const inputStyle = {
  width: "48px",
  height: "55px",
  margin: "auto",
  fontSize: "1.2rem",
  textAlign: "center",
  borderRadius: "7px",
  border: (theme) => `1px solid ${theme.palette.primary.main}`,
  color: (theme) => theme.palette.primary.main,
  background: (theme) => theme.palette.white.main,
  borderColor: (theme) => theme.palette.primary.main,
};

export default function OTPInput({
  onChange: _onChange,
  propsNum = 6,
  onEnter,
  loading,
  otp = "",
  ...others
}) {
  const [OTP, setOTP] = useImmer(otp);

  const onChange = (value) => {
    if (/^[0-9]*$/.test(value)) {
      setOTP(value);
      _onChange(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && loading === false) {
      onEnter();
    }
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Meta", "Control", "v"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handlePaste = (event) => {
    const data = event.clipboardData.getData("text");
    onChange(data);
  };

  return (
    <OtpInput
      inputStyle={inputStyle}
      containerStyle={{ justifyContent: "space-between" }}
      value={OTP}
      onPaste={handlePaste}
      onChange={onChange}
      numInputs={propsNum}
      renderSeparator={<span>&nbsp;</span>}
      renderInput={(props) => <input {...props} onKeyDown={handleKeyDown} />}
    />
  );
}
