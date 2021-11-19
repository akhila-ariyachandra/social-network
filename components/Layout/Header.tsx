import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import type { FC } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Header: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            News
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {status === "authenticated" && (
            <Avatar sx={{ mr: 2 }}>
              <Image
                src={session?.user?.image}
                width={40}
                height={40}
                alt={session?.user?.name}
              />
            </Avatar>
          )}

          {status === "authenticated" ? (
            <Button color="inherit" onClick={() => signOut()}>
              Logout
            </Button>
          ) : status === "unauthenticated" ? (
            <Button color="inherit" onClick={() => signIn()}>
              Login
            </Button>
          ) : (
            <Button color="inherit" disabled={true}>
              Loading
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
