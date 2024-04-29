import RelationTable from './RelationTable.tsx'
import RelationAdder from './RelationAdder.tsx'
import RulesTester from './RulesTester.tsx'
import React, { Suspense, useState } from 'react'
import { useUpdateEffect } from 'ahooks'
import { Divider, Spin } from 'antd'
import useSuspensePromise from '@/hooks/useSuspensePromise.ts'
// import { EVENT_DISGUISE_REQUEST, STORAGE_DISGUISE_REQUEST_RELATIONS } from '@/constants.ts'


// const promise = chrome.storage.local.get(STORAGE_DISGUISE_REQUEST_RELATIONS)
const promise = Promise.resolve([{
  key: '1',
  real: 'http://localhost:8080',
  fake: 'https://baidu.com'
}, {
  key: '2',
  real: 'http://localhost:8081',
  fake: 'https://google.com'
}] as DisguiseRequest.Relation[])


const DisguiseRequest: React.FC = (() => {
  // const { [STORAGE_DISGUISE_REQUEST_RELATIONS]: initRelations } = useSuspensePromise(promise)
  const initRelations = useSuspensePromise(promise)
  const [relations, setRelations] = useState<DisguiseRequest.Relation[]>(initRelations || [])

  useUpdateEffect(() => {
    // chrome.storage.local.set({
    //   [STORAGE_DISGUISE_REQUEST_RELATIONS]: relations
    // })
    // chrome.runtime.sendMessage({
    //   event: EVENT_DISGUISE_REQUEST,
    //   data: relations
    // })
  }, [relations])

  return <>
    <RelationAdder relations={relations} setRelations={setRelations} />
    <RelationTable relations={relations} setRelations={setRelations} />
  </>
})

const App = () => <Suspense fallback={<Spin style={{ width: '100%', marginTop: '50px' }} />}>
  <RulesTester />
  <Divider />
  <DisguiseRequest />
</Suspense>

export default App
