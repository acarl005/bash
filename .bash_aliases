# some more aliases

alias cp='cp -iv'
alias mv='mv -iv'
alias mkdir='mkdir -pv'
alias ccat='/bin/cat'
alias less='less -FSRXc'
alias rn='ranger --choosedir=$HOME/.rangerdir; LASTDIR=`cat $HOME/.rangerdir`; cd "$LASTDIR"'
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias al='e ~/.bash_aliases'
alias rc='e ~/.bashrc'
alias be="bundle exec"
alias fr="foreman run"
alias serv="python -m SimpleHTTPServer"
alias conk="conky -d -c ~/.conky/conkyrc_seamod"
alias chrome="google-chrome"
alias e=$EDITOR

alias desk="pushd $HOME/Desktop"
export desk="$HOME/Desktop"
alias proj="pushd $HOME/Documents/projects"
export proj="$HOME/Documents/projects"
alias prod="pushd $HOME/Documents/production"
export prod="$HOME/Documents/production"
alias stem="pushd $HOME/Documents/stem"
export stem="$HOME/Documents/stem"
alias down="pushd $HOME/Downloads"
export down="$HOME/Downloads"
alias docs="pushd $HOME/Documents"
export docs="$HOME/Documents"
alias pg="/usr/local/var/postgres"
export pg="/usr/local/var/postgres"

alias gs="git s"
alias dm="docker-machine"
alias fm=foreman

alias nis="npm install --save"
alias nisd="npm install --save-dev"
alias ns="npm start"
alias nsd="npm run start-dev"
alias nr="npm run"

alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'

alias day="redshift -O 6500"
alias night="redshift -O 3700"
alias twilight="redshift -O 5000"

