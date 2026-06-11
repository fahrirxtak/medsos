import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import customAPI from "../config/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const BtnLike = ({ postId }) => {
  const [checkLike, setCheckLike] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore((state) => state);

  const getCheckLike = async () => {
    try {
      setLoading(true);
      const { data } = await customAPI.get(`/like/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCheckLike(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    try {
      const { data } = await customAPI.post(
        `/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(data);
      getCheckLike();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCheckLike();
  }, []);
  return (
    <>
      {loading ? (
        <span className="loading loading-sm loading-spinner"></span>
      ) : (
        <>
          {checkLike ? (
            <FaHeart
              className="cursor-pointer text-red-500 transition"
              onClick={() => toggleLike()}
            />
          ) : (
            <FaRegHeart
              className="cursor-pointer transition"
              onClick={() => toggleLike()}
            />
          )}
        </>
      )}
    </>
  );
};
export default BtnLike;
