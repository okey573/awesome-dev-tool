import './App.scss'
import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ConfigProvider, Menu, MenuProps } from 'antd'
import SyncCookie from './views/sync-cookie'
import TestPage from './views/test-page'

const App: React.FC = () => {
  const items: MenuProps['items'] = [
    {
      label: 'cookie',
      key: '/cookie',
    },
    {
      label: 'test',
      key: '/test',
    },
  ]
  const [current, setCurrent] = useState('/cookie')
  const navigate = useNavigate()
  const clickMenu: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
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
        <Route path="/" element={<Navigate to="/cookie" replace />} />
        <Route path="/cookie" element={<SyncCookie />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  </ConfigProvider>
}

export default App
