# coding=utf-8
import sys, platform
implementation = platform.python_implementation()

sys.ps1 = '\033[32m%s\033[0m >>> ' % implementation
sys.ps2 = '...  '
