import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProfilePageClient from "../ProfilePageClient"

export async function generateMetadata({params}: {params: {username: string}}) {
  const profile = await getProfileByUsername(params.username)
  return {
    title: profile?.name ?? profile?.username,
    description: profile?.bio,
  }
}


async function ProfilePageServer( {params}: {params: {username: string}}) {
  const user = await getProfileByUsername(params.username)
  if (!user) notFound()
    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id),
    ])
  
  return <ProfilePageClient
  user={user}
  posts={posts}
  likedPosts={likedPosts}
  isFollowing={isCurrentUserFollowing}
  />
}

export default ProfilePageServer