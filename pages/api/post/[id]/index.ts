import prisma from "@/prisma";
import type { NextApiHandler } from "next";

const PostHandler: NextApiHandler = async (req, res) => {
  const id = req.query.id as string;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          postedOn: "desc",
        },
      },
    },
    rejectOnNotFound: true,
  });

  return res.status(200).json(post);
};

export default PostHandler;
