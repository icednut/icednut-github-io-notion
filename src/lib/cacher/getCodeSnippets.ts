import rpc, { values } from './rpc'

export default async function getCodeSnippets() {
  try {
    const data = await rpc('show_all', {})

    return { data }
  } catch (err) {
    console.error(`Failed to load codeSnippets`, err)
    return { data: {} }
  }
}
