**Mill**（Scala/Java 构建工具是一款轻量、快速、用纯 Scala 写配置的 JVM 构建工具，常用于 Chisel、Rocket Chip 等硬件/Scala 项目。

### 一、Mill 是什么
- **定位**：JVM 平台构建工具（对标 sbt、Maven、Gradle），主打**更快的增量编译、纯 Scala 配置（build.sc）、更简洁的 DSL**。
- **适用场景**：Scala/Java/Kotlin 项目、Chisel/数字电路项目、Rocket Chip 等开源硬件项目。
- **核心优势**：
  - 构建速度比 sbt/Maven 快 3–6 倍（强缓存 + 并行）
  - 配置文件是纯 Scala 代码（`build.sc`），类型安全、易调试
  - 轻量、启动快，适合 CI/CD 与本地开发

---

### 二、安装 Mill（Linux/macOS/Windows）
#### 前置条件
- 必须安装 **JDK 8+**（推荐 JDK 11/17）

#### 1. Linux/macOS（推荐）
##### 方法 A：官方一键安装（全局）
```bash
# 下载最新稳定版（替换版本号，如 0.12.1）
sh -c "curl -L https://github.com/com-lihaoyi/mill/releases/download/0.12.1/0.12.1 > ~/.local/bin/mill && chmod +x ~/.local/bin/mill"

# 验证
mill --version
```
- 若 `~/.local/bin` 不在 `PATH`，添加：
  ```bash
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
  source ~/.bashrc
  ```

##### 方法 B：项目本地安装（推荐给团队）
在项目根目录下载 **millw**（自动管理版本）：
```bash
curl -L https://raw.githubusercontent.com/lefou/millw/main/millw > mill
chmod +x mill
# 以后用 ./mill 代替 mill
./mill --version
```

##### 方法 C：包管理器
- macOS（Homebrew）：`brew install mill`
- Arch Linux：`pacman -S mill`

#### 2. Windows
##### 方法 A：Scoop（推荐）
```powershell
scoop install mill
mill --version
```

##### 方法 B：手动安装
1. 下载：https://github.com/com-lihaoyi/mill/releases → 下载 `mill.bat`
2. 放到 `C:\bin` 或其他目录，并加入系统 `PATH`
3. 验证：`mill --version`

---

### 三、快速上手
```bash
# 初始化 Scala 项目
mkdir my-scala-project && cd my-scala-project
mill init scalalib

# 编译
mill compile

# 运行
mill run

# 测试
mill test
```
- 配置文件：`build.sc`（纯 Scala 代码）

---

### 四、常见问题
- **下载慢**：手动下载 jar 放到 `~/.mill/download`，或用国内镜像。
- **权限不足**：确保 `mill` 有可执行权限（`chmod +x`）。
- **版本冲突**：用 `millw` 锁定项目版本，避免全局版本问题。

需要我给你一个可直接复制的 **Chisel 项目 build.sc 模板**，并教你用 Mill 编译运行吗？