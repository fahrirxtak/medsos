import {
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaRegBookmark,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useState } from "react";
import customAPI from "../config/axios";
import formatDateAndTime from "../config/date";
import DetailFeed from "../components/DetailFeed";
import ListUser from "../components/ListUser";
import BtnLike from "../components/BtnLike";
import BtnSave from "../components/BtnSave";
import userProfile from "../assets/image/image-user.png";

const HomeView = () => {
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const { user, token } = useAuthStore((state) => state);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getAllFeeds = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await customAPI.get(`/feed?page=${page}&limit=2`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res);
      setFeeds((prev) => [...prev, ...res.data.data]);
      setTotalPage(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin delete");

    if (confirm) {
      await customAPI.delete(`/feed/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllFeeds();
    } else {
      return;
    }
  };

  useEffect(() => {
    getAllFeeds();
  }, [page]);

  // ✅ BENAR - addEventListener di luar handleScroll
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (bottom && !loading && page < totalPage) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, totalPage]);

  return (
    <>
      <main className="flex-1 flex justify-center pb-16 md:pb-0">
        {feeds.length ? (
          <div className="w-full max-w-xl">
            {feeds.map((item, key) => (
              <div className="border-b" key={`feed-${key}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={item.user.image ? item.user.image : userProfile}
                          alt=""
                        />
                      </div>
                    </div>
                    <Link
                      to={`/${item.user.username}`}
                      className="font-semibold text-sm"
                    >
                      {item.user.username}
                    </Link>
                  </div>
                  <span className="cursor-pointer">
                    {user.id === item.user.id ? (
                      <FaTrash
                        className="text-error"
                        onClick={() => handleDelete(item.id)}
                      />
                    ) : null}
                  </span>
                </div>
                {/* Posts */}
                <img src={item.image} alt="" className="w-full" />

                {/* Action */}
                <div className="flex justify-between px-4 py-3">
                  <div className="flex gap-4 text-xl">
                    <BtnLike postId={item.id} />
                    <FaRegComment
                      className="cursor-pointer"
                      onClick={() => setSelectedPost(item)}
                    />
                    <FaPaperPlane className="cursor-pointer " />
                  </div>
                  <BtnSave postId={item.id} />
                </div>

                {/* Caption */}
                <div className="px-4 pb-4 text-sm">
                  <div className="font-semibold">{item.likeCount} Likes</div>
                  <p className="">
                    <span className="font-bold">{item.user.username}</span>{" "}
                    {item.caption.substring(0, 100)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateAndTime(item.createAt)}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center py-6">
                <div className="loading loading-spinner loading-md"></div>
              </div>
            )}

            {!loading && page >= totalPage && feeds.length > 0 && (
              <p className="text-center text-gray-500 py-6">
                Semua Feeds Sudah Tampil
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="w-full">
              {/* info current user */}
              <div className="flex flex-col gap-4 my-50 p-10 w-2xl mx-auto mb-6 bg-base-100">
                <ListUser />
              </div>
            </div>
          </>
        )}

        {/* Modal */}
        {selectedPost && (
          <DetailFeed
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </main>
      <aside className="hidden lg:flex w-80 px-6 py-6 sticky top-0 h-screen">
        <div className="w-full">
          {/* info current user */}
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar">
              <img className=" w-15 rounded-full" src={user.image} />
            </div>
            <div>
              <p className="font-semibold text-sm">{user.fullname}</p>
              <p className="text-gray-500 text-xs">{user.username}</p>
            </div>
          </div>
          {/* suggest User  */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-gray-500">
              Suggested For You
            </p>
          </div>
          <ListUser />
        </div>
      </aside>
    </>
  );
};

export default HomeView;
