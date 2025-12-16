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

3. **退出会话、结束会话和连入会话**
```bash
连入会话：tmux attach-session -t <name/number>
tmux窗口内逐步结束窗格：ctrl+d
bash窗口内结束会话：tmux kill-session -t <name/number>
退出会话：ctrl+b d
直接结束会话：按前缀键 Ctrl+b，再输入 :进入命令模式，再输入kill-session
```

---

4. **光标移动**  
```bash
ctrl+b 箭头符
```

---

5. **选择会话、窗口、窗格**
```bash
tmux和bash中均可行，列出会话和窗口分布、并可用来选择会话、窗口、窗格：ctrl+b s(按Esc退出选择)
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