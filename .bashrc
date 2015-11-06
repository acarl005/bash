# fix bug with atheros network card
# http://askubuntu.com/questions/678145/my-wifi-qualcomm-atheros-device-168c0041-rev-20-doesnt-show-up-and-work-in
# fix gulp watch error 
# echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

# include custom scripts
PATH=$PATH:~/opt/bin
echo -e "\e[1;93m           /\            "
echo -e "          /  \           "
echo -e "         /    \          "
echo -e "        /      \         "
echo -e "       /        \        "
echo -e "      /__________\       "
echo -e "     /\__________/\      "
echo -e "    /  \        /  \     "
echo -e "   /    \      /    \    "
echo -e "  /      \    /      \   "
echo -e " /        \  /        \  "
echo -e "/__________\/__________\ "
echo -e "\__________/\__________/ "
echo -e "\e[0m"
echo "Welcome, $USER! It's $(date)."
echo "You're logged in at $(hostname)."
echo; echo

# Load git completions
git_completion_script=/usr/local/etc/bash_completion.d/git-completion.bash
test -s $git_completion_script && source $git_completion_script

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi


# A more colorful prompt
# \[\e[0m\] resets the color to default color
c_reset='\[\e[0m\]'
co_white='\e[0m'
# \e[0;35m\ sets the color to purple
c_purple='\[\e[1;35m\]'
# \e[0;36m\ sets the color to cyan
c_cyan='\[\e[1;36m\]'
# \e[0;36m\ sets the color to yellow
c_yellow='\[\e[0;93m\]'
# \e[0;32m\ sets the color to green
c_green='\[\e[1;32m\]'
# \e[0;31m\ sets the color to red
c_red='\[\e[1;31m\]'
co_red='\e[0;31m'

gems="${c_red}💎${c_green}💎${c_cyan}💎${c_purple}💎 ${c_reset}"

# PS1 is the variable for the prompt you see everytime you hit enter
PROMPT_COMMAND='PS1="$(format_pwd)$(git_prompt) ${gems} "; \
                echo -ne "\033]2;${PWD/#${HOME}/\~}\007" '
export PS2='... '

format_pwd() {
  wd=$(pwd)
  short_wd=${wd/\/home\/andy/\~}
  first_char=$(echo $short_wd | cut -c 1-1)
  if [[ $first_char != '~' ]]; then
    short_wd="${c_reset}\e[0;0;40m💀 ${c_reset}${c_purple}${short_wd}"
  fi
  echo -e "${c_purple}${short_wd}"
}


# determines if the git branch you are on is clean or dirty and colors accordingly
git_prompt() {
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    return 0
  fi
  # Grab working branch name
  branch=$(__git_ps1)
  # Clean or dirty branch
  if [[ $(git diff) ]]; then
    git_icon="${c_red}✗"
  elif [[ $(git status --short) ]]; then
    git_icon="${c_yellow}✎"
  else
    git_icon="${c_green}✓"
  fi
  echo "${c_cyan}${branch:0:-1}${git_icon}${c_cyan})${c_reset}"
}

# Colors ls should use for folders, files, symlinks etc, see `man ls` and
# search for LSCOLORS
export LSCOLORS=ExGxFxdxCxDxDxaccxaeex

# Force grep to always use the color option and show line numbers
export GREP_OPTIONS='--color=always'

# Set sublime as the default editor
[[ $(which subl) ]] && export EDITOR="subl --wait"


# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
  test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
  alias ls='ls --color=auto'
  alias dir='dir --color=auto'
  alias vdir='vdir -A --color=auto'

  alias grep='grep --color=auto'
  alias fgrep='fgrep --color=auto'
  alias egrep='egrep --color=auto'
fi

# Alias definitions.
if [ -f ~/.bash_aliases ]; then
  . ~/.bash_aliases
fi

cd() { builtin cd "$@"; ll; }
pushd() { builtin pushd "$@"; ll; }
mkcd() { mkdir -p "$1" && cd "$1"; }
trash() { command mv "$@" ~/.local/share/Trash/files/ ; }
te() { touch "$1"; subl "$1"; }
# requires espeak
say() { echo "$1" | espeak; }

alias pbcopy='xclip -selection clipboard'
alias pbpaste='xclip -selection clipboard -o'
hl() {
  pbpaste | highlight -O xterm256 -S "$1" -l | pbcopy;
}

#full recursive directory listing
alias lr='ls -R | grep ":$" | sed -e '\''s/:$//'\'' -e '\''s/[^-][^\/]*\//--/g'\'' -e '\''s/^/   /'\'' -e '\''s/-/|/'\'' | less'

#extract most known archives
extract() {
  if [ -f $1 ] ; then
    case $1 in
      *.tar.xz)    tar xvfJ $1    ;;
      *.tar.bz2)   tar xjf $1     ;;
      *.tar.gz)    tar xzf $1     ;;
      *.bz2)       bunzip2 $1     ;;
      *.rar)       unrar e $1     ;;
      *.gz)        gunzip $1      ;;
      *.tar)       tar xf $1      ;;
      *.tbz2)      tar xjf $1     ;;
      *.tgz)       tar xzf $1     ;;
      *.zip)       unzip $1       ;;
      *.Z)         uncompress $1  ;;
      *.7z)        7z x $1        ;;
      *)     echo "'$1' cannot be extracted via extract()" ;;
    esac
  else
    echo "'$1' is not a valid file"
  fi
}


# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'


#   ----------------
#   NETWORKING
#   ----------------

alias myip='curl ip.appspot.com'                    # myip:         Public facing IP Address
alias netCons='lsof -i'                             # netCons:      Show all open TCP/IP sockets
alias flushDNS='dscacheutil -flushcache'            # flushDNS:     Flush out the DNS Cache
alias lsock='sudo /usr/sbin/lsof -i -P'             # lsock:        Display open sockets
alias lsockU='sudo /usr/sbin/lsof -nP | grep UDP'   # lsockU:       Display only open UDP sockets
alias lsockT='sudo /usr/sbin/lsof -nP | grep TCP'   # lsockT:       Display only open TCP sockets
alias ipInfo0='ipconfig getpacket en0'              # ipInfo0:      Get info on connections for en0
alias ipInfo1='ipconfig getpacket en1'              # ipInfo1:      Get info on connections for en1
alias openPorts='sudo lsof -i | grep LISTEN'        # openPorts:    All listening connections
alias showBlocked='sudo ipfw list'                  # showBlocked:  All ipfw rules inc/ blocked IPs
