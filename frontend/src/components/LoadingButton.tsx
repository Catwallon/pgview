import type { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
}

export function LoadingButton({ loading, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={props.disabled || loading} {...props}>
      {loading ? <Spinner /> : props.children}
    </Button>
  );
}
