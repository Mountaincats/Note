在 Makefile 中**不能直接使用**在 `.bashrc` 或其他 Shell 配置文件（如 `.bash_profile`、`.zshrc`）中定义的环境变量。

这是因为：
1.  **执行环境不同**：Makefile 由 `make` 进程执行，它通常启动的是一个**非交互式、非登录**的 Shell 来运行每条规则中的命令。这种 Shell 默认不会加载你的用户配置文件（如 `~/.bashrc`）。
2.  **作用域隔离**：在 Shell 中通过 `export` 导出的环境变量，是父进程传递给子进程的。如果你的 `make` 命令是从一个已经加载了 `.bashrc` 的 Shell 中启动的，那么**在启动 `make` 时已经存在的环境变量**可以被 Makefile 的规则命令访问。但是，Makefile 的语法部分（如变量赋值、目标/依赖关系）是在 `make` 进程中解析的，它不能直接读取 Shell 环境变量，除非你通过特殊方法导入。

**如何解决这个问题：**

你可以通过以下几种方法，在 Makefile 中使用来自 Shell 环境或配置文件的值：

---

### 方法1：在运行 `make` 前导出变量 (最常用)
在你的 Shell 中，确保所需的变量被 `export`，然后再运行 `make` 命令。
```bash
# 在 Shell 中操作
export MY_VAR="value_from_bashrc"
make target
```
或者在 `.bashrc` 中定义变量时就导出：
```bash
# 在 ~/.bashrc 中
export MY_GLOBAL_VAR="some_value"
```
然后重新加载配置文件或打开新的终端，再运行 `make`。此时，Makefile 规则中的 Shell 命令就能通过 `$MY_GLOBAL_VAR` 访问到这个环境变量。

**在Makefile中引用时，需要使用两个`$`符号，因为单个`$`是Makefile的变量标识符：**
```makefile
print-var:
    echo $$MY_GLOBAL_VAR  # 在命令中引用Shell环境变量
```

---

### 方法2：在 Makefile 中通过 `shell` 函数调用获取
如果变量是在你的当前 Shell 环境中定义的（例如，你通过 `. ~/.bashrc` 或 `source ~/.bashrc` 加载了配置），你可以在 Makefile 中使用 `$(shell ...)` 函数来运行一个 Shell 命令并捕获其输出，然后赋给一个 Makefile 变量。
```makefile
# 尝试获取 Shell 环境变量。注意：这只有在运行 make 的父Shell中有此变量时才有效。
MY_MAKE_VAR := $(shell echo $$MY_GLOBAL_VAR)

all:
    echo "Makefile变量值是: $(MY_MAKE_VAR)"
    echo "直接访问环境变量: $$MY_GLOBAL_VAR"
```
**重要**：如果 `make` 的父进程（你运行 `make` 命令的那个终端）没有 `MY_GLOBAL_VAR` 这个环境变量，那么 `$(shell echo $$MY_GLOBAL_VAR)` 会得到空值。

---

### 方法3：通过 `include` 指令包含一个由 Shell 生成的 Makefile 片段
你可以写一个 Shell 脚本，将你的 `.bashrc` 中的特定变量输出为 Makefile 格式，然后在 Makefile 中包含它。
```makefile
# 生成一个包含变量定义的文件
vars.mk:
    env | grep ^MY_ > vars.mk  # 将 MY_ 开头的环境变量导出为文件

# 包含这个文件
-include vars.mk

print-all:
    @echo "MY_VAR = $(MY_VAR)"
```
这种方法更复杂，通常用于构建系统需要动态配置的场景。

---

### 方法4：在调用 make 时通过命令行传递变量
你可以从 Shell 中读取配置，然后作为参数传递给 `make`。
```bash
# 在Shell中
source ~/.bashrc  # 加载变量定义
make my_target MY_VAR="$MY_GLOBAL_VAR"  # 将其作为参数传递
```
在 Makefile 中，`$(MY_VAR)` 就能使用这个值了。这确保了变量值在 Makefile 解析时是明确已知的。

---

**总结与建议**：
- 对于大多数个人项目，**方法1**（确保变量在 Shell 环境中被导出，然后在运行 `make` 前加载）是最简单、最直接的方式。
- 如果变量是系统级或项目级的关键配置，**方法4**（通过命令行传递）或**方法2**（在 Makefile 中通过 `shell` 函数读取）也很常用，尤其是与 `.env` 文件结合时。
- 记住，Makefile 的语法和 Shell 的语法是**两个不同阶段**。Makefile 变量（如 `$(VAR)`）在 **`make` 解析阶段** 展开，而规则内的 Shell 命令（如 `echo $$VAR`）则在 **Shell 执行阶段** 展开。

**一个清晰的例子**：
```makefile
# 假设在 Shell 中 export MY_NAME="World"

# 在 Makefile 中：
GREETING = Hello  # 这是 Makefile 变量

# 目标
say-hello:
    # 下面这行会被展开为: echo "Makefile says: Hello"; echo "Shell env says: World"
    echo "Makefile says: $(GREETING)"
    echo "Shell env says: $$MY_NAME"
```

运行：
```bash
export MY_NAME="World"
make say-hello
```
输出：
```
Makefile says: Hello
Shell env says: World
```