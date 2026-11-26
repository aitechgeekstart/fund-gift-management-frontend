import { TextField } from "@/components/Global";
import { NumericFormat } from "react-number-format";

export default function NumberField(props) {
  return (
    <NumericFormat
      autoComplete="off"
      allowNegative={false}
      allowLeadingZeros={true}
      customInput={TextField}
      fixedDecimalScale={true}
      thousandSeparator
      {...props}
    />
  );
}
