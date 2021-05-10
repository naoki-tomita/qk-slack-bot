cd `dirname $0`
BUILD_KIT=1 docker build ../ -f Dockerfile -t qk-slack-bot:latest
