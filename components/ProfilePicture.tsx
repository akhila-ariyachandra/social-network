import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import type { FC } from "react";

const ProfilePicture: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <Avatar sx={{ marginInline: 2 }}>
      <Image src={src} width={40} height={40} alt={alt} />
    </Avatar>
  );
};

export default ProfilePicture;
