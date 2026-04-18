1. `git help`

2. 
```bash
git branch -M <name>
# 当前分支重命名
```

3. 
```bash
git push -u origin main
# 将本地 main分支上的所有提交推送到远程仓库 origin。-u参数用于建立本地分支与远程分支的追踪关系，设置之后，再次推送时直接使用 git push即可
```

4. 
```bash
git remote
#　查看已有的关联远程分支
git remote rm <name>
# 删除关联
```

```bash
git remote add origin <address of repository>
# 为本地仓库添加一个名为 origin 的远程仓库地址
```

```bash
# 先查看当前的远程仓库名称，通常叫 origin
git remote -v

# 更新远程仓库地址（以 origin 为例）
git remote set-url origin <新地址>
```

5. `git log`
* 可在`.bashre`中设置别名`alias gitlog="git log --graph --all"`
* 参数：
  * --graph 
  * --all 
  * --oneline 
  * --not <branch name> <branch name> ...
  * -n <num> 显示最近<num>条记录
  * --since="<2024-01-01>"
  * --author="<author name>"

6. 修改提交记录
* 修改提交信息
  * 最近一次: `git commit --amend` or `git commit --amend -m "新的提交信息"`