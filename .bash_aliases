# some more aliases
alias cp='cp -iv'
alias mv='mv -iv'
alias mkdir='mkdir -pv'
alias ll='ls -FGlAhp'
alias less='less -FSRXc'
alias ps='ps -ef'
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias al='e ~/.bash_aliases'
alias rc='e ~/.bashrc'
alias be="bundle exec"
alias serv="python -m SimpleHTTPServer"
alias conk="conky -d -c ~/.conky/conkyrc_seamod"
alias chrome="google-chrome"
alias fresh="source ~/.bashrc"
alias irb="pry"
alias e=atom

alias desk="pushd $HOME/Desktop"
export desk="$HOME/Desktop"
alias proj="pushd $HOME/Documents/projects"
export proj="$HOME/Documents/projects"
alias prod="pushd $HOME/Documents/production"
export prod="$HOME/Documents/production"
alias cosm="pushd $HOME/Documents/codesmith"
export cosm="$HOME/Documents/codesmith"
alias down="pushd $HOME/Downloads"
export down="$HOME/Downloads"
alias docs="pushd $HOME/Documents"
export docs="$HOME/Documents"
alias site="pushd $HOME/Documents/production/codesmith-public-site"
export site="$HOME/Documents/production/codesmith-public-site"

alias ni="npm install"
alias nis="npm install --save"
alias nisd="npm install --save-dev"
alias ns="npm start"
alias nsd="npm run start-dev"
alias nt="npm test"
alias nr="npm run"

alias mon="~/Documents/projects/mongoose-model-cli/bin/mongoose-model-cli"
alias casper="node_modules/.bin/casperjs --ssl-protocol=any --ignore-ssl-errors=yes test"
alias dynamo='java -Djava.library.path=~/dev/dbs/dynamo/DynamoDBLocal_lib \
-jar ~/dev/dbs/dynamo/DynamoDBLocal.jar -sharedDb -dbPath ~/dev/dbs/dynamo'

alias g="git"

#requires redshift
alias day="redshift -O 6500"
alias night="redshift -O 3700"
alias twilight="redshift -O 5000"

#requires xclip
alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'


#common typos
alias gits="git s"
alias pod="popd"
