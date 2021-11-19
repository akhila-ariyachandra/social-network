import Header from "@/components/Layout/Header";
import type { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />

      {children}
    </>
  );
};

export default Layout;
