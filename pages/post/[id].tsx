import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import api from "@/lib/api";
import prisma from "@/prisma";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ProfilePicture from "@/components/ProfilePicture";
import NewComment from "@/components/NewComment";
import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import type { APIPostWithComments } from "@/lib/types";
import { useRouter } from "next/router";
import { useQuery, QueryClient, dehydrate } from "react-query";
import { Fragment } from "react";

dayjs.extend(advancedFormat);

const PostPage: NextPage = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const { data } = useQuery<APIPostWithComments>(["post", id], async () => {
    const response = await api.request<APIPostWithComments>({
      url: `/post/${id}`,
    });

    return response.data;
  });

  return (
    <Paper sx={{ padding: 2 }}>
      <Head>
        <title>Post | Social Network</title>
      </Head>

      <Stack spacing={3}>
        <Stack spacing={3} direction="row" alignItems="center">
          <ProfilePicture src={data?.user?.image} alt={data?.user?.name} />

          <Stack spacing={1}>
            <Typography variant="body2">{data?.user?.name}</Typography>

            <Typography variant="caption">
              {dayjs(data.postedOn).format("Do MMMM YYYY, h:mm A")}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="h6">{data?.content}</Typography>

        <NewComment />

        {data?.comments?.map((comment) => (
          <Fragment key={comment.id}>
            <Divider />

            <Typography variant="body2">{comment?.content}</Typography>

            <Stack spacing={1} direction="row" alignItems="center">
              <ProfilePicture
                src={comment?.user?.image}
                alt={comment?.user?.name}
              />

              <Stack spacing={1}>
                <Typography variant="body2">{comment?.user?.name}</Typography>

                <Typography variant="caption">
                  {dayjs(comment.postedOn).format("Do MMMM YYYY, h:mm A")}
                </Typography>
              </Stack>
            </Stack>
          </Fragment>
        ))}
      </Stack>
    </Paper>
  );
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
