## gdb使用

### 一、gdb相关命令
1. `gcc -g main.c -o main`，-g选项的作用是在可执行文件中加入源代码的信息，比如可执行文件中第几条机器指令对应源代码的第几行，但并不是把整个源文件嵌入到可执行文件中，所以在调试时必须保证gdb能找到源文件
2. 启动参数
   * `gdb -x breakpoints.txt ./<your_program>`加载断点设置文件
   * `gdb -tui ./<your_program>`启动时进入TUI模式
   * `gdb ./<your_program> ./<核心转储文件>`加载核心转储文件
3. **gdb中按回车可重复执行上一条命令**
4. 命令：
* `help`
  * `help`查看命令的类别
  * `help <类别>`查看类别下对应的可用命令
  * `help <命令>`查看命令的详细文档
* `start <arg1 arg2 ...>`开始或重新调试并接收参数
* `starti`从第一条机器指令开始执行
* `quit(q)`退出调试
* `list(l)`
  * `list <数字n>`从第n行开始读出10行源码，后面再使用`list`时会从上次读出的最后一行源码开始再读出10行
  * `list <n>,<m>`读出n-m行的源码
  * `list <函数名>`读出函数源码

---

* `layout`打开TUI(Text User Interface)模式，以持续显示代码
  * `layout src`显示源码
  * `layout asm`显示汇编
  * `layout split`显示源码和汇编
  * `layout regs`显示寄存器
* `tui enable/disable`调试中启用或退出`tui`模式
* `快捷键`
  * `Ctrl+X A`切换TUI/普通模式
  * `Ctrl+X 1`单窗口模式
  * `Ctrl+X 2`双窗口模式
  * `Ctrl+L`刷新屏幕（界面错乱时）
  * `方向键`在源码窗口滚动
  * `Ctrl+L`刷新代码显示
* `cgdb`(更好的替代方案)
```
# 安装
sudo apt install cgdb  # Ubuntu/Debian

# 使用
cgdb ./<program>

# 按ESC进入代码窗口，i回到命令窗口
# 在代码窗口中按空格设置断点
```

---

* `next(n)`执行下一条语句，不进入函数
* `step(s)`进入函数执行下一条语句
* `stepi(si)`执行下一条机器指令
* `finish`让程序一直运行到从当前函数返回为止
* `continue(c)`执行直到下一个断点或观察点为止
* `run(r) <arg1 arg2 ...>`重新开始并连续运行程序并接收参数

---

* `backtrace(bt)`查看函数调用的栈帧
* `info(i)`
  * `i locals`查看当前选择栈桢的局部变量的值
  * `i breakpoints`查看当前设置了哪些断点
  * `i watchpoints`查看当前设置了哪些观察点
* `frame(f)`
  * `f <数字n>`选择栈桢n
* `print(p)`
  * `p <变量>`打印当前栈桢的选定变量的值
  * `p <c语句>`会先执行c语句，然后打印语句的返回值，所以可用来赋值或执行函数(如printf函数)
* `x`打印指定存储单元的内容
  * `x/7b <param>`7b是打印格式，b表示每个字节一组，7表示打印7组，打印指定存储单元`param`的内容
* `set var`
  * `set var <变量名>=<值>`

---

* `display <变量>`跟踪显示变量并为其分配一个编号
* `undisplay <变量编号>`取消跟踪显示
* `break(b)`
  * `b <行号>`在对应行设置断点
  * `b <函数名>`在函数开头设置断点
  * `b <文件名.c>:<行号>`在对应文件的位置设置断点
  * `b <> if 条件`条件断点
  * `delete(d) breakpoints <断点号>`
  * `disable breakpoints <断点号>`禁用断点
  * `enable <断点号>`启用断点
* `tbreak <行号>`临时断点
* `save breakpoints breakpoints.txt`保存当前断点到文件
* `source breakpoints.txt`调试时恢复断点设置
* `watch <变量>`对变量设置观察点
* `commands <行号>`自动执行命令的断点
```
(gdb) commands 1
> print variable
> continue
> end
```

---

### 二、.gdbinit配置文件
1. 示例：
```
// 本质是提前制定启动 gdb 后要执行的命令

# 自动设置常用断点
break main
break some_critical_function

# 设置常用显示
display variable_name
set pagination off

# 自动进入TUI模式
tui enable
layout src
set pagination off
```

