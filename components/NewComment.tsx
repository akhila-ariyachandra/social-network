import api from "@/lib/api";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import ProfilePicture from "@/components/ProfilePicture";
import { FC, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const NewComment: FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const [value, setValue] = useState("");

  const id = router.query.id as string;

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const newCommentMutation = useMutation(
    async (content: string) => {
      await api.request({
        url: `/post/${id}/comment`,
        method: "POST",
        data: {
          content,
        },
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["post", id]);
      },
      onSuccess: () => {
        setValue("");
      },
    }
  );

  return (
    <Box>
      <TextField
        label="New Comment"
        multiline
        fullWidth
        minRows={2}
        value={value}
        onChange={handleChange}
        disabled={newCommentMutation.isLoading || status !== "authenticated"}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <ProfilePicture src={session?.user?.image} alt={session?.user?.name} />

        <LoadingButton
          variant="contained"
          loading={newCommentMutation.isLoading}
          onClick={() => newCommentMutation.mutate(value)}
          disabled={!value || status !== "authenticated"}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default NewComment;
