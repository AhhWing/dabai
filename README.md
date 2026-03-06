要在您自己的本地电脑上运行和测试这个项目，非常简单。这是一个标准的基于 Vite 和 React 的前端项目。
请按照以下步骤在本地运行：
1. 准备环境
电脑上已经安装了 Node.js。可以打开终端（命令行）输入 node -v 来检查是否已安装。
2. 安装依赖并运行
打开终端（或命令提示符），进入解压后的项目文件夹目录，然后依次执行以下两条命令：
第一步：安装项目所需的依赖包
npm install
第二步：启动本地开发服务器
npm run dev
3. 在浏览器中预览
启动成功后，终端会显示一个本地访问地址（通常是 http://localhost:3000 或 http://localhost:5173）。在浏览器中打开这个地址，您就可以在本地测试这个项目了。
4. 如何对接您的后端？
如果您想在本地测试时对接您自己的后端 API：
打开 src/pages/ChatPage.tsx，找到 handleSend 函数里的 // TODO: 对接真实后端 API，用 fetch 或 axios 替换掉模拟代码。
打开 src/pages/MoodPage.tsx，找到 captureAndAnalyze 函数里的 // TODO: 将 base64Image 发送给后端进行情绪分析，同样替换为您的后端请求代码。
