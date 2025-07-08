import * as React from "react";
import "./button.css";

const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    const buttonClass = `button button-${variant} button-${size} ${
      className || ""
    }`;

    return (
      <button className={buttonClass} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
