<p align="center">
  开发使用的浏览器扩展
</p>

<p align="center">
  <img src="https://img.shields.io/badge/manifest-3-green" />
  <br>
</p>

## 功能说明

### 同步 cookies

**将来源域 `foo.com` 的 cookies 同步（实际是拷贝）到目标域 `bar.com`**

即拷贝一份 cookies 只修改了 domain 属性。同时还会监听 cookies 的变化，如果来源域名下的 cookies 发生变化将会自动同步到目标域

## 规划

- [ ] 实现伪装 request 解决跨域和认证问题
- [ ] 实现拦截 request 返回 mock 数据
