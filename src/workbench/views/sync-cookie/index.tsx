import RelationTable from './RelationTable.tsx'
import RelationAdder from './RelationAdder.tsx'
import { useState } from 'react'

export default () => {
  const [relations, setRelations] = useState<SyncCookie.Relation[]>([])
  return <>
    <RelationAdder relations={relations} setRelations={setRelations} />
    <RelationTable relations={relations} setRelations={setRelations} />
  </>
}
