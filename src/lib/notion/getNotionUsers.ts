import rpc from './rpc'

export default async function getNotionUsers(ids: string[]) {
  console.log('ids = ' + ids)
  const { results = [] } = await rpc('getRecordValues', {
    requests: ids.map((id: string) => ({
      id,
      table: 'notion_user',
    })),
  })

  const users: any = {}
  console.log(results)

  for (const result of results) {
    const { value } = result || { value: {} }
    const { given_name, family_name } = value
    let full_name = given_name || ''

    if (family_name) {
      full_name = `${full_name} ${family_name}`
    }
    users[value.id] = { full_name }
  }

  return { users }
}
