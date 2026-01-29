### 一、gdb使用

1. `gcc -g main.c -o main`，-g选项的作用是在可执行文件中加入源代码的信息，比如可执行文件中第几条机器指令对应源代码的第几行，但并不是把整个源文件嵌入到可执行文件中，所以在调试时必须保证gdb能找到源文件
2. **按回车可重复执行上一条命令**
3. `gdb -x breakpoints.txt ./<your_program>`加载断点设置文件
4. 命令：
* `help`
  * `help`查看命令的类别
  * `help <类别>`查看类别下对应的可用命令
  * `help <命令>`查看命令的详细文档
* `start`开始或重新调试
* `quit(q)`退出调试
* `list(l)`
  * `list <数字n>`从第n行开始读出10行源码，后面再使用`list`时会从上次读出的最后一行源码开始再读出10行
  * `list <n>,<m>`读出n-m行的源码
  * `list <函数名>`读出函数源码

---

* `next(n)`执行下一条语句，不进入函数
* `step(s)`进入函数执行下一条语句
* `finish`让程序一直运行到从当前函数返回为止
* `continue(c)`执行直到下一个断点为止
* `run(r)`重新开始并连续运行程序

---

* `backtrace(bt)`查看函数调用的栈帧
* `info(i)`
  * `i locals`查看当前选择栈桢的局部变量的值
  * `i breakpoints`查看当前设置了哪些断点
* `frame(f)`
  * `f <数字n>`选择栈桢n
* `print(p)`
  * `p <变量>`打印当前栈桢的选定变量的值
  * `p <c语句>`会先执行c语句，然后打印语句的返回值，所以可用来赋值或执行函数(如printf函数)
* `set var`
  * `set var <变量名>=<值>`
---
* `display <变量>`跟踪显示变量并为其分配一个编号
* `undisplay <变量编号>`取消跟踪显示
* `break(b)`
  * `b <行号>`在对应行设置断点
  * `b <函数名>`在函数开头设置断点
  * `b <> if 条件`条件断点
  * `delete breakpoints <断点号>`
  * `disable breakpoints <断点号>`禁用断点
  * `enable <断点号>`启用断点
* `save breakpoints breakpoints.txt`保存当前断点到文件
* `source breakpoints.txt`调试时恢复断点设置

---

* `x`打印指定存储单元的内容
  * `x/7b`7b是打印格式，b表示每个字节一组，7表示打印7组

---

### 二、核心转储

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
