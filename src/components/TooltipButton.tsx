import { ButtonHTMLAttributes } from "react";
import cx from "classnames";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
  tooltipPosition?: "top" | "left";
}

export function TooltipButton({ children, tooltip, tooltipPosition = "left", ...props }: Props) {
  return (
    <div
      className={cx(`tooltip`, {
        "tooltip-top": tooltipPosition === "top",
        "tooltip-left": tooltipPosition === "left",
        "cursor-not-allowed": props.disabled,
      })}
      data-tip={tooltip}
    >
      <button {...props}>{children}</button>
    </div>
  );
}
