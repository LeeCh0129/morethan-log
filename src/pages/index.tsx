import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import { getPosts } from "../apis"
import MetaConfig from "src/components/MetaConfig"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"
import MermaidComponent from "src/routes/Detail/components/NotionRenderer/MermaidComponent"

export const getStaticProps: GetStaticProps = async () => {
  // 디버깅을 위한 로깅
  console.log("===== NOTION CONFIG DEBUG =====")
  console.log(`Notion Page ID: ${CONFIG.notionConfig.pageId}`)
  console.log(`isDev: ${!CONFIG.isProd}`)
  console.log(`revalidateTime: ${CONFIG.revalidateTime}`)
  console.log("===============================")

  try {
    // 포스트 수를 1000개로 늘려서 모든 게시물을 가져오기 시도
    const posts = filterPosts(await getPosts(1000))
    console.log(`Filtered posts count: ${posts.length}`)

    await queryClient.prefetchQuery(queryKey.posts(), () => posts)

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: CONFIG.revalidateTime,
    }
  } catch (error) {
    console.error("Error in getStaticProps:", error)
    // 오류 발생 시에도 빈 배열로 계속 진행
    await queryClient.prefetchQuery(queryKey.posts(), () => [])

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60, // 오류 시 빠르게 재검증
    }
  }
}

const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Feed />
      <MermaidComponent /> {/* MermaidComponent 추가 */}
    </>
  )
}

export default FeedPage
