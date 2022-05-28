import { useEffect, useState, useRef, useCallback, createContext, useContext } from 'react'

export const RepoContext = createContext(null)

export function useRepo() {
  const repo = useContext(RepoContext)

  if (!repo) {
    throw new Error('Repo not available on RepoContext.')
  }

  return repo
}

export function useHandle(documentId) {
  const repo = useRepo()

  const [handle, setHandle] = useState(null)

  useEffect(() => {
    (async () => {
      const handle = await repo.find(documentId)
      setHandle(handle)
    })()
  })

  return [handle, setHandle]
}

export function useDocument(documentId) {
  const [doc, setDoc] = useState({})
  const [handle, setHandle] = useHandle(documentId)

  useEffect(() => {
    if (!handle) { return }
    handle.value().then((v) => setDoc(v))
    handle.on('change', (h) => { setDoc(h.doc) } )
  })

  const changeDoc = (changeFunction) => {
    handle.change(changeFunction)
  }

  return [doc, changeDoc]
}
