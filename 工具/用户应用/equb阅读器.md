对于轻量化的 Ubuntu 系统，有几款优秀的 EPUB 阅读器推荐，它们体积小、资源占用低且功能足够。

### 1. **Foliate**（首选推荐）
这是目前 Linux 上体验最接近原生、功能全面且轻量的 EPUB 阅读器之一。
- **优点**：界面现代、支持目录、书签、笔记、高亮、自定义字体/主题、集成维基百科/谷歌翻译等，支持多种格式（EPUB, MOBI, AZW3 等）。
- **安装**：
  ```bash
  # Snap 安装（最简单）
  sudo snap install foliate
  # Flatpak
  flatpak install flathub com.github.johnfactotum.Foliate
  ```

### 2. **Bookworm**（简单易用）
界面简洁，专注于阅读体验，功能不如 Foliate 丰富但足够流畅。
- **安装**：
  ```bash
  # Snap
  sudo snap install bookworm
  # 或从 Flathub
  flatpak install flathub com.github.babluboy.bookworm
  ```

### 3. **FBReader**（老牌经典）
跨平台的老牌电子书阅读器，轻量、启动快，支持云端同步（如 Google Drive）和在线书库。
- **安装**：
  ```bash
  sudo apt install fbreader
  # 或从官方下载 .deb 包
  ```

### 4. **Calibre**（全能但稍重）
它是电子书**管理神器**，功能极为强大（编辑、转换、阅读、新闻下载），但作为“纯阅读器”稍显臃肿。如果你的需求是“偶尔阅读+大量管理”，可以安装。
- **安装**：
  ```bash
  sudo apt install calibre
  ```

### 5. **KOReader**（为电子墨水屏优化，但桌面也能用）
这是开源、跨平台、高度可定制的阅读器，主打墨水屏设备（如 Kobo, Kindle），但在 Linux 桌面端运行也非常轻量，尤其适合 EPUB/PDF 的深度阅读和笔记。
- **安装**：下载 AppImage 或从源码编译。详见 https://github.com/koreader/koreader。

---

### **总结建议**
- **追求最佳体验**：选 **Foliate**，界面美观，功能齐全，轻量。
- **只需基本阅读**：选 **FBReader** 或 **Bookworm**，更快更纯粹。
- **需要电子书管理**：用 **Calibre**（阅读只是其功能之一）。
- **偏爱可定制、支持触控/墨水屏模式**：试试 **KOReader**。