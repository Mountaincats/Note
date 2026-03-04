1. **创建会话**     
```bash
tmux
/tmux new -s <name>
重命名会话：ctrl+b $
```

---

2. **分离窗口**  
- 分离
```bash
左右划分：ctrl+b %
上下划分：ctrl+b "
关闭当前窗格：ctrl+d
```

- 移动窗格
```bash
左/右移动：ctrl+b {/}
上/下移动：ctrl+b ctrl/Alt+o
```

- 调整窗格大小
```bash
ctrl+b ctrl+箭头符
```

---

3. **退出会话、结束会话、查看会话和连入会话**
```bash
连入会话：tmux attach-session -t <name/number>
tmux窗口内逐步结束窗格：ctrl+d
bash窗口内结束会话：tmux kill-session -t <name/number>
退出会话：ctrl+b d
直接结束会话：按前缀键 Ctrl+b，再输入 :进入命令模式，再输入kill-session
```
```bash
# 列出所有会话
tmux list-sessions
tmux ls

# 查看详细信息
tmux list-sessions -F "#{session_name}: #{session_windows} windows"

# 查看所有会话及其窗口
tmux list-windows -a
```

---

4. **光标移动**  
```bash
ctrl+b 箭头符
```

---

5. **选择会话、窗口、窗格**
```bash
tmux和bash中均可行，列出会话和窗口分布、并可用来选择会话、窗口、窗格：
ctrl+b s(按Esc退出选择)
切换到上一个窗口（按照状态栏上的顺序）：ctrl+b p (past)
切换到下一个窗口：ctrl+b n (next)
```

---

6. **创建窗口**
```bash
创建一个新窗口：ctrl+b c
窗口重命名：ctrl+b ,
将当前窗格拆分为一个独立窗口：ctrl+b !
删除窗口：ctrl+b &
```

---

7. **复制模式**
```bash
进入：ctrl+b [
退出：q
```

---

8. **鼠标支持(自定义的命令)**
```bash
关闭当前会话鼠标：ctrl+b m 
开启鼠标：ctrl+b M 
```

---

9. **.tmux.conf内容**
```conf
bind-key c new-window -c "#{pane_current_path}"
bind-key % split-window -h -c "{pane_current_path}"
bind-key '"' split-window -c "#{pane_current_path}"
set-option -g mouse on
bind-key M set-option -g mouse on
bind-key m set-option -g mouse off
# tmux默认使用的终端模拟器($TERM)通常是screen或tmux，这些终端类型与普通终端不同
# 设置tmux使用256色
set -g default-terminal "screen-256color"
```

10. **会话、窗口、窗格的关系**
```
tmux服务器
├── 会话1 (session)
│   ├── 窗口1 (window)
│   │   ├── 窗格1 (pane)
│   │   └── 窗格2
│   └── 窗口2
│       └── 窗格3
└── 会话2
    └── 窗口1
        └── 窗格1
```
* 详细解释

| 概念 | 说明 | 常用操作 |
|------|------|----------|
| **会话 (Session)** | 最高层级，代表一个完整的工作环境 | 创建：`tmux new -s name`<br>分离：`Ctrl+b d`<br>重连：`tmux attach -t name` |
| **窗口 (Window)** | 会话中的标签页，占据整个屏幕 | 新建：`Ctrl+b c`<br>切换：`Ctrl+b n/p`<br>重命名：`Ctrl+b ,` |
| **窗格 (Pane)** | 窗口内的分割区域 | 水平分：`Ctrl+b "`<br>垂直分：`Ctrl+b %`<br>切换：方向键 |

11. **快速启动tmux**
* **在.bashrc中自动启动tmux**
在`~/.bashrc`添加：
	```bash
	# 自动启动tmux（避免嵌套）
	if command -v tmux &> /dev/null && [ -n "$PS1" ] && [[ ! "$TERM" =~ screen ]] && [[ ! "$TERM" =~ tmux ]] && [ -z "$TMUX" ]; then
		# 尝试附加到现有会话，如果没有则创建新会话
		exec tmux new-session -A -s main
	fi
	```
* **创建别名快速进入**
  * 在`~/.bashrc`中添加：
	```bash
	# tmux别名
	alias t='tmux'
	alias ta='tmux attach -t'
	alias tn='tmux new -s'
	alias tl='tmux ls'
	alias tk='tmux kill-session -t'

	# 快速进入tmux（如果不在tmux中）
	if [ -z "$TMUX" ]; then
		alias tm='tmux attach -t main || tmux new -s main'
	else
		alias tm='echo "Already in tmux"'
	fi
	```
  * 使用方式：
	```bash
	tm      # 进入名为main的会话
	t       # 直接输入tmux
	ta dev  # 附加到dev会话
	tn work # 创建名为work的新会话
	tl      # 列出所有会话
	tk dev  # 结束dev会话
	```

1.   **实际场景**


* 实际工作流示例

**场景：开发Web项目**
```
会话：web_project
├── 窗口1：代码编辑
│   ├── 窗格1：Vim编辑器
│   └── 窗格2：文件浏览器
├── 窗口2：服务器
│   ├── 窗格1：前端服务器
│   └── 窗格2：后端服务器
└── 窗口3：数据库
    └── 窗格1：MySQL客户端
```

**操作流程：**
1. 创建会话：`tmux new -s web_project`
2. 在窗口1中：
   - 垂直分屏：`Ctrl+b %`
   - 左侧编辑代码，右侧查看文件
3. 新建窗口2：`Ctrl+b c`
   - 水平分屏：`Ctrl+b "`
   - 分别运行前后端服务器
4. 新建窗口3：`Ctrl+b c`
   - 连接数据库
5. 分离会话：`Ctrl+b d`
6. 稍后重连：`tmux attach -t web_project`

* 实用命令总结

```bash
# 查看所有会话
tmux ls

# 查看会话中的窗口
tmux list-windows -t session_name

# 查看窗口中的窗格
tmux list-panes -t session_name:window_index

# 重命名会话
tmux rename-session -t old_name new_name

# 切换会话
tmux switch-client -t session_name

# 杀死会话
tmux kill-session -t session_name
```

### 状态栏显示
tmux底部状态栏通常显示：
```
[session_name] 0:bash* 1:zsh- 2:mysql- (3 windows)
```
- `*`：当前活动窗口
- `-`：上次活动窗口
- 数字：窗口编号
- 括号内：窗口总数

这种层次结构让你可以：
1. **持久化工作**：分离会话后，所有进程继续运行
2. **多任务管理**：不同会话对应不同项目
3. **灵活布局**：每个窗口可自定义窗格布局
4. **快速切换**：无需打开多个终端标签页