1. `man gcc`中查阅`-fsanitize`选项
    * Address Sanitizer
2. `-Wall`, `-Werror`和`-Wextra`
    * `-Wall`启用大多数常见警告，但并非“所有警告”
    * `-Werror`将警告视为错误
    * `-Wextra`开启了许多有用但未被纳入`-Wall`的警告，作为对`-Wall`的重要补充。可能会“过度警告”，可以通过 -Wno-<warning>禁用特定警告
3. 静态分析器启用(要求gcc10以上版本)：`-fanalyzer`
4. **gcc手册**中关于c语言的主要章节：
    * 命令行选项
    * 实现定义行为
    * 非标准语言扩展特性
    * `gcov`等工具介绍
    * `gcc`工具的其它可能问题