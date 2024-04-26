import RelationTable from './RelationTable.tsx'
import RelationAdder from './RelationAdder.tsx'
import React, { Suspense, useState } from 'react'
import syncCookieHandler from './script.ts'
import { useUpdateEffect } from 'ahooks'
import { Spin } from 'antd'
import useSuspensePromise from '../../../hooks/useSuspensePromise.ts'

const StorageKey = 'SYNC_COOKIE_RELATIONS' as SyncCookie.StorageKey


const promise = chrome.storage.local.get(StorageKey)

const SyncCookie: React.FC = (() => {
  const { [StorageKey]: initRelations } = useSuspensePromise(promise)
  const [relations, setRelations] = useState<SyncCookie.Relation[]>(initRelations)

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

export default () => <Suspense fallback={<Spin style={{ width: '100%', marginTop: '50px' }} />}>
  <SyncCookie />
</Suspense>
