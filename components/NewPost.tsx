import api from "@/lib/api";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import ProfilePicture from "@/components/ProfilePicture";
import { FC, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";

const NewPost: FC = () => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const newPostMutation = useMutation(
    async (content: string) => {
      await api.request({
        url: "/post",
        method: "POST",
        data: {
          content,
        },
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("posts");
      },
      onSuccess: () => {
        setValue("");
      },
    }
  );

  return (
    <Box>
      <TextField
        label="New Post"
        multiline
        fullWidth
        minRows={4}
        value={value}
        onChange={handleChange}
        disabled={newPostMutation.isLoading || status !== "authenticated"}
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
          loading={newPostMutation.isLoading}
          onClick={() => newPostMutation.mutate(value)}
          disabled={!value || status !== "authenticated"}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default NewPost;
