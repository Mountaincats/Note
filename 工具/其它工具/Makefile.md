## Makefile

### 1. 基础语法与符号
*   **命令修饰符**
    *   **`@`**: 不显示命令本身，只显示结果。`@echo "Building..."`
    *   **`-`**: 忽略命令的错误，继续执行。`-rm -f *.o`
*   **自动变量** (在规则的命令列表中使用)
    *   **`$@`**: 规则中的目标。
    *   **`$<`**: 规则中的第一个依赖。
    *   **`$?`**: 所有比目标新的依赖列表。
    *   **`$^`**: 规则中所有依赖的列表。
*   **常用的预定义变量**
    *   **`CC`**: C编译器的名字，缺省是`cc`。
    *   **`CFLAGS`**: C编译器的选项。
    *   **`CPPFLAGS`**: C预处理器的选项。
    *   **`RM`**: 删除命令，缺省是`rm -f`。
*   **变量**
    *   **`=`**
    *   **`:=`**
    *   **`?=`**
    *   **`+=`**
*   **`include` 指令**: 包含其他Makefile文件。
    *   make会把include的文件名也当作目标来尝试更新，执行它们的命令列表。

### 2. 依赖管理与命令执行
*   **生成头文件依赖**
    ```bash
    gcc -M *.c    # 生成包含系统头文件的依赖
    gcc -MM *.c   # 生成不包含系统头文件的依赖
    ```
*   **`make` 常用命令行选项**
    *   **`-n`**: 只打印命令，不执行。用于调试。
    *   **`-C <dir>`**: 切换到指定目录执行该目录下的Makefile。`make -C src`
    *   **`-p`**: 打印隐含规则数据库。
    *   **在命令行定义变量**: `make CFLAGS=-g`

### 3. 规则详解
*   **多条规则与命令列表**: 一个目标可以有多条规则，但只能有一条规则有命令列表，否则会警告并采用最后一条。
*   **多目标的规则**: 对于多目标的规则，make会拆成几条单目标的规则来处理，每条规则的命令相同
*   **隐含规则** (Implicit Rule): 如果一个目标没有命令列表，`make`会尝试在隐含规则数据库中查找匹配的规则。
*   **模式规则** (Pattern Rule)
    *   全局适用，格式为 `%.目标后缀: %.依赖后缀`。
    *   **注意**: 可能匹配到意外的目标。
    ```makefile
    %.o: %.c
    %.o: %.c %.h
    ```
*   **静态模式规则** (Static Pattern Rule)
    *   只应用于明确指定的目标列表，更精确可控。
    *   格式为 `<目标列表>: <目标模式>: <依赖模式>`。
    ```makefile
    $(OBJECTS): %.o: %.c
    ```

### 4. 函数、变量与上下文
*   **Makefile 函数调用语法**
    *   格式为 `$(function arguments)`。**这是 Makefile 特有的语法**，只能在非缩进的Makefile上下文中使用。
*   **三种不同上下文中的函数调用**
    1.  **Makefile 上下文 (正确)**：在变量赋值和规则目标/依赖中。
        ```makefile
        SOURCES = $(wildcard src/**/*.c)  # ✅ Makefile函数
        ```
    2.  **Shell 上下文 (错误)**：在终端直接输入。
        ```bash
        $(wildcard src/*.c) # ❌ Shell会尝试执行名为`wildcard`的命令
        ```
    3.  **规则命令中的混淆 (需注意)**：在缩进的命令列表中，`$(…)`会被`make`展开后传给Shell。若要使用Shell的命令替换，需转义为`$$(…)`。
        ```makefile
        clean:
            rm -rf $(OBJECTS)    # ✅ $(OBJECTS) 被make展开
            echo $$(ls *.c)       # ✅ $$(…) 作为Shell命令替换执行
            $(wildcard *.o)       # ❌ 错误！Shell找不到`wildcard`命令
        ```
*   **Makefile 核心函数列表**
    | 函数类别 | 示例 | 说明 |
    |---|---|---|
    | **文本处理** | `$(subst from,to,text)` | 字符串替换 |
    |  | `$(patsubst pattern,replacement,text)` | 模式替换，`$(patsubst %.c,%.d,$(SOURCES))`等价`$(SOURCES:.c=.d)` |
    |  | `$(strip string)` | 去除首尾空格 |
    | **文件名操作** | `$(wildcard pattern)` | 通配符扩展 |
    |  | `$(dir names…)` | 提取目录部分 |
    |  | `$(notdir names…)` | 提取文件名部分 |
    | **控制流** | `$(if condition,then-part,else-part)` | 条件判断 |
    |  | `$(foreach var,list,text)` | 循环 |
    |  | `$(call expr,param,…)` | 调用用户函数 |
    | **Shell交互** | `$(shell command)` | **在Makefile中**执行Shell命令 |
    | **信息输出** | `$(info text…)` | 输出信息 |

*   **关键区别：变量展开 vs 函数调用**
    ```makefile
    CFLAGS = -g -O2
    # 变量展开（获取变量的值）
    $(CFLAGS)           # 展开为 -g -O2

    # 函数调用（执行一个操作）
    FILES = $(wildcard *.c)  # 调用wildcard函数
    ```

*   **重要的交叉点：`$(shell …)` 函数**
    *   此函数允许在**Makefile解析阶段**执行Shell命令，并将其输出作为字符串捕获。
    ```makefile
    # 正确用法（在Makefile上下文中）
    GIT_HASH := $(shell git rev-parse --short HEAD)
    CURRENT_FILES := $(shell ls *.c)

    # 错误用法（在Shell上下文中不加转义）
    target:
        $(shell ls)   # ❌ Shell会尝试执行一个叫‘shell’的命令
        $$(shell ls)  # ❌ Shell会尝试执行一个叫‘shell’的命令
    ```

### 5. 语法总结
| 上下文 | 示例 | 处理者 | 结果 |
|---|---|---|---|
| **Makefile变量** | `$(CFLAGS)` | `make` | 展开为变量值 |
| **Makefile函数** | `$(wildcard *.c)` | `make` | 执行函数，返回结果 |
| **Shell命令** | `ls *.c` | `Shell` | 列出文件 |
| **Shell变量** | `$$HOME` 或 `$(HOME)` | `Shell` | 展开为环境变量 |
| **Shell命令替换** | `$$(ls *.c)` | `Shell` | 执行命令，捕获输出 |

**关键原则**：在 **非缩进** 的 Makefile 行中，`$(…)` 由 Make 处理；在 **缩进** 的命令行中，`$(…)` 会先由 Make 展开一次，若要传递 `$()` 给 Shell，需转义为 `$$(…)`。