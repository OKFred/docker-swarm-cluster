cd ./server
docker build -t registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-server .
docker push registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-server

cd ..
cd ./platform
docker build -t registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-platform .
docker push registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-platform

cd ..
cd ./user
docker build -t registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-user .
docker push registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-user

cd ..
cd ./case
docker build -t registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-case .
docker push registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-case

cd ..
docker stack deploy -c docker-compose.yaml my-custer