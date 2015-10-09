# some more aliases
alias cp='cp -iv'
alias mv='mv -iv'
alias mkdir='mkdir -pv'
alias ll='ls -FGlAhp'
alias less='less -FSRXc'
alias ps='ps -ef'
alias e='subl'
alias o='xdg-open'
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias al='subl ~/.bash_aliases'
alias rc='subl ~/.bashrc'
alias desk='pushd ~/Desktop/'
alias proj='pushd ~/Documents/projects/'
alias prod='pushd ~/Documents/production/'
alias cosm='pushd ~/Documents/codesmith/'
alias down='pushd ~/Downloads/'
alias docs='pushd ~/Documents/'
alias site='pushd ~/Documents/production/codesmith-public-site'
alias be="bundle exec"
alias serv="python -m SimpleHTTPServer"
alias conk="conky -d -c ~/.conky/conkyrc_seamod"
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

mirror="xrandr --output HDMI1 --auto --same-as eDP1; xrandr --output HDMI1 --mode 1920x1080"

#common typos
alias gits="git s"
alias pod=popd