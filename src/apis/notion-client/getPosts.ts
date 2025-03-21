import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 * @param {{ limit: number }} - 게시물 가져오는 개수 제한 (기본값: 100)
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async (limit = 100) => {
  try {
    let id = CONFIG.notionConfig.pageId as string

    // NotionAPI 클라이언트 생성
    const api = new NotionAPI({
      apiBaseUrl: process.env.NOTION_API_BASE_URL,
      authToken: process.env.NOTION_TOKEN,
      activeUser: process.env.NOTION_ACTIVE_USER,
    })

    console.log(`Fetching Notion data with pageId: ${id}...`)

    const response = await api.getPage(id)
    id = idToUuid(id)

    // 방어적 코딩: response.collection이 없는 경우 처리
    if (!response.collection) {
      console.error("No collection found in response")
      return []
    }

    const collection = Object.values(response.collection)[0]?.value
    const block = response.block

    // 방어적 코딩: block[id]가 없는 경우 처리
    if (!block || !block[id]) {
      console.error(`Block with id ${id} not found`)
      return []
    }

    const schema = collection?.schema
    const rawMetadata = block[id].value

    // Check Type
    if (
      !rawMetadata ||
      (rawMetadata?.type !== "collection_view_page" &&
        rawMetadata?.type !== "collection_view")
    ) {
      return []
    } else {
      // Construct Data
      const pageIds = getAllPageIds(response)
      console.log(`Total pageIds found: ${pageIds.length}`)

      const data = []

      // 페이지 ID 개수 제한 설정
      const paginatedPageIds = pageIds.slice(0, limit)
      console.log(`Getting ${paginatedPageIds.length} posts (limit: ${limit})`)

      for (let i = 0; i < paginatedPageIds.length; i++) {
        const id = paginatedPageIds[i]
        if (i % 10 === 0) {
          console.log(`Processing post ${i + 1}/${paginatedPageIds.length}`)
        }

        // 방어적 코딩: block[id]가 없는 경우 건너뛰기
        if (!block[id]) {
          console.warn(`Block with id ${id} not found, skipping`)
          continue
        }

        const properties = (await getPageProperties(id, block, schema)) || null

        // 방어적 코딩: properties가 null인 경우 건너뛰기
        if (!properties) {
          console.warn(`Could not get properties for page ${id}, skipping`)
          continue
        }

        // Add fullwidth, createdtime to properties
        // 방어적 코딩: created_time이 없는 경우 현재 시간 사용
        properties.createdTime = block[id]?.value?.created_time
          ? new Date(block[id].value.created_time).toString()
          : new Date().toString()

        properties.fullWidth =
          block[id]?.value?.format?.page_full_width ?? false

        data.push(properties)
      }

      // 방어적 코딩: 데이터가 비어있는 경우 처리
      if (data.length === 0) {
        console.warn("No valid data found")
        return []
      }

      // Sort by date
      data.sort((a: any, b: any) => {
        const dateA: any = new Date(a?.date?.start_date || a.createdTime)
        const dateB: any = new Date(b?.date?.start_date || b.createdTime)
        return dateB - dateA
      })

      console.log(`Successfully fetched ${data.length} posts from Notion`)

      const posts = data as TPosts
      return posts
    }
  } catch (error) {
    console.error("Error in getPosts:", error)
    // 더 자세한 에러 로깅
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`)
      console.error(`Stack trace: ${error.stack}`)
    }
    return [] // 오류 발생 시 빈 배열 반환
  }
}
