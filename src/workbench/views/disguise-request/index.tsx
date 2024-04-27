import { Typography } from 'antd'

const App = () => <>
  <Typography.Title mark>
    'webRequestBlocking' requires manifest version of 2 or lower
  </Typography.Title>

  <Typography.Text>
    manifest v3 不支持 webRequestBlocking 了，所以不能直接拦截请求，要用
    <Typography.Text strong> declarativeNetRequestWithHostAccess </Typography.Text>
    实现
  </Typography.Text>
</>

export default App