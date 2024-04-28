import RelationTable from './RelationTable.tsx'
import RelationAdder from './RelationAdder.tsx'
import React, { Suspense, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Spin } from 'antd'
import useSuspensePromise from '@/hooks/useSuspensePromise.ts'
import { EVENT_SYNC_COOKIE, STORAGE_SYNC_COOKIE_RELATIONS } from '@/constants.ts'


const promise = chrome.storage.local.get(STORAGE_SYNC_COOKIE_RELATIONS)

const SyncCookie: React.FC = (() => {
  const { [STORAGE_SYNC_COOKIE_RELATIONS]: initRelations } = useSuspensePromise(promise)
  const [relations, setRelations] = useState<SyncCookie.Relation[]>(initRelations || [])

  useUpdateEffect(() => {
    chrome.storage.local.set({
      [STORAGE_SYNC_COOKIE_RELATIONS]: relations
    })
    chrome.runtime.sendMessage({
      event: EVENT_SYNC_COOKIE,
      data: relations
    })
  }, [relations])

  return <>
    <RelationAdder relations={relations} setRelations={setRelations} />
    <RelationTable relations={relations} setRelations={setRelations} />
  </>
})

const App = () => <Suspense fallback={<Spin style={{ width: '100%', marginTop: '50px' }} />}>
  <SyncCookie />
</Suspense>

export default App
