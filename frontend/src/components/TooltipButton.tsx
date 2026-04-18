import { useState, type ComponentProps } from "react";
import { LoadingButton } from "./LoadingButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./shadcn-ui/tooltip";

interface TooltipButtonProps extends ComponentProps<typeof LoadingButton> {
  tooltip: string;
}

export function TooltipButton({ tooltip, ...props }: TooltipButtonProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Tooltip open={props.disabled && tooltipOpen} onOpenChange={setTooltipOpen}>
      <TooltipTrigger asChild>
        <span
          className="inline-block cursor-not-allowed ml-auto"
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
        >
          <LoadingButton {...props}>{props.children}</LoadingButton>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
