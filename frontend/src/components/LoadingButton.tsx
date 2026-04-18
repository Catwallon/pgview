import type { ComponentProps } from "react";
import { Button } from "./shadcn-ui/button";
import { Spinner } from "./shadcn-ui/spinner";

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
