circleci config validate || {  exit 1; }

rm -rf $(pwd)/assets/wa

git status -s | cut -c4- | xargs -I{} grep -l "\-\-\-" {} | xargs sed  -i ''  "s/update: [0-9ZT:\.-]*/update: $(date '+%FT%T.%SZ')/"
git status -s | cut -c4- | xargs -I{} grep -l "\-\-\-" {} | xargs -I {} git add {}

git add .
git commit --amend --no-edit
git push -f
