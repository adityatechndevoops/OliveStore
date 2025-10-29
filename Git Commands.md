# Git Commands

To change branches in Git and commit your changes to a different branch, follow these steps: 

1. Stash your current changes (if any): 
If you have uncommitted changes on your current branch that you don't want to commit to that branch, you can temporarily save them using git stash. This will clean your working directory, allowing you to switch branches without losing your modifications. 
```
git stash
```

2. Switch to the desired branch: 
You can switch to an existing branch using git switch (recommended in newer Git versions) or git checkout. To switch to an existing branch. 
```
    git switch <branch-name>
    # or
    git checkout <branch-name>
```

• To create a new branch and switch to it simultaneously: 
```
    git switch -c <new-branch-name>
    # or
    git checkout -b <new-branch-name>
```

3. Apply your stashed changes (if you stashed them): 
If you stashed your changes in step 1, you can now apply them to the new branch. 
git stash pop

This command will apply the most recently stashed changes and remove them from the stash list. If there are merge conflicts, you will need to resolve them manually. 
4. Stage and commit your changes: 
Once you are on the correct branch and your changes are in your working directory, stage them and then commit them. 
```
   git add .
   git commit -m "Your commit message here"
```
Alternative: Moving an existing commit to a different branch: 
If you have already committed changes to the wrong branch, you can move that commit to a different branch using git cherry-pick. 

• Identify the commit hash: Use git log on the branch where the commit exists to find its commit hash. 
• Switch to the target branch: 
```
    git switch <target-branch-name>
```

Cherry-pick the commit. 
```
    git cherry-pick <commit-hash>
```

• Remove the commit from the original branch (optional but often necessary): If you want to entirely move the commit and not just copy it, you'll need to reset the original branch. Be cautious with git reset --hard as it discards changes. 

```
    git switch <original-branch-name>
    git reset --hard HEAD~1 # This removes the last commit from the branch
```
