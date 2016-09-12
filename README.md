# Dockerfiles pour containers spécifiques

# Construire les images Docker

```sh
$ git clone https://github.com/agefos-pme/dockerfiles
$ cd dockerfiles/nginx-rancher-rp
$ docker build . -t agefos-pme/nginx-rancher-rp --build-arg HTTP_PROXY=$HTTP_PROXY --build-arg http_proxy=$HTTP_PROXY
```

Pour tester les images créées:

```sh
$ docker run --rm -it agefos-pme/nginx-rancher-rp
```

Une fois l'image validée, on peut la pousser dans la registry.
```sh
$ docker push agefos-pme/nginx-rancher-rp
```

