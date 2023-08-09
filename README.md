# Helm Assistant

[![NodeJS build App](https://github.com/SomeBlackMagic/helm-assistant/actions/workflows/npm-build-app.yml/badge.svg)](https://github.com/SomeBlackMagic/helm-assistant/actions/workflows/npm-build-app.yml)

This project is a helm wrapper to fix some bugs:
* https://github.com/helm/helm/issues/3481
* https://github.com/helm/helm/issues/9285

Also implement upgrade locker. When using multiple deploy with the same non-concurrent resource additional locks needed.

When you run helm-assistant upgrade <some arguments> application run new sub process ```helm upgrade <some arguments>```, pipe logs 
and also run kubectl process for grab additional data about deployment.
Also, if you run deployment with flag --wait-for-jobs application check deployed job, and if status is `Failed` 
application send helm signal to revert realise

## How to install
```
wget https://github.com/SomeBlackMagic/helm-assistant/releases/latest/download/helm-assistant-linux-amd64
chmod +x helm-assistant-linux-amd64
mv helm-assistant-linux-amd64 /usr/local/bin/helm-assistant
```

## How to use

### Set access credentials for helm and kubectl if needed
```
export HELM_CMD_ARGS="--kubeconfig /root/.kube/some-cluster.yaml"
export KUBECTL_CMD_ARGS="--kubeconfig /root/.kube/some-cluster.yaml"
```
### Enabled feature
```
export HELM_ASSISTANT_UPGRADE_PIPE_LOGS=true
export HELM_ASSISTANT_UPGRADE_JOB_STRICT=true
export HELM_ASSISTANT_RELEASE_LOCK_ENABLED=true
```
### Run upgrade any chart
```
helm-assistant upgrade \
    --install helm-assistant-demo-deployment \
    --namespace ${KUBE_NAMESPACE} \
    --atomic \
    --debug \
    --wait \
    ./test/charts/worker
```
Warning: install argument must be first in arguments list because application grabs release name from cil args
(first argument after upgrade and without "--")
### Example output
[Text format](docs/example_log.txt)

[Image](docs/example_log.png)


Todolist:
* implement logs filter(https://github.com/helm/helm/issues/7275)
