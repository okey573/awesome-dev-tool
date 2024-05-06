import './App.scss'
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { ConfigProvider, Menu, MenuProps } from 'antd'
import SyncCookie from './views/sync-cookie'
// import DisguiseRequest from './views/disguise-request'
// import GroupTabs from './views/group-tasbs'

const App: React.FC = () => {
  const items: MenuProps['items'] = [
    {
      label: '同步cookie',
      key: '/syncCookie',
    },
    // {
    //   label: '伪装请求',
    //   key: '/disguiseRequest',
    // },
    // {
    //   label: '标签页分组',
    //   key: '/groupTabs',
    // }
  ]
  const [current, setCurrent] = useState('/syncCookie')
  const location = useLocation()

  // TODO optimize
  useEffect(() => {
    setCurrent(location.pathname)
  }, [location])

  const navigate = useNavigate()
  const clickMenu: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    navigate(e.key)
  }

  return <ConfigProvider theme={{ token: { colorPrimary: 'rgb(94, 92, 230)' } }}>
    <Menu className="menu"
          mode="horizontal"
          items={items}
          selectedKeys={[current]}
          onClick={clickMenu}
    />
    <div className="content">
      <Routes>
        <Route path="/" element={<Navigate to="/syncCookie" replace />} />
        <Route path="/syncCookie" element={<SyncCookie />} />
        {/*<Route path="/disguiseRequest" element={<DisguiseRequest />} />*/}
        {/*<Route path="/groupTabs" element={<GroupTabs />} />*/}
      </Routes>
    </div>
  </ConfigProvider>
}

export default App
