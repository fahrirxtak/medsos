import { useState } from "react";
import customAPI from "../config/axios";
import userProfile from "../assets/image/image-user.png";
import { Link } from "react-router";
import ButtonFollow from "../components/ButtonFollow";

const SearchView = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (q) => {
    setLoading(true); // ✅ fix: set loading true sebelum fetch
    setDisabled(true);
    setError(null); // ✅ reset error tiap kali search baru
    try {
      const { data } = await customAPI.get(`/user/search?username=${q}`);
      setUsers(data.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message ?? "Something went wrong"); // ✅ optional chaining
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4 my-10">
      <h1 className="text-lg font-semibold mb-4 text-info">Searching</h1>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchUsers(query);
        }}
      >
        <div className="input input-bordered flex items-center gap-2 w-full">
          {" "}
          {/* ✅ fix typo */}
          <input
            type="text"
            className="grow"
            placeholder="Searching User..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" disabled={disabled}>
            {loading ? "Searching..." : "Search"} {/* ✅ feedback visual */}
          </button>
        </div>
      </form>

      {/* Output */}
      <div className="flex flex-col gap-3 mt-4">
        {users.map(
          (
            item, // ✅ fix: arrow function pakai () bukan {}
          ) => (
            <div
              key={item.username} // ✅ tambah key
              className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200 cursor-pointer" // ✅ justify-between agar Follow ke kanan
            >
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="rounded-full w-12">
                    <img
                      src={item.image ? item.image : userProfile}
                      alt={item.username}
                    />
                  </div>
                </div>
                <div>
                  <Link
                    className="font-semibold text-info text-sm"
                    to={`/${item.username}`}
                  >
                    {item.username}
                  </Link>
                  <p className="text-xs text-gray-500">{item.fullname}</p>
                </div>
              </div>
              <ButtonFollow selectedUser={item} />
            </div>
          ),
        )}

        {/* ✅ fix: !loading dan users.length === 0, tambah hasSearched agar tidak muncul sebelum search */}
        {!loading && users.length === 0 && query && (
          <p className="text-center text-sm text-gray-500 mt-8">
            No User Found
          </p>
        )}

        {error && (
          <p className="text-center text-sm text-error mt-4">{error}</p>
        )}

        {loading && (
          <p className="text-center text-sm text-gray-500 mt-8">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default SearchView;
