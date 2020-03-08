import { values } from './rpc'
import Slugger from 'github-slugger'
import queryCollection from './queryCollection'
import { normalizeSlug } from '../blog-helpers'

export default async function loadTagOptions(collectionBlock: any) {
  const { value } = collectionBlock
  const col = await queryCollection({
    collectionId: value.collection_id,
    collectionViewId: value.view_ids[0],
  })
  const recordMapCollection = col['recordMap']['collection']
  return recordMapCollection[Object.keys(recordMapCollection)[0]].value.schema[
    '$!60'
  ]['options'].map(each => each.value)
}
