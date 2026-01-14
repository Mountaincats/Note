1. 编译
    ```bash
    verilator --cc --exe --build -j 0 -Wall <name>.cpp <name>.v
    ```
* --cc 获取c++输出
* --exe 配合<name>.cpp包装文件，以便构建过程生成可执行文件而不是库
* --build 使 Verilator 调用自身的 make。这样我们就不需要手动作为单独步骤调用 make。编写自己的编译规则并自行运行 make。
* -j 0 使用尽可能多的CPU进行verilate
* -Wall 启用verilator更强的语法警告
* --trace-fst 在模型中启用 FST 波形跟踪，占用空间比 VCD 格式少
* --trace 在模型中启用 VCD 波形跟踪,与 --trace-fst冲突，会被其覆盖
* --lint-only 开展静态代码检查工作, 并以警告信息的方式指出可能存在问题的代码, 而不生成C++文件. 特别地, 你还可以添加-Wall选项, 来让Verilator开启所有类型的检查, 让它帮助你找到更多的潜在问题
<!-- * --lint​ ​编译时同时做静态检查 -->

    最终生成odj_dir目录，其内部的 V< name > 文件为可执行文件

2. 执行
    ```bash
    obj_dir/Vour
    ```

3. 生成波形跟踪文件
   在verilog代码中添加跟踪，或在C++文件中添加跟踪，C++中添加更灵活
   使用FST格式输出，文件会生成在工作目录下，使用如下命令查看。
   ```bash
   gtkwave waveform.fst
   ```
   也可以用GTKWave 应用程序直接查看

4. 文件命名
* main.cpp(最常见、最通用的选择)

* sim_main.cpp(表明是仿真的主程序)

* test_our.cpp(表明是测试 our 模块的文件)

* tb_our.cpp(使用前缀 tb_代表 TestBench)

* <name>.v文件生成的C++类文件和头文件自动为 V<name>.cpp/h

* <name>.v文件名<name> 要与文件中顶层模块名相同

5. 多文件仿真
   ```bash
    verilator --cc --exe --build -j 0 -Wall \
        -I./src \
        -I./src/core \
        -I./src/interfaces \
        -y ./src \
        -y ./src/memory \
        --top-module top \
        sim_main.cpp \
        src/top.v \
        src/core/alu.v \
        src/core/reg_file.v \
        src/memory/ram.v
    ```

* -I<dir>：添加头文件搜索路径

* -y <dir>：添加模块搜索目录

* --top-module：指定顶层模块名

* 列出所有需要编译的源文件（.v/.sv）