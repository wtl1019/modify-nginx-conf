const cont = `#!/bin/bash

##############################################
# arg1: nginx 配置文件绝对路径
# arg2: nginx 项目名称
# ssh server.dev 'bash -s' < push-nginx-conf.sh '/etc/nginx/conf.d/default.conf' 'project_name'
##############################################

##############################################
# Check if run as root
##############################################
if [ xroot != x$(whoami) ]
then
    echo "You must run as root (Hint: Try prefix 'sudo' while execution the script)"
    exit
fi

# /etc/nginx/conf.d/default.config
nginxconFile=$1
projectLocation=$2
aliasFilePath=$3
servercnt="\\ \\n  location /$projectLocation {\\n     alias $aliasFilePath/$projectLocation/;\\n     try_files "'$uri $uri/'"  /$projectLocation/index.html;\\n     index index.html;\\n     gzip on;\\n  }\\n"
#echo $nginxconFile
exist=$(cat $nginxconFile | grep "location /$projectLocation {")

if [ -n "$exist" ];then
    echo "have exist, do nothing"
    exit
fi

linenum=$(grep -n 'location' $nginxconFile | tail -1  | cut  -d  ':'  -f  1)

cp -f $nginxconFile $nginxconFile.bak
sed -i "$linenum i$servercnt" $nginxconFile
nginx -s reload
echo "insert $nginxconFile at line number:$linenum"
`
module.exports = cont 