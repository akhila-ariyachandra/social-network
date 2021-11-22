import prisma from "@/prisma";
import type { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

const CommentHandler: NextApiHandler = async (req, res) => {
  // Check if user has logged in
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const postId = req.query.id as string;
  const content: string = req.body.content;

  const comment = await prisma.comment.create({
    data: {
      content,
      post: {
        connect: {
          id: postId,
        },
      },
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return res.status(200).json(comment);
};

export default CommentHandler;
