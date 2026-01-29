### 一、文件检索工具
1. **`cat`**  
   - **作用**：连接文件并打印到标准输出（快速查看小文件、合并文件）。  
   - **示例**：  
     ```bash
     cat file.txt          # 查看文件内容
     cat file1.txt file2.txt > combined.txt  # 合并文件
     ```

2. **`more` / `less`**  
   - **作用**：分页查看大文件（`less` 支持反向滚动和搜索）。  
   - **示例**：  
     ```bash
     less large_log.log    # 分页浏览，支持 /keyword 搜索
     more +10 file.txt     # 从第10行开始显示
     ```

3. **`head` / `tail`**  
   - **作用**：查看文件开头/结尾部分（默认10行）。  
   - **示例**：  
     ```bash
     head -n 5 access.log  # 显示前5行
     tail -f app.log       # 实时追踪日志新增内容（调试必备）
     ```

4. **`file`**  
   - **作用**：检测文件类型（如二进制、文本、压缩包）。  
   - **示例**：  
     ```bash
     file unknown.bin unknown2.bin    
     # 输出 "unknown.bin: ELF executable unknown2.bin:ELF executable"
     ```

5. **`find`**  
   - **作用**：递归搜索目录中的文件（支持名称、大小、时间过滤）。  
   - **示例**：  
     ```bash
     find /var/log -name "*.log" -size +10M  # 查找大于10MB的日志文件
     find ~ -type f -mtime -7               # 查找7天内修改过的文件
     ```

---

### 二、输入输出控制
1. **重定向**  
   - `>`：覆盖输出到文件（`echo "text" > file.txt`）。  
   - `>>`：追加到文件（`echo "new" >> file.txt`）。  
   - `<`：从文件读取输入（`sort < unsorted.txt`）。

2. **管道 `|`**  
   - **作用**：将前一个命令的输出作为后一个命令的输入。  
   - **示例**：  
     ```bash
     ps aux | grep nginx    # 过滤出nginx进程
     cat logs/*.log | sort | uniq -c  # 统计所有日志中唯一行出现次数
     ```

3. **`tee`**  
   - **作用**：同时输出到屏幕和文件（调试日志记录）。  
   - **示例**：  
     ```bash
     make | tee build.log  # 显示编译输出并保存到文件
     ```

4. **`xargs`**  
   - **作用**：将输入转换为命令参数（处理大量文件时避免参数过长）。  
   - **示例**：  
     ```bash
     find . -name "*.tmp" | xargs rm  # 删除所有临时文件
     echo {1..1000} | xargs -n 10     # 每行输出10个数字
     ```

---

### 三、文本处理工具
1. **`grep`**  
   - **作用**：基于正则表达式搜索文本。  
   - **示例**：  
     ```bash
     grep "error" /var/log/syslog     # 查找包含"error"的行
     grep -r --include="*.py" "import" src/  # 递归搜索Python文件中的import
     ```
   - **相似工具**:ripgrep(rg)

2. **`awk`**  
   - **作用**：按列处理文本（支持条件过滤、计算）。  
   - **示例**：  
     ```bash
     awk '{print $1}' access.log      # 提取第一列（IP地址）
     awk -F: '$3 > 1000 {print $1}' /etc/passwd  # 提取UID>1000的用户名
     ```

3. **`sed`**  
   - **作用**：流编辑器（替换、删除、插入文本）。  
   - **示例**：  
     ```bash
     sed 's/foo/bar/g' file.txt      # 全局替换"foo"为"bar"
     sed '/^#/d' config.conf         # 删除所有注释行（以#开头）
     ```

4. **`sort` / `uniq` / `wc`**  
   - **组合用例**：  
     ```bash
     sort log.txt | uniq -c | sort -nr  # 统计重复行并排序
     wc -l file.txt                    # 计算文件行数
     ```

5. **`cut` / `tr`**  
   - **示例** :  
     ```bash
     cut -d: -f1 /etc/passwd          # 提取用户名（冒号分隔的第一列）
     tr '[:lower:]' '[:upper:]' < file.txt  # 转换为大写
     ```
     
6. **`indent`**
   - **作用** :代码格式化
   - **示例** :
     ```bash
     indent -kr -i4 -l80
     ```

---

### 四、正则表达式（Regex）
- **核心语法**：  
  - `.`：匹配任意单字符  
  - `*`：前字符重复0次或多次  
  - `^` / `$`：匹配行首/行尾  
  - `[a-z]` / `\d`：字母或数字类  
