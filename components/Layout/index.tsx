import Container from "@mui/material/Container";
import Header from "@/components/Layout/Header";
import type { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />

      <Container sx={{ p: 4 }}>{children}</Container>
    </>
  );
};

export default Layout;
