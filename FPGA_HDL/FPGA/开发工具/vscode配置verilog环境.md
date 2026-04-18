### vscode setup for verilog

**一、vscode安装扩展**
1. `Verilog-HDL/SystemVerilog/Bluespec SystemVerilog`
2. `Verilog-Testbench`

---

**二、自动纠错**
1. 在环境变量中添加目标检测器如
	`xvlog: Xilinx/Vivado/2018.3/bin`
	`verilator: /usr/local/bin/verilator`
	`iverilog: /home/mountaincat/tools/oss-cad-suite/bin/iverilog`
2. 在 vscode 设置中搜 `Verilog › Linting: Linter`，设置目标检测器

---

**三、格式化**
1. 从 `https://github.com/chipsalliance/verible` 下载 `verible` 的发行版
2. 在环境变量中添加 `verible/bin`
3. 在 vscode 设置中搜 
	- 指定格式化工具`Verilog › Formatting › System Verilog: Formatter`
		- 选 verible-verilog-format
	- 配置 Verible 二进制路径`Verilog › Formatting › Verible Verilog Formatter: Path`
		- 若已加入系统 PATH：填 verible-verilog-format
	- 添加格式化参数`Verilog › Formatting › Verible Verilog Formatter: Arguments`
		- 可设置`--indentation_spaces=2 --try_wrap_long_lines=false --inplace`
		- `verible-verilog-format --help`查看可用选项
4. 快捷键: `Shift+Ctrl+I` 或右键选格式化文档

---

**四、生成testbench(未完善)**
* vivado的语言模板工具(Setting->Language Templates)

* vscode插件实现
1. 按下 `ctrl+shift+p`，选择 `testbench` 即可生成testbench对应的tb文本。执行的是一个python脚本，还要安装 python 库 `chardet`(/home/mountaincat/.vscode/extensions/truecrab.verilog-testbench-instance-0.0.5/out/vTbgenerator.py)
2. 生成的文本你还需复制粘贴到新建的testbench文件中去，通过下面的设置，可输出生成文件

win:
但是从命令行执行的命令可以看到，这个脚本是用python编写的。顺着文件目录找到原本的python文件，即可修改输出内容。
这里我为了能让输出的testbench自动生成tb文件，上了一段powershell的脚本。

理清一下我们脚本的思路：脚本需要将命令执行，输入的第一个参数为文件名a.v,输出的文件名为tb_a.v.
可以将整个脚本的初始化条件写入powershell的profile文件中（就和bash里的.bashrc一样，ps在启动时会自动加载此配置文件的内容）。

那么profile文件在哪儿呢？打开你的powershell。输入 `echo $profile` 即可。
想编辑文件，直接在命令行输入 code $profile 。
前提是你的vscode添加进系统环境变量了，关于怎么添加环境变量，请看上文。

最后写的脚本如下，只需更改TestBenchPath的值就行了。
修改过后，重启vscode的powershell命令行。输入命令createtb xxx.v，即可输出生成文件
```javascript
function createtb_function{
    param(
        [Parameter(ValueFromPipeline=$true)]
        $InputObject
    )
    $FileName = $InputObject
    $tbFileName = "tb_" + $FileName.split("\")[-1]
    echo $tbFileName
    python $env:TestBenchPath $FileName >> $tbFileName
}

set-alias ll Get-ChildItemColor

$env:TestBenchPath="C:\Users\22306\.vscode\extensions\truecrab.verilog-testbench-instance-0.0.5\out\vTbgenerator.py"

set-alias createtb createtb_function
```


linux:
在您的系统里安装powershell。

再然后在设置里搜索terminal，把终端在linux上使用的路径换成pwsh所在路径。

最后修改powershell的profile文件，不过与windows的略有不同
```javascript
#以后要 使用 ll 而不是 ls了。

function createtb_function{
    param(
        [Parameter(ValueFromPipeline=$true)]
        $InputObject
    )
    $FileName = $InputObject
    $tbFileName = "tb_" + $FileName.split("/")[-1]
    echo $tbFileName
    python $env:TestBenchPath $FileName >> $tbFileName
}

set-alias ll Get-ChildItemColor


$env:TestBenchPath="/home/princeling/.vscode/extensions/truecrab.verilog-testbench-instance-0.0.5/out/vTbgenerator.py"

set-alias createtb createtb_function
```