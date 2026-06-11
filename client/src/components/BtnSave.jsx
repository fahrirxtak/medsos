import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import customAPI from "../config/axios";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const BtnSave = ({ postId }) => {
  const [checkSaved, setCheckSaved] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore((state) => state);

  const getCheckSaved = async () => {
    try {
      setLoading(true);
      const { data } = await customAPI.get(`/bookmark/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCheckSaved(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaved = async () => {
    try {
      const { data } = await customAPI.post(
        `/bookmark/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      getCheckSaved();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCheckSaved();
  }, []);
  return (
    <>
      {loading ? (
        <span className="loading loading-sm loading-spinner"></span>
      ) : (
        <>
          {checkSaved ? (
            <FaBookmark
              className="cursor-pointer text-yellow-300 transition"
              onClick={() => toggleSaved()}
            />
          ) : (
            <FaRegBookmark
              className="cursor-pointer transition"
              onClick={() => toggleSaved()}
            />
          )}
        </>
      )}
    </>
  );
};

export default BtnSave;
