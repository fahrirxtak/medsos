import { useState } from "react";
import customAPI from "../config/axios";
import { useStore } from "zustand";
import { useAuthStore } from "../stores/authStore";
import { Navigate, useNavigate } from "react-router";

const CreateFeedView = () => {
  const [caption, setCaption] = useState();
  const [image, setImage] = useState();
  const [disabled, setDisabled] = useState(false);
  const [preview, setPreview] = useState(false);

  const { token } = useAuthStore();
  const navigate = useNavigate();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async(e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("caption", caption);
    if (image) formData.append("image", image);
    setDisabled(true)

    try {
        const {data} = await customAPI.post("/feed", formData, {
            headers: {
                Authorization: `Bearer ${token}`
            },

        })
        navigate("/")
    } catch (error) {
        console.log(error)
    } finally{
        setDisabled(false)
    }
  }

  return (
    <main className="may-10 w-full mx-15 p-16 mb:pb-0">
      <fieldset className="fieldset border-none w-full w-max-3xl p-4">
        <form onSubmit={handleCreatePost}>
        <h1 className="text-info text-3xl font-bold mb-2">Create Post</h1>
        <div className="divider"></div>
        <input
          type="file"
          className="file-input mb-2 file-input-info"
          onChange={onFileChange}
        />
        {preview && <img src={preview} className="w-100 h-[30vh]" /> }
        <textarea
          name=""
          id=""
          className="textarea w-full mb-2"
          placeholder="Masukan Caption Postingan anda"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
        <input
          type="submit"
          className="btn btn-primary"
          value={"Create Post"}
          disabled={disabled}
        />
        </form>
      </fieldset>
    </main>
  );
};

export default CreateFeedView;
