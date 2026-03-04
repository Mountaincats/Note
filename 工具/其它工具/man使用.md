### man使用
1. Man Page是Linux开发最常用的参考手册，由很多页面组成，每个页面描述一个主题，这些页面被组织成若干个Section。FHS（Filesystem Hierarchy Standard）标准规定了Man Page各Section的含义如下：

    |Section|描述|
    |-|-|
    |1	|用户命令，例如ls(1)|
    |2	|系统调用，例如_exit(2)|
    |3	|库函数，例如printf(3)|
    |4	|特殊文件，例如null(4)描述了设备文件/dev/null、/dev/zero的作用|
    |5	|系统配置文件的格式，例如passwd(5)描述了系统配置文件/etc/passwd的格式|
    |6	|游戏|
    |7	|其它杂项，例如bash-builtins(7)描述了bash的各种内建命令|
    |8	|系统管理命令，例如ifconfig(8)|

2. Man Page中有些页面有重名，比如敲`man printf`命令看到的并不是C函数printf，而是位于第1个Section的系统命令printf，要查看位于第3个Section的printf函数应该敲`man 3 printf`，也可以敲`man -k printf`命令搜索哪些页面的主题包含printf关键字

3. 用户命令通常位于/bin和/usr/bin目录，系统管理命令通常位于/sbin和/usr/sbin目录，一般用户可以执行用户命令，而执行系统管理命令经常需要root权限