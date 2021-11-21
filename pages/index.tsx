import api from "@/lib/api";
import prisma from "@/prisma";
import NewPost from "@/components/NewPost";
import Post from "@/components/Post";
import type { NextPage, GetStaticProps } from "next";
import type { APIPost } from "@/lib/types";
import { useQuery, QueryClient, dehydrate } from "react-query";

const Index: NextPage = () => {
  const { data } = useQuery<APIPost[]>("posts", async () => {
    const response = await api.request<APIPost[]>({ url: "/post" });

    return response.data;
  });

  return (
    <>
      <NewPost />

      {data?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery("posts", () =>
    prisma.post.findMany({
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
    })
  );

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60 * 60,
  };
};
