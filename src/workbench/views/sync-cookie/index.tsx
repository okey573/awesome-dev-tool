import RelationTable from './RelationTable.tsx'
import RelationAdder from './RelationAdder.tsx'
import React, { Suspense, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Spin } from 'antd'
import useSuspensePromise from '@/hooks/useSuspensePromise.ts'
import { RUN_TIME_EVENT, STORAGE_KEY } from '@/enums.ts'
import { emitEvent } from '@/service-worker/runtime-message-center.ts'


const storageKey = STORAGE_KEY.SYNC_COOKIE_RELATIONS
const promise = chrome.storage.local.get(storageKey)

const SyncCookie: React.FC = (() => {
  const { [storageKey]: initRelations } = useSuspensePromise(promise)
  const [relations, setRelations] = useState<SyncCookie.Relation[]>(initRelations || [])

  useUpdateEffect(() => {
    chrome.storage.local.set({
      [storageKey]: relations
    })
    emitEvent({
      event: RUN_TIME_EVENT.SYNC_COOKIE,
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
