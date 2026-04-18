RISC-V 架构中，寄存器除了使用数字编号（如 `x0`、`x1`、`x2`...）外，还定义了**ABI（Application Binary Interface）名称**，用于在汇编和编程中更清晰地表示其标准用途。这些别名由汇编器识别。

以下是主要的寄存器及其别名列表：

### 1. 整数寄存器 (32个，RV32I/RV64I)
**ABI名称**是软件约定，**硬件/汇编器别名**通常被汇编器直接支持。

| 寄存器编号 | ABI 名称         | 别名/汇编器名称 | 用途描述                                                                | 调用约定 (Caller/Callee) |
| :--------- | :--------------- | :-------------- | :---------------------------------------------------------------------- | :----------------------- |
| x0         | zero             | -               | 硬连线零值，写入被忽略，读取始终为0。                                    | 不适用                   |
| x1         | ra               | -               | 返回地址 (Return Address)。                                             | Callee-saved (可选)      |
| x2         | sp               | -               | 栈指针 (Stack Pointer)。                                                | Callee-saved             |
| x3         | gp               | -               | 全局指针 (Global Pointer)。                                             | -                        |
| x4         | tp               | -               | 线程指针 (Thread Pointer)。                                             | -                        |
| x5         | t0               | -               | 临时寄存器 / 备用链接寄存器 (Temporary/Alternate Link Register)。       | Caller-saved             |
| x6         | t1               | -               | 临时寄存器。                                                            | Caller-saved             |
| x7         | t2               | -               | 临时寄存器。                                                            | Caller-saved             |
| x8         | s0 / fp          | fp (s0)         | 保存寄存器 / 帧指针 (Saved Register / Frame Pointer)。                  | Callee-saved             |
| x9         | s1               | -               | 保存寄存器。                                                            | Callee-saved             |
| x10 - x11  | a0 - a1          | -               | **函数参数/返回值** (Function Arguments / Return Values)。              | Caller-saved             |
| x12 - x17  | a2 - a7          | -               | **函数参数** (Function Arguments)。                                     | Caller-saved             |
| x18 - x27  | s2 - s11         | -               | 保存寄存器。                                                            | Callee-saved             |
| x28 - x31  | t3 - t6          | -               | 临时寄存器。                                                            | Caller-saved             |

**关键说明**：
*   **`fp` 别名**：`x8` (s0) 寄存器通常也用作帧指针 `fp`，尤其是在需要清晰的栈回溯时。
*   **`zero` 的特殊性**：`x0` 是唯一一个只读寄存器，汇编器会识别 `zero`。

### 2. 浮点寄存器 (32个，F/D/Q扩展)
浮点寄存器的ABI命名模式类似，使用 `f` 前缀。

| 寄存器编号 | ABI 名称         | 用途描述                                                                 | 调用约定 (Caller/Callee) |
| :--------- | :--------------- | :----------------------------------------------------------------------- | :----------------------- |
| f0 - f7    | ft0 - ft7        | 临时浮点寄存器。                                                          | Caller-saved             |
| f8 - f9    | fs0 - fs1        | 保存浮点寄存器。                                                          | Callee-saved             |
| f10 - f11  | fa0 - fa1        | **浮点函数参数/返回值**。                                                 | Caller-saved             |
| f12 - f17  | fa2 - fa7        | **浮点函数参数**。                                                        | Caller-saved             |
| f18 - f27  | fs2 - fs11       | 保存浮点寄存器。                                                          | Callee-saved             |
| f28 - f31  | ft8 - ft11       | 临时浮点寄存器。                                                          | Caller-saved             |

### 3. 控制状态寄存器 (CSRs)
控制状态寄存器通过其唯一的**12位CSR地址**访问，通常使用**助记符**作为其“别名”。例如：
*   `mstatus` (机器状态寄存器，地址 0x300)
*   `mtvec` (机器异常入口基址寄存器，地址 0x305)
*   `mepc` (机器异常程序计数器，地址 0x341)
*   `mcause` (机器异常原因寄存器，地址 0x342)
*   `mip` / `mie` (中断相关寄存器，地址 0x344 / 0x304)
*   `cycle` / `time` / `instret` (性能计数器，地址 0xC00 / 0xC01 / 0xC02)

在汇编中直接使用这些助记符，如 `csrrw t0, mstatus, t1`。

### 总结
*   **核心别名**：整数寄存器的 `zero`、`ra`、`sp`、`gp`、`tp`、`a0-a7`、`t0-t6`、`s0-s11`。
*   **重要双重角色**：`x8` 是 `s0` 也是 `fp` (帧指针)；`a0` 和 `a1` 兼作整数返回值寄存器。
*   **浮点别名**：`ft0-ft11`、`fa0-fa7`、`fs0-fs11`。
*   **CSR别名**：使用预定义的英文助记符。

在编写RISC-V汇编代码时，使用这些别名（如 `li a0, 42` 而不是 `li x10, 42`）能使代码更易读、更符合标准。