### 一、Docker镜像到底是什么？（先理解本质）
可以把Docker镜像理解为：**一个只读的、打包好的「应用运行环境模板」**，包含了运行应用所需的所有东西——代码、运行时、库、环境变量、配置文件等。

#### 通俗比喻
- 镜像 = 手机出厂时的「系统安装包」（包含操作系统、预装APP、基础配置）
- 容器 = 用这个安装包刷出来的「可运行的手机系统」（基于镜像创建，可读写，能独立运行）

#### 核心特性
1. **只读性**：镜像本身是不可修改的，容器是镜像的「可读写副本」（容器运行时会在镜像之上加一层可写层）。
2. **分层存储**：镜像不是单一文件，而是由多个「只读层」叠加而成（比如基础系统层、依赖安装层、代码复制层），这种设计能复用层，节省空间（比如多个Python镜像共用同一个Python基础层）。
3. **可移植**：镜像可以打包、传输，在任何支持Docker的机器上运行。

### 二、Docker镜像存储在哪里？（分两种场景）
镜像的存储位置分「本地存储」和「远程仓库存储」，核心是**本地存储在Docker管理的专属文件夹中**。

#### 1. 远程仓库（镜像的「下载源/上传目标」）
- 最常用的是Docker官方仓库：**Docker Hub**（https://hub.docker.com/），你用`docker pull`命令就是从这里下载镜像。
- 也可以用私有仓库（如公司内部的Harbor、阿里云容器镜像服务等），用于存储私有镜像。

#### 2. 本地存储（重点：Docker管理的文件夹）
当你执行`docker pull`或`docker build`后，镜像会被下载/构建到本地机器，存储在Docker的「数据目录」中（这个目录由Docker管理，不建议手动修改）。

##### 不同系统的默认存储路径
| 操作系统       | 镜像默认存储路径                          |
|----------------|-------------------------------------------|
| Linux          | `/var/lib/docker/`（核心目录）            |
| Windows（WSL2）| `\\wsl$\docker-desktop-data\version-pack-data\community\docker\overlay2` |
| macOS          | `~/Library/Containers/com.docker.docker/Data/vms/0/data/docker/` |

##### 关键子目录说明（以Linux为例）
`/var/lib/docker/` 下的核心子目录：
- `images/`：存储镜像的元数据（镜像ID、分层信息等）。
- `overlay2/`（最常用的存储驱动）：存储镜像的实际分层文件（只读层）和容器的可写层。
- `containers/`：存储容器的元数据和可写层数据。

#### 如何查看本地镜像的存储信息？
1. 查看Docker的存储驱动和根目录：
```bash
docker info | grep -E "Docker Root Dir|Storage Driver"
```
输出示例（Linux）：
```
Docker Root Dir: /var/lib/docker
Storage Driver: overlay2
```

2. 查看单个镜像的分层和大小：
```bash
docker inspect [镜像名/ID]  # 查看镜像详细信息（包含存储路径、分层ID等）
docker system df            # 查看镜像/容器/卷的磁盘占用
```

### 三、能不能手动修改镜像存储的文件夹？
可以，但**不建议新手手动修改**（容易导致Docker运行异常）。如果磁盘空间不足，可通过以下方式调整：

#### 1. Linux系统修改Docker根目录（示例）
- 停止Docker服务：
```bash
sudo systemctl stop docker
```
- 迁移原数据到新目录（如`/data/docker`）：
```bash
sudo mv /var/lib/docker /data/
```
- 配置Docker守护进程（`/etc/docker/daemon.json`）：
```json
{
  "data-root": "/data/docker"  # 指定新的存储根目录
}
```
- 重启Docker服务：
```bash
sudo systemctl daemon-reload
sudo systemctl start docker
```

#### 2. Windows/macOS（Docker Desktop）
在Docker Desktop的「Settings」→「Resources」→「Advanced」中，可调整磁盘镜像存储的位置或大小（不同版本界面略有差异）。

### 总结
1. **镜像本质**：只读的应用环境模板，由多层只读文件系统组成，容器是镜像的可读写运行实例。
2. **存储位置**：远程存储在Docker Hub/私有仓库，本地存储在Docker管理的专属文件夹（Linux默认`/var/lib/docker`），而非普通用户文件夹。
3. **核心要点**：镜像的存储由Docker自动管理，新手无需手动修改存储目录；可通过`docker info`/`docker inspect`查看存储相关信息，通过`docker system df`清理无用镜像节省空间。

简单来说，你只需要通过`docker pull/build/images`等命令操作镜像即可，Docker会自动处理底层的存储细节，不用关心具体文件存在哪个文件夹里~