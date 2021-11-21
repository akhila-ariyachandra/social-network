import type { Post, Comment } from "@prisma/client";

export type APIPost = Post & {
  user: {
    name: string;
    image: string;
  };
};

export type APIPostWithComments = Post & {
  user: {
    name: string;
    image: string;
  };
  comments: (Comment & {
    user: {
      name: string;
      image: string;
    };
  })[];
};
