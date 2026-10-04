# ATSPM

Windows 桌面应用下载站。

- 下载网页：https://jashd9528.github.io/ATSPM/
- 安装包与历史版本：https://github.com/jashd9528/ATSPM/releases
- 在应用内更新：设置 → 关于 → 检查更新 → 更新软件。

本站只列出已发布的 Windows x64 MSI。版本、文件大小和发布说明直接从 GitHub Releases 读取。下载包采用原有 Windows Installer 产品族，界面名称为 ATSPM，以保持升级兼容。

`update.json` 是应用使用的 Ed25519 签名更新清单；公开验证密钥随正式构建固定，私钥不进入仓库和安装包。检查更新不会安装，点击更新软件后才下载、验证并安装。完成后清理本次安装包；失败保留诊断记录。

GitHub Pages 从 main 根目录发布，无构建依赖。
