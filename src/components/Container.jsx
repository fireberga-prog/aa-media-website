import { forwardRef } from "react";

// Single max-width grid so every section aligns to one container.
const Container = forwardRef(function Container(
  { as: Tag = "div", className = "", children, ...rest },
  ref
) {
  return (
    <Tag ref={ref} className={"mx-auto w-full max-w-6xl px-4 sm:px-8 " + className} {...rest}>
      {children}
    </Tag>
  );
});

export default Container;
