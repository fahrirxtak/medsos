import {
  FaHome,
  FaPlusSquare,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router-dom";

const HomeLayout = () => {
  const { removeTokenData, isAuthentication } = useAuthStore();
  const navigate = useNavigate();

  const { user } = useAuthStore((state) => state);

  const handleLogout = () => {
    removeTokenData();
    navigate("/login");
  };

  return isAuthentication ? (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="hidden bg-base-100 lg:flex w-64 px-6 py-6 flex-col justify-between sticky top-0 h-screen overflow-hidden shadow-md ">
        <div className="">
          <h1 className="text-5xl font-logo mb-10">JustGram</h1>
          <ul className="menu gap-3 text-base">
            <li className="text-xl">
              <Link to={"/"} href="">
                <FaHome /> Home
              </Link>
            </li>
            <li className="text-xl">
              <Link to={"/search"} href="">
                <FaSearch /> Search
              </Link>
            </li>
            <li className="text-xl">
              <Link to={"/create"} href="">
                <FaPlusSquare /> Create
              </Link>
            </li>
            <li className="text-xl">
              <Link to={`/${user.username}`} href="">
                <FaUserCircle /> Profile
              </Link>
            </li>
          </ul>
        </div>
        <button
          className="btn btn-outline btn-sm text-xl"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </aside>
      <aside className="hidden bg-base-100 md:flex lg:hidden w-20 shadow-md  flex-col items-center py-6 gap-8 sticky top-0 h-screen overflow-hidden">
        <Link to={"/"}>
          <FaHome className="text-2xl cursor-pointer" />
        </Link>
        <Link to={"/search"}>
          <FaSearch className="text-2xl cursor-pointer" />
        </Link>
        <Link to={"/create"}>
          <FaPlusSquare className="text-2xl cursor-pointer" />
        </Link>
        <Link to={`/${user.username}`}>
          <FaUserCircle className="text-2xl cursor-pointer" />
        </Link>
        <Link to={"/login"}>
          <FaSignOutAlt
            className="text-2xl cursor-pointer"
            onClick={handleLogout}
          />
        </Link>
      </aside>
      {/* Main Content */}
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 bg-base-300 flex justify-around py-3 md:hidden">
        <Link to={"/"}>
          <FaHome className="text-2xl cursor-pointer" />
        </Link>
        <Link to={"/search"}>
          <FaSearch className="text-2xl cursor-pointer" />
        </Link>
        <Link to={"/create"}>
          <FaPlusSquare className="text-2xl cursor-pointer" />
        </Link>
        <Link to={`/${user.username}`}>
          <FaUserCircle className="text-2xl cursor-pointer" />
        </Link>
        <FaSignOutAlt
          className="text-2xl text-error cursor-pointer"
          onClick={handleLogout}
        />
      </nav>
    </div>
  ) : (
    <Navigate to={"/login"} replace />
  );
};

export default HomeLayout;
