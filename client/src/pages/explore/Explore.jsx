import { useState, useEffect } from "react";
import {
  searchUsersApi,
  getSuggestedUsersApi,
  followUserApi,
} from "../../api/user.api.js";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";

function Explore() {
  const { user } = useSelector((state) => state.auth);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState({});

  useEffect(() => {
    getSuggestedUsersApi()
      .then((res) => {
        const users = res.data.data || [];
        setSuggested(users);
        // seed followed state from real data
        const initialFollowed = {};
        users.forEach((u) => {
          initialFollowed[u._id] = u.followers?.some(
            (f) => f === user?._id || f._id === user?._id,
          );
        });
        setFollowed(initialFollowed);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchUsersApi(query)
        .then((res) => setResults(res.data.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleFollow = async (userId) => {
    await followUserApi(userId).catch(() => {});
    setFollowed((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const displayUsers = query ? results : suggested;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-4">Explore</h1>

      <div className="relative mb-6">
        <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xl" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people..."
          className="w-full bg-white/5 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-3 border border-white/10 focus:outline-none focus:border-[#a855f7]/50 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#a855f7] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {!query && (
        <h2 className="text-sm font-semibold text-white/40 mb-3">
          Suggested for you
        </h2>
      )}

      {displayUsers.length === 0 && query ? (
        <p className="text-center text-white/30 py-12">
          No users found for "{query}"
        </p>
      ) : (
        <div className="space-y-2">
          {displayUsers.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/10 transition-all"
            >
              <Link to={`/profile/${u.userName}`} className="flex-shrink-0">
                <img
                  src={
                    u.profileImage ||
                    `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`
                  }
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${u.userName}`}>
                  <p className="text-sm font-semibold text-white hover:text-[#a855f7] transition-colors">
                    {u.name}
                  </p>
                </Link>
                <p className="text-xs text-white/40">@{u.userName}</p>
                {u.bio && (
                  <p className="text-xs text-white/50 mt-0.5 truncate">
                    {u.bio}
                  </p>
                )}
              </div>
              {u._id !== user?._id && (
                <button
                  onClick={() => handleFollow(u._id)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex-shrink-0 ${
                    followed[u._id]
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "bg-[#a855f7] text-white hover:bg-[#9333ea]"
                  }`}
                >
                  {followed[u._id] ? "Following" : "Follow"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
