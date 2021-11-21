import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ProfilePicture from "@/components/ProfilePicture";
import type { FC } from "react";
import type { APIPost } from "@/lib/types";
import { useRouter } from "next/router";

dayjs.extend(advancedFormat);

const Post: FC<{ post: APIPost }> = ({ post }) => {
  const router = useRouter();

  return (
    <Card
      sx={{ marginBlock: 3, cursor: "pointer" }}
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <CardHeader
        avatar={<ProfilePicture src={post.user.image} alt={post.user.name} />}
        title={post.user.name}
        subheader={dayjs(post.postedOn).format("Do MMMM YYYY, h:mm A")}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Post;