2. 启用.gdbinit
* **全局设置：**在home目录下加入.gdbinit文件，这时配置全局生效
* **局部设置：**
* gdb安全设置
  * 示例报错：
  ```
  warning: File "/home/mountaincat/ysyx-workbench/nemu/.gdbinit" auto-loading has been declined by your `auto-load safe-path' set to "$debugdir:$datadir/auto-load".
  To enable execution of this file add
  	add-auto-load-safe-path /home/mountaincat/ysyx-workbench/nemu/.gdbinit
  line to your configuration file "/home/mountaincat/.config/gdb/gdbinit".
  To completely disable this security protection add
  	set auto-load safe-path /
  line to your configuration file "/home/mountaincat/.config/gdb/gdbinit".
  ```
  * 关键在编辑/home/mountaincat/.config/gdb/gdbinit文件
    * 完全关闭安全保护：set auto-load safe-path /
    * 仅加载信任的.gdbinit：add-auto-load-safe-path /home/mountaincat/ysyx-workbench/nemu/.gdbinit
  * 配置命令：
  ```
  mkdir -p ~/.config/gdb
  echo "add-auto-load-safe-path /home/mountaincat/ysyx-workbench/nemu/.gdbinit" >> ~/.config/gdb/gdbinit
  ```

---

### 三、核心转储

1. 在/etc/security/limits.conf中添加或设置
   ```bash
    your_user hard core unlimited(硬限制)
    #your_user soft core unlimited(可加#注释)(软限制)
    或直接加
    hard core umlimited
    ```

2. 启用核心转储
   在单一会话中使用
   ```bash
   ulimit -c (-unlimited/0/其它数字) (同时控制软、硬限制大小，只能降，不能升(受硬限制影响))
   ulimit -Hc 0 硬限制hard(只能降，不能升)
   ulimit -Sc 0 软限制soft(可升降)
   [按 1 的配置硬限制为unlimited,软限制为0]
   [若无配置一般硬限制为unlimited,软限制为0]
   ```

3. 限制的查看
    ```bash
    ulimit -c -H  # 查看硬限制
    ulimit -c -S  # 查看软限制
    ulimit -c     #查看当前限制 (当前=软<=硬)
    ```

4. 可以控制转储文件存储路径和文件格式，一般修改/etc/sysctl.conf
   ```bash
    添加
    kernel.core_pattern=core_%p_%u_%s_%e_%t
    默认执行文件目录下，后面选项可改文件格式，

    sudo sysctl -p 文件立即重新加载，无需重启
    ```

5. 转储文件使用
   ```bash
   gdb ./<执行程序文件> ./<核心转储文件>
   ```

---

### 附加到进程

`gdb`可以在不重启程序的情况下，实时调试一个可能已经崩溃或难以复现问题的应用程序(崩溃的服务器、GUI程序等)。以下是核心内容的总结和关键操作步骤：

#### 二、核心操作步骤与命令详解

1.  **查找目标进程ID (PID)**
    *   **命令**：`ps ax | grep ex31`
    *   **目的**：在附加之前，必须先找到目标程序的进程号。这里从输出结果中找到 `./ex31` 对应的PID是 `10026`。
    *   `ps ax`：列出系统中所有正在运行的进程
    *   **示例输出**：
		```
		10026 s000  S+     0:00.11 ./ex31
		10036 s001  R+     0:00.00 grep ex31
		```

2.  **启动GDB并附加到进程**
    *   **命令**：`gdb ./ex31 10026`
    *   **格式**：`gdb <可执行文件路径> <进程PID>`
    *   **结果**：GDB加载符号信息并附加到进程，程序执行被立即挂起（暂停）。提示符 `(gdb)` 出现，表示可以输入调试命令。附加成功后，假定程序停在了 `0x00007fff862c9e42 in __semwait_signal ()` 这个系统调用位置。

3.  **在源文件中设置断点**
    *   **简单设置**：`break 8`
        *   在当前源文件的第8行（`while(i < 100)`）设置断点。
    *   **精确设置**：`break ex31.c:11`
        *   在源文件 `ex31.c` 的第11行设置断点，这是更可靠的指定方式，可避免文件混淆。

4.  **继续执行程序**

5.  **检查程序状态与变量值**
    *   **查看变量**：`p i` (是 `print i` 的缩写)
    *   **目的**：在断点处暂停时，打印变量 `i` 的当前值。讲义中第一次打印 `$1 = 0`，第二次打印 `$2 = 0`，确认了 `i` 没有变化。
    *   **列出源代码**：`list`
    *   **目的**：显示当前停止位置附近的源代码，帮助快速理解上下文。讲义中通过此命令确认了循环体缺少 `i` 的自增语句。

6.  **动态修改变量值（关键高级特性）**
    *   **命令**：`set var i = 200`
    *   **目的**：不修改源代码和重新编译，直接在调试会话中将变量 `i` 设置为200。这使得循环条件 `i < 100` 不再成立，可以验证修改此变量是否能解决循环无法退出的问题。这是GDB一个非常强大的诊断特性。

7.  **单步执行与验证**

8.  **结束调试**

#### 三、关键要点与技巧
*   **附加流程**：`ps找PID` -> `gdb attach PID` -> 程序被挂起，可设置断点/检查状态 -> `cont` 继续运行。
*   **OSX系统注意事项**：在macOS上附加进程时，可能需要输入root密码，并且有时即使输入了密码仍可能遇到权限错误。如果遇到此类问题，需要先停止GDB和目标程序，然后重新启动目标程序再尝试附加。
