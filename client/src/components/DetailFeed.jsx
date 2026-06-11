import { useEffect, useState } from "react";
import { FaPaperPlane, FaHeart, FaTrash } from "react-icons/fa";
import { useAuthStore } from "../stores/authStore";
import customAPI from "../config/axios";
import userProfile from "../assets/image/image-user.png";
import formatDateAndTime from "../config/date";
import BtnLike from "./BtnLike";
import BtnSave from "./BtnSave";

const DetailFeed = ({ post, onClose }) => {
  if (!post) return null;

  const [postData, setPostData] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { token, user } = useAuthStore((state) => state);

  const getPostDetail = async () => {
    setLoading(true);
    try {
      const { data } = await customAPI.get(`/feed/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPostData(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await customAPI.delete(`/comment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getPostDetail();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setDisabled(true);
    try {
      await customAPI.post(
        "/comment",
        {
          postId: post.id,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setContent("");
      getPostDetail();
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    getPostDetail();
  }, []);

  return (
    <div className="modal modal-open">
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        <>
          <div className="modal-box max-w-6xl p-0">
            <div className="flex v-h[80vh] md:flex-row">
              {/* left img1 */}
              <div className="w-1/2 bg-black flex items-center justify-between">
                <img
                  src={postData.image ? postData.image : userProfile}
                  className="max-h-full object-contain"
                  alt=""
                />
              </div>
              {/* Right */}
              <div className="w-1/2 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-start p-4 border-b gap-3">
                  <div className="flex items-center">
                    <div className="avatar">
                      <div className="w-8 rounded-full mr-4">
                        <img
                          src={
                            postData && postData.user && postData.user.image
                              ? postData.user.image
                              : userProfile
                          }
                          alt=""
                        />
                      </div>
                    </div>
                    <p className="font-semibold text-sm">
                      {postData.user?.username}
                    </p>
                  </div>
                </div>
                {/* cAPTION */}
                <div className="p-4 text-sm gap-3">
                  <span className="font-semibold ">
                    {postData.user?.username}
                  </span>
                  <span className="text-gray-400 ml-1">{postData.caption}</span>
                </div>
                {/* Comments */}

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                  {postData.comments && postData.comments.length ? (
                    <>
                      {postData.comments.map((item, key) => (
                        <div className="flex justify-between" key={key}>
                          <div className="flex gap-x-2">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="avatar">
                                <div className="w-10 rounded-full">
                                  <img
                                    src={
                                      item.user.image
                                        ? item.user.image
                                        : userProfile
                                    }
                                    alt=""
                                  />
                                </div>
                              </div>
                              <div className="px-4 pb-4 text-sm">
                                <p>
                                  <span className="font-bold">
                                    {item.user.username}
                                  </span>{" "}
                                  {item.content}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDateAndTime(item.createAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            {item.user.id === user.id && (
                              <button onClick={() => handleDelete(item.id)}>
                                <FaTrash className="text-error cursor-pointer" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <h5 className="text-lg font-semibold">Blom ada komen</h5>
                  )}
                </div>
                {/* Action */}
                <div className="p-3">
                  <div className="flex justify-between px-4 py-3">
                    <div className="flex gap-4 text-xl">
                      <div className="flex gap-x-2 items-center">
                        <BtnLike postId={postData.id} />
                        <span>{postData.likeCount}</span>
                      </div>
                      <div className="flex items-center">
                        <BtnSave postId={postData.id} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* input */}
                <form className="p-3 flex gap-2" onSubmit={handleComment}>
                  <input
                    type="text"
                    className="iput input-base-300 w-full text-sm"
                    placeholder="Add Comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <button
                    className="btn btn-primary text-sm"
                    type="submit"
                    disabled={disabled}
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={onClose}>
            <button>close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailFeed;
