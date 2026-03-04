## ssh(Safe Shell, 安全shell)

对于程序员而言，使用远程服务器（远端设备）进行软件部署或获取强大计算资源已非常普遍。SSH（安全Shell）是连接和管理这些服务器的核心工具，它高度可定制，值得深入学习。

### 基本连接
使用以下命令连接远程服务器：
```bash
ssh username@hostname
```
其中 `hostname` 可以是域名（如 `bar.mit.edu`）或IP地址（如 `192.168.1.42`）。
通过配置 `~/.ssh/config` 文件，可以创建别名（如 `ssh myserver`）来简化连接。

### 执行远程命令
SSH可直接在远程服务器上执行命令，并可与管道配合使用。
* 在远程执行命令，在本地过滤：`ssh foobar@server ls | grep PATTERN`
* 在本地列出结果，在远程过滤：`ls | ssh foobar@server grep PATTERN`

### SSH密钥认证
基于公钥密码学的认证方式，无需每次输入密码，更安全便捷。

1.  **生成密钥对**
    使用 `ssh-keygen` 命令生成密钥。推荐使用更安全、性能更好的Ed25519算法：
    ```bash
    ssh-keygen -o -a 100 -t ed25519 -f ~/.ssh/id_ed25519
    ```
    生成时可设置密钥密码以增加一层保护。`ssh-agent` 或 `gpg-agent` 可以帮助管理该密码，避免重复输入。

2.  **配置公钥登录**
    将本地**公钥**（`~/.ssh/id_ed25519.pub`）内容添加至服务器对应用户的 `~/.ssh/authorized_keys` 文件中。
    简便方法（如果支持）：
    ```bash
    ssh-copy-id -i .ssh/id_ed25519.pub foobar@remote_host
    ```
    手动方法：
    ```bash
    cat ~/.ssh/id_ed25519.pub | ssh foobar@remote_host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
    ```

**警告**：私钥（如 `~/.ssh/id_ed25519`）等效于密码，必须妥善保管。

### 通过SSH复制文件
*   **`ssh` + `tee`** (适用于少量内容)：`cat local_file | ssh remote_server 'tee remote_file'`
*   **`scp`** (简单复制)：`scp /path/to/local_file remote_host:/path/to/remote_file`
*   **`rsync`** (智能同步，推荐)：功能更强大，支持增量同步、断点续传、保留属性等。
    ```bash
    rsync -avP /path/to/local_dir/ remote_host:/path/to/remote_dir/
    ```

### 端口转发
用于访问远程服务器上监听的服务端口。

1.  **本地端口转发**
    将远程服务器上的某个端口，映射到本地计算机的一个端口。
    **场景**：访问远程 `8888` 端口上的服务（如Jupyter Notebook）。
    **命令**：`ssh -L 9999:localhost:8888 foobar@remote_server`
    **操作**：访问本地的 `localhost:9999` 即等同于访问远程的 `localhost:8888`。

2.  **远程端口转发**
    将本地计算机上的某个端口，映射到远程服务器的一个端口。
    **场景**：让远程服务器能访问你本地开发环境（如运行在 `localhost:3000` 的Web应用）。
    **命令**：`ssh -R 8080:localhost:3000 foobar@remote_server`
    **操作**：在远程服务器上访问 `localhost:8080` 即等同于访问你本地的 `localhost:3000`。

### SSH客户端配置 (`~/.ssh/config`)
通过配置文件管理多个连接配置，简化命令。

```bash
# ~/.ssh/config 文件示例
Host myserver # 自定义别名
    User foobar
    HostName 172.16.174.141
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
    LocalForward 9999 localhost:8888 # 本地端口转发

Host *.mit.edu # 使用通配符配置一类主机
    User foobaz
```
配置后，只需执行 `ssh myserver` 即可连接，并且 `scp`, `rsync` 等命令也自动识别此配置。

**注意**：不要公开分享你的 `~/.ssh/config` 文件，以免泄露服务器信息。

### 服务器端配置
配置文件通常位于 `/etc/ssh/sshd_config`。可在此处修改SSH服务端口、禁用密码登录、配置密钥认证选项等。

### 杂项工具
*   **Mosh**：`ssh` 的增强版，对移动和网络不稳定环境更友好，支持漫游和智能本地回显。
*   **sshfs**：将远程服务器的目录挂载到本地文件系统，方便使用本地工具编辑远程文件。
    ```bash
    sshfs foobar@remote_host:/remote/dir /local/mountpoint
    ```