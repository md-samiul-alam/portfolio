import React from "react";
import { cn } from "@/lib/utils";

const MaterialIcon = ({
  name,
  className = "",
  filled = false,
  fill,
  size,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  variant = "outlined",
  style,
  ...props
}) => {
  const useFilled = fill === 1 || filled;
  const fillClass = useFilled ? "material-symbols-filled" : "";
  const variantClass =
    variant === "rounded"
      ? "material-symbols-rounded"
      : variant === "sharp"
        ? "material-symbols-sharp"
        : "material-symbols-outlined";

  const mergedStyle = {
    ...(size != null ? { fontSize: size, lineHeight: 1 } : {}),
    fontVariationSettings: `'FILL' ${useFilled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
    ...style,
  };

  return (
    <span
      className={cn(variantClass, fillClass, "select-none leading-none", className)}
      aria-hidden="true"
      style={mergedStyle}
      {...props}
    >
      {name}
    </span>
  );
};

export default MaterialIcon;
