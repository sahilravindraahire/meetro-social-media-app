// import {useEffect} from "react"
// import {useDispatch, useSelector} from "react-redux"
// import {fetchPosts} from "../../store/slices/postSlice.js"
// import {followUserApi, getSuggestedUsersApi} from "../../api/user.api.js"
// import {useState} from "react"
// import PostCard from "../../components/post/PostCard.jsx"
// import StoryBar from "../../components/story/StoryBar.jsx"
// import {Link} from "react-router-dom"
// import {} from "../../api/user.api.js"

// function Home() {

//   const dispatch = useDispatch()
//   const {posts, loading} = useSelector((s) => s.posts)
//   const {user} = useSelector((s) => s.auth)
//   const [suggested, setSuggested] = useState([])

//   useEffect(() => {
//     dispatch(fetchPosts())
//     getSuggestedUsersApi().then((res) => setSuggested(res.data.data?.slice(0, 5) || [])).catch(() => {})
//   }, [dispatch])

//   const handleFollow = async (userId) => {
//     try {
//       const res = await followUserApi(userId)
//       const isNowFollowing = res.data.data?.following
//       setFollowingMap((prev) => ({...prev, [userId]: isNowFollowing}))
//     } catch {}
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 flex gap-8">
//       {/* Feed */}
//       <div className="flex-1 max-w-xl mx-auto md:mx-0 space-y-6">
//         {/* Stories */}
//         <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
//           <StoryBar />
//         </div>

//         {/* Posts */}
//         {loading ? (
//           <div className="space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 animate-pulse">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-10 h-10 rounded-full bg-white/10" />
//                   <div className="space-y-2">
//                     <div className="w-28 h-3 bg-white/10 rounded" />
//                     <div className="w-20 h-2 bg-white/10 rounded" />
//                   </div>
//                 </div>
//                 <div className="w-full h-64 bg-white/10 rounded-xl mb-4" />
//               </div>
//             ))}
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-16 text-white/30">
//             <p className="text-lg">No posts yet</p>
//             <p className="text-sm mt-1">Follow some people or create a post</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {posts.map((post) => <PostCard key={post._id} post={post} />)}
//           </div>
//         )}
//       </div>

//       {/* Sidebar */}
//       <aside className="hidden lg:block w-72 flex-shrink-0">
//         <div className="sticky top-6 space-y-6">
//           {/* User card */}
//           <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
//             <img
//               src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=a855f7&color=fff`}
//               alt={user?.name}
//               className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
//             />
//             <div>
//               <Link to={`/profile/${user?.userName}`} className="text-sm font-semibold text-white hover:text-[#a855f7] transition-colors">
//                 {user?.name}
//               </Link>
//               <p className="text-xs text-white/40">@{user?.userName}</p>
//             </div>
//           </div>

//           {/* Suggested users */}
//           {suggested.length > 0 && (
//             <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
//               <h3 className="text-sm font-semibold text-white/60 mb-4">Suggested for you</h3>
//               <div className="space-y-3">
//                 {suggested.map((u) => (
//                   <div key={u._id} className="flex items-center gap-3">
//                     <Link to={`/profile/${u.userName}`}>
//                       <img
//                         src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`}
//                         alt={u.name}
//                         className="w-9 h-9 rounded-full object-cover"
//                       />
//                     </Link>
//                     <div className="flex-1 min-w-0">
//                       <Link to={`/profile/${u.userName}`}>
//                         <p className="text-sm font-semibold text-white truncate hover:text-[#a855f7] transition-colors">{u.name}</p>
//                       </Link>
//                       <p className="text-xs text-white/40 truncate">@{u.userName}</p>
//                     </div>
//                     <button
//                       onClick={() => handleFollow(u._id)}
//                       className="text-xs font-semibold text-[#a855f7] hover:text-[#9333ea] transition-colors"
//                     >
//                       Follow
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </aside>
//     </div>
//   )
// }

// export default Home

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/slices/postSlice.js";
import { followUserApi, getSuggestedUsersApi } from "../../api/user.api.js";
import PostCard from "../../components/post/PostCard.jsx";
import StoryBar from "../../components/story/StoryBar.jsx";
import { Link } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((s) => s.posts);
  const { user } = useSelector((s) => s.auth);
  const [suggested, setSuggested] = useState([]);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    dispatch(fetchPosts());
    getSuggestedUsersApi()
      .then((res) => {
        const users = res.data.data?.slice(0, 5) || [];
        setSuggested(users);

        const initial = {};
        users.forEach((u) => {
          initial[u._id] = user?.following?.some(
            (id) => id === u._id || id?._id === u._id,
          );
        });
        setFollowingMap(initial);
      })
      .catch(() => {});
  }, [dispatch]);

  const handleFollow = async (userId) => {
    try {
      const res = await followUserApi(userId);
      const updatedFollowing = res.data.data?.following || [];

      const isNowFollowing = updatedFollowing.some(
        (id) => id === userId || id?._id === userId,
      );
      setFollowingMap((prev) => ({ ...prev, [userId]: isNowFollowing }));
    } catch {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-8">
      {/* Feed */}
      <div className="flex-1 max-w-xl mx-auto md:mx-0 space-y-6">
        {/* Stories */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
          <StoryBar />
        </div>

        {/* Posts */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="w-28 h-3 bg-white/10 rounded" />
                    <div className="w-20 h-2 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="w-full h-64 bg-white/10 rounded-xl mb-4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <p className="text-lg">No posts yet</p>
            <p className="text-sm mt-1">Follow some people or create a post</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-6 space-y-6">
          {/* User card */}
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <img
              src={
                user?.profileImage ||
                `https://ui-avatars.com/api/?name=${user?.name}&background=a855f7&color=fff`
              }
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
            />
            <div>
              <Link
                to={`/profile/${user?.userName}`}
                className="text-sm font-semibold text-white hover:text-[#a855f7] transition-colors"
              >
                {user?.name}
              </Link>
              <p className="text-xs text-white/40">@{user?.userName}</p>
            </div>
          </div>

          {/* Suggested users */}
          {suggested.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white/60 mb-4">
                Suggested for you
              </h3>
              <div className="space-y-3">
                {suggested.map((u) => {
                  const isFollowing = followingMap[u._id] ?? false;
                  return (
                    <div key={u._id} className="flex items-center gap-3">
                      <Link to={`/profile/${u.userName}`}>
                        <img
                          src={
                            u.profileImage ||
                            `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`
                          }
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/profile/${u.userName}`}>
                          <p className="text-sm font-semibold text-white truncate hover:text-[#a855f7] transition-colors">
                            {u.name}
                          </p>
                        </Link>
                        <p className="text-xs text-white/40 truncate">
                          @{u.userName}
                        </p>
                      </div>
                      <button
                        onClick={() => handleFollow(u._id)}
                        className={`text-xs font-semibold transition-colors ${
                          isFollowing
                            ? "text-white/40 hover:text-red-400"
                            : "text-[#a855f7] hover:text-[#9333ea]"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default Home;
