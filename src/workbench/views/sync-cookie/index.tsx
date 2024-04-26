import RelationTable from './RelationTable.tsx'
import RelationAdder from './RelationAdder.tsx'
import React, { useEffect, useState } from 'react'
import syncCookieHandler from './script.ts'
import { useUpdateEffect } from 'ahooks'

const StorageKey = 'SYNC_COOKIE_RELATIONS' as SyncCookie.StorageKey


const SyncCookie: React.FC = (() => {
  const [relations, setRelations] = useState<SyncCookie.Relation[]>([])
  useEffect(() => {
    const setInit = async () => {
      const { [StorageKey]: relations } = await chrome.storage.local.get('SYNC_COOKIE_RELATIONS')
      setRelations(relations)
    }
    setInit()
  }, [])

  useUpdateEffect(() => {
    chrome.storage.local.set({
      [StorageKey]: relations
    })
    syncCookieHandler(relations)
  }, [relations])

  return <>
    <RelationAdder relations={relations} setRelations={setRelations} />
    <RelationTable relations={relations} setRelations={setRelations} />
  </>
})

export default SyncCookie