- **工具支持**：  
  ```bash
  grep -E "error|warning"  # 扩展正则（匹配error或warning）
  sed -E 's/[0-9]{3}/***/g'  # 替换所有三位数为***
  ```

---

### 五、系统监控工具
1. **`jobs` / `bg` / `fg`**  
   - **作用**：管理后台任务（`Ctrl+Z`暂停，`bg`放入后台，`fg`恢复前台）。

2. **`ps`**  
   - **作用**：查看进程快照。  
   - **示例**：  
     ```bash
     ps aux | grep sshd     # 显示sshd进程详情
     ps -ef --forest       # 树形展示进程层级
     ```

3. **`top` / `htop`**  
   - **作用**：实时监控资源占用（CPU、内存、进程）。  
   - **优势**：`htop`支持交互式操作（排序、杀死进程）。

4. **`kill`**  
   - **作用**：终止进程。  
   - **示例**：  
     ```bash
     kill -9 1234          # 强制终止PID为1234的进程
     pkill -f "python script.py"  # 按名称终止进程
     ```

5. **`free`**  
   - **作用**：显示内存使用（`free -h`以易读格式输出）。

6. **`dmesg`**  
   - **作用**：查看内核环形缓冲区消息（硬件故障诊断）。  
   - **示例**：  
     ```bash
     dmesg | grep -i "usb"  # 检查USB设备连接日志
     ```

7. **`lsof`**  
   - **作用**：列出打开的文件（诊断文件占用问题）。  
   - **示例**：  
     ```bash
     lsof /var/log/syslog   # 查看谁在读写syslog
     lsof -i :80            # 查看占用80端口的进程
     ```

---

### 六、其它
1. **`objdump`**
   - **作用：** 反汇编
   - **示例：**
     ```bash
         objdump -d <二进制文件名> > output
     ```
2. **`time`**
   - **作用：** 显示程序运行时间
   - **示例：**
      ```bash
      time ./<二进制程序名>
      ```
3. **`du`**
   - **作用：** 磁盘空间分析
   - **示例：** 
      ```bash
      du -sc /usr/share/*
      # 将目录的大小顺次输出到标准输出
      ```
4. **`history`**
   - **示例：**
      ```bash
      history -c #清空当前会话的历史命令记录
      history | grep find #会打印历史命令中包含 find 子串的命令
      ```
5. **`chmod`**
   - **作用:** 设置文件访问权限
   - **示例:**
      ```bash
      chmod 600 ~/.ssh/id_rsa7

      chmod [who][operator][permissions] (,[who][operator][permissions],[who][operator][permissions]) 文件名
      who: u用户, g组, o其它, a全部
      operator: +添加, -移除, =指定权限
      permissions: r读(4), w写(2), x执行/进入目录(1)
      或
      chmod [数字权限] 文件名
      用户权限: u权限 × 100, 组权限：g权限 × 10, 其他权限：o权限 × 1
      例755 rwxr-xr-x (三个一组，-代表无该权限)
      ```

6. **`ln`**
   - **作用** 创建快捷方式
   - **示例**
      ```bash
      ln -s /mnt/shared ~/Desktop/shared_disk
      #第一个是目标文件/文件夹，第二个是快捷方式的位置
      ```
---

### 七、高效组合案例 查看当前工作目录路径
1. **日志分析**：  
   ```bash
   tail -f app.log | grep "ERROR" --color  # 实时高亮错误
   ```
2. **批量重命名**：  
   ```bash
   ls *.jpg | sed 's/2023/2024/' | xargs -I{} mv {} {}.new
   ```
3. **内存占用统计**：  
   ```bash
   ps aux | awk '{print $4"\t"$11}' | sort -nr | head  # 按内存排序进程
   ```

---

### 八、其它技巧
1. **隐藏历史命令**:
   你可以修改 shell history 的行为，例如，如果在命令的开头加上一个空格，它就不会被加进 shell 记录中。当你输入包含密码或是其他敏感信息的命令时会用到这一特性。 为此你需要在 .bashrc 中添加 HISTCONTROL=ignorespace 或者向 .zshrc 添加 setopt HIST_IGNORE_SPACE。 如果你不小心忘了在前面加空格，可以通过编辑 .bash_history 或 .zhistory 来手动地从历史记录中移除那一项。
