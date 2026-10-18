# Atoms Careers Studio

Atoms 招聘网页展示，含 15 秒 JOIN US 短片、整屏滚动、工作流程及真实职位列表。

网页：https://celia-107.github.io/atoms-careers-studio-oct18/

## 维护

静态站点，无需构建。更新 main 分支后由 GitHub Pages 发布。
职位位于 data/jobs.json，为 2026-10-18 核对的快照；部分岗位的公开投递入口仍待开通，未建立自动同步。
此仓库不包含飞书凭证、候选人数据或简历收集后端。

IBM Plex 字体与播放器的许可保留在 assets/。

展示字体：中文Noto Sans SC Heavy（标题用字子集），英文Archivo Black；均随站点提供OFL许可。首屏中文采用短暂粒子消散复原，英文介绍采用SVG多层线框；减少动态效果时静止，正文与职位信息保持正常字形。

中文展示字改为字形内部动态噪点，轮廓稳定，无飞散粒子；只在可见时更新，减少动态效果模式显示静态噪点。英文多层线框保留。
