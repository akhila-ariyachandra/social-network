import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ProfilePicture from "@/components/ProfilePicture";
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
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Social Network
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {status === "authenticated" && (
            <ProfilePicture
              src={session?.user?.image}
              alt={session?.user?.name}
            />
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
