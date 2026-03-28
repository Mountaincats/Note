### 工具说明

“对于c和c++编译工具链的其它工具绝大多数是完全一样的”
- C和C++编译过程中，**共用Binutils工具集**（如 `as` 汇编器、`ld` 链接器、`objdump` 分析工具等）——这些工具是“架构专属、语言无关”的，不管编译C还是C++，调用的都是同一个 `riscv64-linux-gnu-ld`、同一个 `riscv64-linux-gnu-as`；
- 只有 **编译器前端** 是分开的：编译C用 `gcc`，编译C++用 `g++`（但 `g++` 本质是 `gcc` 的封装，底层逻辑一致，只是多了C++语法解析和标准库链接）。

### 一、工具分类

| 工具类型                | 具体工具示例                          | 用途                                  | 语言相关性       |
|-------------------------|---------------------------------------|---------------------------------------|------------------|
| **C编译器核心**         | riscv64-linux-gnu-gcc、gcc-11         | 编译C代码（11是GCC版本号）            | 仅C              |
| **C++编译器核心**       | riscv64-linux-gnu-g++、g++-11         | 编译C++代码                           | 仅C++（兼容C）   |
| **Binutils基础工具**    | as、ld、ar、objdump、readelf、strip   | 汇编、链接、归档、反汇编、分析、瘦身  | 无（C/C++共用）  |
| **编译辅助工具**        | cpp（预处理器）、c++filt（符号解析）  | 预处理代码、解析C++符号（cpp也用于C） | 部分共用（如cpp）|
| **调试/分析工具**       | gcov（覆盖率）、gprof（性能分析）     | 代码分析、性能调优                    | 共用（C/C++都能用）|

#### 关键补充：
- 带 `-11` 后缀的工具（如 `gcc-11`、`g++-11`）是“指定版本的编译器”，而不带后缀的（如 `gcc`、`g++`）是系统软链接，指向当前默认版本（通常是11），如：敲 riscv64-linux-gnu-gcc，系统其实是执行 riscv64-linux-gnu-gcc-11；敲 riscv64-linux-gnu-g++，其实是执行 riscv64-linux-gnu-g++-11
  - 方便切换版本：如果系统装了 GCC 10 和 GCC 11，只需修改软链接指向，就能切换默认版本，不用改代码 / 脚本里的编译命令；
	- 兼容不同版本需求：想强制用 11 版本就敲 gcc-11，想兼容默认版本就敲 gcc。
- `gcc-ar`/`gcc-nm`/`gcc-ranlib` 是GCC封装的归档工具，本质还是调用 `ar`/`nm`/`ranlib`，只是适配了GCC的编译流程，C/C++共用。

### 二、实操验证：C和C++共用工具的例子
1. 写一个简单的C文件 `test.c`：
   ```c
   #include <stdio.h>
   int main() { printf("Hello RISC-V C\n"); return 0; }
   ```
2. 编译C代码并查看链接器：
   ```bash
   # 编译C代码（加-v参数，显示编译过程）
   riscv64-linux-gnu-gcc test.c -o test_c -v
   ```
   输出中会看到：`collect2 ... /usr/lib/riscv64-linux-gnu/ld`（调用的是共用的ld链接器）。

3. 写一个简单的C++文件 `test.cpp`：
   ```cpp
   #include <iostream>
   int main() { std::cout << "Hello RISC-V C++\n"; return 0; }
   ```
4. 编译C++代码并查看链接器：
   ```bash
   riscv64-linux-gnu-g++ test.cpp -o test_cpp -v
   ```
   输出中会看到：**调用的是同一个ld链接器**，只是多了链接C++标准库（`libstdc++.so`）的步骤。
