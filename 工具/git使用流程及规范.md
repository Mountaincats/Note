1. 队员接受邀请后，需要先在本地配置Git用户信息：
   ```bash
    git config --global user.name "队员的GitHub用户名"
    git config --global user.email "队员的GitHub验证邮箱"
    ```
2. 将项目克隆到本地：
   ```bash
   git clone https://github.com/Mountaincats/Student_Schedule.git
   ```

3.  具体操作流程！！！！
   先介绍我们主要有的几个分支：main, develop,feature/xxx。它们的作用及关系如下
      #### 作用
      - main:大版本，比如app完成第一个demo、实现登陆功能等等，就可以将代码合并到main分支上
      - develop：这是我们的主要开发分支，一般工作流程中你们的代码都是合并到此分支上，而develop分支的代码可以由我负责合并到main分支上
      - feature/xxx:这是develop分支上的特性分支，可以有多个，xxx为特性名，自己取一个不重复的就行，但要能够让人理解。此分支不提交到远程仓库上，由每个人自己处理。每个人可以创建多个特性分支，但出于方便管理的目的，可以在彻底明白各个分支的关系前每个人只创建一个特性分支。
      #### 关系
      develop分支是从main上分出来的，各个feature/xxx分支是从develop分支上分出来的。main分支用于管理大版本，一般不动。develop分支用于平时开发，你们整个项目只会在这个分支上合并代码和提交代码到远程仓库。feature/xxx分支则是我们写代码的主要分支。
      **直观地来讲，就是每个人都在feature分支上写代码，写完后转到develop分支上合并feature代码到develop分支上，然后提交develop分支的代码到远程仓库上。**

4. **git命令的操作流程**
   - 在克隆完仓库后，首先切换到develop分支
   ```bash
   git checkout develop
   ```
   - 此时创建自己的第一个feature/xxx分支
   ```bash
   git branch -b feature/<你自己起的分支名>
   # 这个命令让你创建分支并同时移动到该分支上
   ```
   - 完成上述两步后，你已经创建了自己的特性分支并移动到特性分支上了，此时提交代码到自己的分支上的流程是
   ```bash
   git add .
   # 将所有未被忽略的已修改文件放入缓存区
   git commit
   # 提交代码到自己的分支上
   ```
   - 最后一步，提交自己的代码到远程仓库上共享
   ```bash
   git checkout develop
   # 移动到develop分支上，准备合并代码
   git pull
   # 在合并前先拉取别人在develop上提交的最新代码
   git merge feature/<你的特性分支名>
   # 合并develop分支的代码和自己的代码
   git push
   # 推送刚刚合并了自己代码的新代码到远程仓库。注意，如果你忘记git pull别人已经推送到远程仓库的最新代码，你这一步会失败，git pull一下就行
   git checkout feature/xxx
   #提交完成后回到自己的特性分支上继续工作
   ```

   #### 注意事项及重要原则
   每次开始写代码前，先移动到develop分支上通过git pull获取最新代码，然后再移动到feature/xxx分支上用
   git merge develop --no-ff合并最新的代码到自己的特性分支上。注意在合并前要检查自己在feature/xxx分支上写的代码有没有通过git add,git commit命令保存好，否则在合并后会丢失。不确定有没有保存好的话用git status查看。
   在自己的feature/xxx上开发时，不要等到写了一堆代码后才提交到develop分支上，这点至关重要！！！不然你会在合并自己feature/xxx上的代码与develop上的最新代码时发生大量代码冲突，且往往不可调整，这也意味着你写的大量代码都是建立在过去的develop分支上的，可能已不适用。此时的做法一般都是在处理冲突时舍弃自己的代码，所以如果你不想自己想的代码被浪费，建议写了30行到50行就提交一次到develop分支上，并写好注释注明自己在哪是中断了工作，同时一次提交尽量不超过2到3个文件，改动了代码的地方也尽量不要超过3处，以尽量减少代码冲突。

