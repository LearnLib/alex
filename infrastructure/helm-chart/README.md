# Helm Chart for ALEX

## Local Environment

1. Follow the quickstart guide of [Helm](https://helm.sh/docs/intro/quickstart/)
2. Follow the get-started guide of [Minikube](https://minikube.sigs.k8s.io/docs/start/)
3. Open a terminal session and change the working directory to the location of this file
4. Run `minikube start`
5. Run `minikube ip`
6. Add the following line to your `/etc/hosts` file and replace the `{{ip-address}}` placeholder with the result of step 5
```
{{ip-adress}} alex 
```
7. In `/infrastructure/helm-chart` create a `secrets.yaml` file
```yaml
database:
   name: some-name
   user: some-user
   password: some-password
```
8. Run `helm install alex -f /<path>/secrets.yaml .`
   - Open the frontend via the browser at `http://alex`
