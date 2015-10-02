# fix bug with atheros network card
# http://askubuntu.com/questions/678145/my-wifi-qualcomm-atheros-device-168c0041-rev-20-doesnt-show-up-and-work-in
# fix gulp watch error 
# echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

# include custom scripts
PATH=$PATH:~/opt/bin
date=$(date);
echo '                    MMMMMMMMMMMMMMMMMMM                     '
echo '                    MMMMMMMMMMMMMMMMMMM                     '
echo '             MMMMMMMMMM   ZZZZZZZ   MMMMMMMMMM              '
echo '             MMMMMMMMMM   ZZZZZZZ   MMMMMMMMMM              '
echo '          MMMMMM          ZZZZZZZ         ,MMMMMM           '
echo '          MMMMMM          ZZZZZZZ         ,MMMMMM           '
echo '       MMMMMMZZZ       ZZZZZZZZZZZZZ       ZZZMMMMMM        '
echo '       MMMMMMZZZ       ZZZZZZZZZZZZZ       ZZZMMMMMM        '
echo '       MMM   ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ   MMM        '
echo '       MMM   ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ   MMM        '
echo '   MMMMMMM      ZZZZZZZ             ZZZZZZ$      MMMMMMM    '
echo '   MMMMMMM      ZZZZZZZ             ZZZZZZ$      MMMMMMM    '
echo '   MMMM         ZZZZ                   ZZZ$         MMMM    '
echo '   MMMM         ZZZZ                   ZZZ$         MMMM    '
echo '   MMMM         ZZZZ                   ZZZ$         MMMM    '
echo '   MMMM         ZZZZ                   ZZZ$         MMMM    '
echo '   MMMM      ZZZZZZZ                   ZZZZZZZ      MMMM    '
echo '   MMMM      ZZZZZZZ                   ZZZZZZZ      MMMM    '
echo '   MMMMZZZZZZZZZZZZZZZZ             ZZZZZZZZZ$ZZZZZZMMMM    '
echo '   MMMMZZZZZZZZZZZZZZZZ             ZZZZZZZZZZZZZZZZMMMM    '
echo '   MMMMZZZZZZMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMZZZZZZMMMM    '
echo '   MMMMZZZZZZMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMZZZZZZMMMM    '
echo '   MMMMMMMMMMMMM       MMM       MMM      .MMMMMMMMMMMMM    '
echo '   MMMMMMMMMMMMM       MMM       MMM      ,MMMMMMMMMMMMM    '
echo '   ZZZZMMMMMMZZZ       MMM       MMM      .ZZZMMMMMMZZZO    '
echo '       MMMMMM          MMM       MMM          MMMMMM        '
echo '       DDDMMM          DDD       DDD          MMMDDD        '
echo '          MMM                                 MMM           '
echo '          MMM                                .MMM           '
echo '          MMMMMM                          ,MMMMMM           '
echo '          MMMMMM                          ,MMMMMM           '
echo '             MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM              '
echo '             MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM              '
echo "Welcome, $USER! It's $date."
echo "You're logged in at $(hostname)."

# Load git completions
git_completion_script=/usr/local/etc/bash_completion.d/git-completion.bash
test -s $git_completion_script && source $git_completion_script


# A more colorful prompt
# \[\e[0m\] resets the color to default color
c_reset='\[\e[0m\]'
#  \e[0;31m\ sets the color to red
c_path='\[\e[0;31m\]'
# \e[0;32m\ sets the color to green
c_git_clean='\[\e[0;32m\]'
# \e[0;31m\ sets the color to red
c_git_dirty='\[\e[0;31m\]'

# PS1 is the variable for the prompt you see everytime you hit enter
PROMPT_COMMAND='PS1="${c_path}$(pwd)${c_reset}$(git_prompt) $> "'

export PS1='\n\[\033[0;31m\]\W\[\033[0m\]$(git_prompt)\[\033[0m\]:> '
export PS2='... '

# determines if the git branch you are on is clean or dirty
git_prompt ()
{
  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    return 0
  fi
  # Grab working branch name
  git_branch=$(__git_ps1)
  # Clean or dirty branch
  if git diff --quiet 2>/dev/null >&2; then
    git_color="${c_git_clean}"
  else
    git_color=${c_git_dirty}
  fi
  echo "$git_color$git_branch${c_reset}"
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
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

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
# requires xclip
copy() { cat "$1" | xclip; }
paste() { xclip -o > "$1"; }

# requires underscore-cli
github() {
  if [ ! -d .git ] ; then git init; fi
  res=$(curl https://api.github.com/user/repos -u acarl005 -X POST -d "{\"name\":\"$1\"}");
  clone_url=$( echo $res | underscore extract clone_url | sed -e 's/^"//'  -e 's/"$//'); #remove quotes
  git remote add origin "$clone_url";
  echo "created github repository ($1) at:";
  echo $res | underscore extract svn_url;
}

#full recursive directory listing
alias lr='ls -R | grep ":$" | sed -e '\''s/:$//'\'' -e '\''s/[^-][^\/]*\//--/g'\'' -e '\''s/^/   /'\'' -e '\''s/-/|/'\'' | less'

#extract most known archives
extract () {
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

#   ii:  display useful host related informaton
#   -------------------------------------------------------------------
    ii() {
        echo -e "\nYou are logged on ${RED}$HOST"
        echo -e "\nAdditionnal information:$NC " ; uname -a
        echo -e "\n${RED}Users logged on:$NC " ; w -h
        echo -e "\n${RED}Current date :$NC " ; date
        echo -e "\n${RED}Machine stats :$NC " ; uptime
        echo -e "\n${RED}Current network location :$NC " ; scselect
        echo -e "\n${RED}Public facing IP Address :$NC " ;myip
        # echo -e "\n${RED}DNS Configuration:$NC " ; scutil --dns
        echo
    }