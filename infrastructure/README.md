# ALEX on Kubernetes

## Local setup

This section describes the steps that are required to deploy and run ALEX on a local kubernetes cluster.

### Prerequisites

1. Install [docker](Docker), [minikube](Minikube), [kubectl](Kubectl), [helm](Helm) and [skaffold](Skaffold).
2. Start minikube: `minikube start`.
3. Install necessary add-ons: `minikube addons enable ingress storage-provisioner`
4. Add a host alias to the `/etc/hosts` file:
   Execute `minikube ip` to get the IP address of the local cluster and add an entry `<ip> alex` to the `/etc/hosts` file.

### Deploy ALEX to Minikube

1. Ensure you use the local minikube kubernetes context: `kubectl config use-context minikube`
2. In the root of the repository, run `skaffold dev` to execute the deployment.
3. Open `http://alex` in a Web browser.


## Remote setup

This section describes the steps that are required to deploy and run ALEX on a remote kubernetes cluster.

### Prerequisites

1. Install [microk8s](microk8s) on a server.
2. Enable the following add-ons: `microk8s enable dns ingress registry storage`.
3. Copy the cluster details from `microk8s kubectl config view` to the local `/.kube/config` file.

### Deploy ALEX to a remote cluster

1. Create a file `./helm-chart/values-temp.yaml`, and set the necessary properties (see `values-local.yaml`).
2. Switch to the kubernetes context of the cluster that you have entered earlier: `kubectl config use-context <context>`.
3. In the root of the repository, execute `skaffold run -p temp` to deploy the app.


[docker]: https://www.docker.com/get-started
[microk8s]: https://microk8s.io/
[minikube]: https://minikube.sigs.k8s.io/
[helm]: https://helm.sh/
[skaffold]: https://skaffold.dev/
[kubectl]: https://kubernetes.io/docs/tasks/tools/