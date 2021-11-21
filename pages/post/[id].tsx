import api from "@/lib/api";
import prisma from "@/prisma";
import Paper from "@mui/material/Paper";
import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import type { APIPostWithComments } from "@/lib/types";
import { useRouter } from "next/router";
import { useQuery, QueryClient, dehydrate } from "react-query";

const PostPage: NextPage = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const { data } = useQuery<APIPostWithComments>(["post", id], async () => {
    const response = await api.request<APIPostWithComments>({
      url: `/post/${id}`,
    });

    return response.data;
  });

  return <Paper></Paper>;
};

export default PostPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params.id as string;

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
      },
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["post", id], () => post);

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60 * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: posts.map(({ id }) => ({ params: { id } })),
    fallback: "blocking",
  };
};
