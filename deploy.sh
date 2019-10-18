npm run build
tar -cvf client.tar.gz dist
scp -i ~/.ssh/id_rsa client.tar.gz ubuntu@notification.dunice.net:/home/ubuntu
ssh -i ~/.ssh/id_rsa ubuntu@notification.dunice.net 'rm -rf elmarproject && tar -xvf client.tar.gz && mv dist elmarproject'
