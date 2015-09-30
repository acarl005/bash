# some more aliases
alias cp='cp -iv'
alias mv='mv -iv'
alias mkdir='mkdir -pv'
alias ll='ls -FGlAhp'
alias less='less -FSRXc'
alias ps='ps -ef'
alias e='subl'
alias o='xdg-open'
alias up="cd .."
alias upp="cd ../.."
alias uppp="cd ../../.."
alias al='subl ~/.bash_aliases'
alias rc='subl ~/.bashrc'
alias desk='pushd ~/Desktop/'
alias proj='pushd ~/Desktop/projects/'
alias prod='pushd ~/Desktop/production/'
alias cosm='pushd ~/Desktop/codesmith/'
alias down='pushd ~/Downloads/'
alias docs='pushd ~/Documents/'
alias site='pushd ~/Desktop/production/codesmith-public-site'
alias be="bundle exec"
alias serv="python -m SimpleHTTPServer"
alias conk="conky -c ~/.conky/conkyrc_seamod"
alias chrome="google-chrome"
alias fresh="source ~/.bashrc"

alias ni="npm install"
alias ns="npm start"
alias nsd="npm run start-dev"
alias nt="npm test"
alias nr="npm run"

alias casper="node_modules/.bin/casperjs --ssl-protocol=any --ignore-ssl-errors=yes test"

alias g="git"

#requires redshift
alias day="redshift -O 6500"
alias night="redshift -O 3700"
alias twilight="redshift -O 5000"

#common typos
alias gits="git s"
alias pod=popd