import React from "react";
import "../styles/CustomDateInput.css";
const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className="custom-date-input" onClick={onClick} ref={ref}>
    {value || "Chọn ngày"}
  </button>
));

export default CustomDateInput;
