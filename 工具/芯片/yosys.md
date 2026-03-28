针对您这个基于 FPGA 的实时时钟（RTC）项目，使用 Yosys 生成架构图的步骤如下：

## 1. 安装必要工具
确保已安装 Yosys 和 Graphviz：
```bash
# Ubuntu/Debian
sudo apt-get install yosys graphviz

# 或从源码编译 yosys
git clone https://github.com/YosysHQ/yosys.git
cd yosys
make
sudo make install
```

## 2. 创建 Yosys 脚本文件
在当前目录创建 `generate_graph.tcl` 文件：

```tcl
# 读取所有 Verilog 文件
read_verilog ds1302_ctrl.v
read_verilog ds1302_io.v
read_verilog ds1302_test.v
read_verilog seg.v
read_verilog spi_master.v
read_verilog top.v

# 设置顶层模块（根据 top.v 中的模块名）
hierarchy -check -top top

# 生成 DOT 格式的结构图
# -format dot: 输出 DOT 格式
# -prefix rtl_graph: 输出文件前缀
# -width: 可选的宽度参数
show -format dot -prefix rtl_graph
```

## 3. 运行 Yosys 生成 DOT 文件
```bash
yosys -c generate_graph.tcl
```
或使用单行命令：
```bash
yosys -p "read_verilog ds1302_ctrl.v ds1302_io.v ds1302_test.v seg.v spi_master.v top.v; hierarchy -top top; show -format dot -prefix rtl_graph"
```

## 4. 转换为可视化图片
使用 Graphviz 的 `dot` 工具：
```bash
# 生成 PNG
dot -Tpng rtl_graph.dot -o rtl_graph.png

# 或生成 SVG（可缩放矢量图，推荐）
dot -Tsvg rtl_graph.dot -o rtl_graph.svg

# 生成 PDF
dot -Tpdf rtl_graph.dot -o rtl_graph.pdf
```

## 5. 进阶选项
### 只查看特定模块层次
```bash
yosys -p "
read_verilog {ds1302_ctrl.v,ds1302_io.v,ds1302_test.v,seg.v,spi_master.v,top.v};
hierarchy -top top;
write_dot -label hierarchy.dot
"
dot -Tpng hierarchy.dot -o hierarchy.png
```

### 生成更详细的 RTL 图
```bash
yosys -p "
read_verilog *.v;
hierarchy -top top;
prep;  # 准备设计
show -format dot -prefix rtl_detailed
"
```

## 6. 批量生成各个模块的图
创建脚本 `generate_all.sh`：
```bash
#!/bin/bash
# 生成顶层模块
yosys -p "read_verilog *.v; hierarchy -top top; show -format dot -prefix top_module" 2>&1 | grep -v "Warning"
dot -Tsvg top_module.dot -o top_module.svg

# 生成各个子模块
modules=("ds1302_ctrl" "ds1302_io" "seg" "spi_master")
for module in "${modules[@]}"; do
    echo "生成 $module 模块图..."
    yosys -p "read_verilog ${module}.v; hierarchy -top ${module}; show -format dot -prefix ${module}" 2>&1 | grep -v "Warning"
    dot -Tsvg "${module}.dot" -o "${module}.svg" 2>/dev/null
done

echo "完成！生成的SVG文件："
ls *.svg
```
运行：
```bash
chmod +x generate_all.sh
./generate_all.sh
```

## 注意事项
1. **确认顶层模块名**：检查 `top.v` 中实际的模块名，可能与文件名不同
2. **依赖关系**：Yosys 会自动解析模块间的依赖
3. **大型设计**：如果设计复杂，生成图片可能很大，可添加 `-viewer` 参数用GUI查看
4. **优化输出**：添加 `scc` 命令可减少重复图形
   ```bash
   yosys -p "read_verilog *.v; hierarchy -top top; scc; show -format dot -prefix optimized"
   ```

## 查看结果
- 生成的图片可直接用图片查看器打开
- SVG 格式可在浏览器中查看，支持缩放
- 图中会显示模块实例、端口、连线等元素

这样您就能得到项目的RTL级架构图，有助于理解模块间的连接关系和数据流。