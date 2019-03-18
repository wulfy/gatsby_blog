---
path: "/docker-mac"
date: "2017-07-12T17:12:33.962Z"
title: "Docker sur mac 🐳♥︎🍏"
blogImage: "https://koenig-media.raywenderlich.com/uploads/2018/10/DockerMacOS-feature.png"
---

#Docker quelques tips pour bien démarrer
Quelques notes et tips pour bien démarrer avec docker (et mac).

##Commandes utiles

### Lister les container
- lancés : `docker ps`
- tous : `docker ps -a`

###démarrer/stopper
- `docker start my_container` , `docker stop my_container`
- `docker-compose start my_container` , `docker-compose stop my_container`

###créer et lancer le container
- en mode attaché (retourne dans la cli les output system) `docker up mon_container` , `docker-compose up mon_container`
- en mode detached (rend la main après le lancement): `docker up -d mon_container` , `docker-compose up -d mon_container`

###Lister les volumes 
- `docker volume ls`

### executer une commande dans un container
- `docker exec -ti my_container bash` , `docker-compose exec my_container bash`
Execute la commande "bash" dans le container "my_container".
`-ti` permet d'activer le mode interactif pour interagir avec la console (i) et de créer une pseudo console (t). 
Inutile pour un docker-compose.

## docker app
https://github.com/docker/app

Permet d'encapsuler la configuration d'un docker-compose dans une "application".
Une fois l'application crée on dispose d'un "template" qui peut servire de base pour des déploiements dans des environnements différents avec la possibilité de changer les paramètres.

**exemple**
Imginons ce docker-compose
```
version: '3.2'
services:
  hello:
    image: hashicorp/http-echo
    command: ["-text", "hello world"]
    ports:
      - 5678:5678
 ```
Une fois l'application générée via `docker-app init --single-file project_template`.
Il suffit de déclarer des paramètres comme variables dans le fichier paramètre généré, pour qu'il soit possible ensuite de générer le template en remplaçant ces paramètres.
`docker-app render --set version=0.2.3 --set port=4567 --set text="hello production"`
voir lancer directement le container 
`docker-app render --set version=0.2.3 --set port=4567 --set text="hello production" | docker-compose -f - up`

On peut aussi intégrer ces paramètres dans l'application via un fichier .yaml
`docker-app render -f prod.yml`


## Performances Docker <-> Mac
Le principal problème avec docker sur MAC ce sont les performances lorsque l'on utilise des volumes "monté" (c'est à dire que l'on partage entre le conteneur et le host un ou plusieurs répertoires).
Pour faire simple, Docker synchronise les 2 environnements via des évènements `inotify` et `fsevent` pour les lectures et écritues afin de garantir la cohérence des données.
Cette garantie des données n'a pas de latence sur Linux car le virtual file système est partagé directement.
Ce n'est pas le cas pour les OS non linux.
Sur mac, la latence est assez élevée et peut rendre difficile l'exécution d'un projet docker dans de bonnes conditions.

###Solutions
(cf https://docs.docker.com/docker-for-mac/osxfs-caching/)
La plupart du temps la cohérence des données n'a pas besoin d'être "parfaite" (à un instant T on peut se permettre d'avoir une différence).
C'est souvent le cas lors de lectures très nombreuses et de faibles écritures (comme lorsque l'on teste un projet symfony sous docker avec quelques écritures en BDD).

####Autoriser un délai entre l'application des changements entre HOTS et CONTAINER 
Il est possible d'optimiser les performances des volumes utilisés par Docker en ne garantissant pas la cohérence des données.
Il est possible de choisir entre 2 options :
- `cached` permet un délai entre la mise à jour du container à partir du host (ex je mets à jour un fichier sur le host et il se met plus tard à jour sur le container)
- `delegated` autorise un délai entre la mise à jour du container et la réplication sur le host.

Pour ma part je privilégie la plupart du temps le mode `delegated` qui offre les meilleurs performances.
Bien souvent les projets s'exécutent dans le container et mettent à jour les données dans le container.

**exemples**

CLI
```
docker run -v /Users/yallop/project:/project:cached alpine command
```

docker-compose
```
version: "3.6"

services:
    app:
        volumes:
            - "~/.composer:/home/app/.composer:delegated"
            - "~/.composer:/root/.composer:delegated"
            - .:/srv:delegated
````

####Docker sync
http://docker-sync.io/
Permet de choisir automatiquement le bon mode de synchro entre host et container.
Il propose aussi un mode à base de RSYNC mais je n'ai pas vu une grosse différence avec le délégated.
Peut éventuellement etre une solution si on a besoin d'une garantie de cohérence des données > à `delegated`

