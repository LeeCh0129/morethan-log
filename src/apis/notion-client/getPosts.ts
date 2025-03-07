import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  try {
    let id = CONFIG.notionConfig.pageId as string
    const api = new NotionAPI()

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
      const data = []
      for (let i = 0; i < pageIds.length; i++) {
        const id = pageIds[i]

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

      const posts = data as TPosts
      return posts
    }
  } catch (error) {
    console.error("Error in getPosts:", error)
    return [] // 오류 발생 시 빈 배열 반환
  }
}
