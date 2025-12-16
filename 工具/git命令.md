1.
```bash
git branch -M <name>
# 当前分支重命名
```

2.
```bash
git remote add origin <address of repository>
# 为本地仓库添加一个名为 origin 的远程仓库地址
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

5.


