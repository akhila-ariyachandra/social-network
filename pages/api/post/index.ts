import prisma from "@/prisma";
import type { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

const PostHandler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    // Get all posts
    const posts = await prisma.post.findMany({
      orderBy: {
        postedOn: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return res.status(200).json(posts);
  } else if (req.method === "POST") {
    // Check if user has logged in
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const content: string = req.body.content;

    const post = await prisma.post.create({
      data: {
        content,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return res.status(200).json(post);
  }
};

export default PostHandler;
