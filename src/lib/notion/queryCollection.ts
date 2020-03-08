import rpc from './rpc'

export default function queryCollection(
  { collectionId, collectionViewId, loader = {}, query = {} }: any,
  tag: string = '',
  category: string = ''
) {
  const {
    limit = 999, // TODO: figure out Notion's way of handling pagination
    loadContentCover = true,
    type = 'table',
    userLocale = 'en',
    userTimeZone = 'America/Phoenix',
  } = loader

  const {
    aggregate = [
      {
        aggregation_type: 'count',
        id: 'count',
        property: 'title',
        type: 'title',
        view_type: 'table',
      },
    ],
    filter = {},
    filter_operator = 'and',
    sort = [],
  } = query

  let targetFilter = {}

  if (category != null && category !== '') {
    targetFilter = {
      operator: 'and',
      filters: [
        {
          property: 'M{^+',
          filter: {
            operator: 'enum_is',
            value: {
              type: 'exact',
              value: category,
            },
          },
        },
      ],
    }
  }

  if (tag != null && tag !== '') {
    targetFilter = {
      operator: 'and',
      filters: [
        {
          property: '$!60',
          filter: {
            operator: 'enum_contains',
            value: {
              type: 'exact',
              value: tag,
            },
          },
        },
      ],
    }
  }

  const queryParam = {
    collectionId,
    collectionViewId,
    loader: {
      limit,
      loadContentCover,
      type,
      userLocale,
      userTimeZone,
    },
    query: {
      aggregate,
      filter: targetFilter,
      filter_operator,
      sort,
    },
  }
  return rpc('queryCollection', queryParam)
}
