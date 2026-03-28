# Git 文件状态管理

## 一、文件“脏”状态对 `checkout` 与 `pull` 的影响
核心原则：**操作可能导致 Git 无法无损合并/覆盖本地修改时，会拒绝执行。**

*   **`git checkout/switch` (切换分支)**
    *   **触发条件**：工作区/暂存区有**未提交的修改**，且**该文件在目标分支中内容不同**。
    *   **结果**：Git拒绝切换，提示先`git commit`或`git stash`。

*   **`git pull` (拉取并合并)**
    *   **本质**：`git pull = git fetch + git merge`。冲突源于远程与本地分支的**提交历史**在相同位置有不同修改。
    *   **本地有未提交修改时**：若远程要修改的文件与本地未提交修改的文件相同，Git会拒绝合并。

*   **黄金法则**
    1.  **操作前保持工作区干净**（用`git status`查看）。
    2.  **善用`git stash`**：临时保存未完成修改，以便进行切换或拉取操作。
    3.  **理解`git pull`**是“下载并尝试合并”，合并冲突是正常协作的一部分。

## 二、文件状态管理与撤销操作
遵循工作流：**工作区 → (`git add`) → 暂存区 → (`git commit`) → 仓库**

*   **撤销工作区修改**（丢弃未`git add`的更改）
    ```bash
    git checkout -- <文件>
		# 或 git restore <文件> (Git 2.23+)
    ```
*   **从暂存区移除文件**（撤销已`git add`的更改）
    ```bash
    git reset HEAD <文件>
		# 或 git restore --staged <文件> (Git 2.23+)
    ```
*   **彻底还原文件**到最近提交的状态
    ```bash
    git reset HEAD <文件> && git checkout -- <文件>  # 两步
    # 或 (Git 2.23+ 一行)
    git restore --staged --worktree <文件>
    ```
*   **其他实用技巧**
    *   **储藏**：`git stash` (暂存修改)、`git stash pop` (恢复)。
    *   **撤销整个提交**（**谨慎**）：
        *   `git reset --soft HEAD~1`：撤销提交，保留更改在**暂存区**。
        *   `git reset --mixed HEAD~1` (推荐)：撤销提交，保留更改在**工作区**。
        *   `git reset --hard HEAD~1` (**危险**)：彻底丢弃提交及所有更改。

## 三、`git diff` 参数
核心逻辑：比较**三个位置**（工作区、暂存区、仓库）间的差异。

*   **`git diff` (无参数)**
    *   **比较**：**工作区 vs 暂存区**
*   **`git diff --staged` (或 `--cached`)**
    *   **比较**：**暂存区 vs 最新提交(HEAD)**
*   **`git diff HEAD`**
    *   **比较**：**工作区 vs 最新提交(HEAD)**
*   **`git diff commit1 commit2`**
    *   `git diff <filename>`: 显示与暂存区文件的差异

**通用公式**：`git diff [源] [目标]` 显示从“源”到“目标”的变化。上述三条是最常用的快捷方式。

**实战流程**：
1.  修改文件 → `git diff` (查看未暂存的改动)。
2.  `git add` 后 → `git diff --staged` (查看即将提交的改动)。
3.  想查看所有改动 → `git diff HEAD`。