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
Le principe est assez simple, docker-sync va créer des containers de "synchronisation" qui seront utilisés dans le container de l'application.
Ces containers de synchro correspondent à des répertoires de l'application, l'idée est de faire en sorte que l'application tourne exclusivement sur ces containers et donc ne passe pas par le système de fichier de MACOSX.
Pour se faire docker-sync va créer synchroniser, à la première execution, les containers en question.
Puis des outils de synchro vont scruter les changements sur le système de fichier local et s'occuper de faire la copie des fichiers modifiés .
Etant donné que les modifications sont peu nombreuses, cette synchronisation est relativement rapide.
Par contre, le fait que les très nombreuses lectures sont faites sur les containers directement, va grandement améliorer les performances (quasi équivalentes à celles d'une application locale sans docker).

####Configuration
Il faut déjà télécharger et installer docker-sync  https://docker-sync.readthedocs.io/en/latest/getting-started/installation.html .
Une fois fait, un fichier docker-sync.yml, à la racine de l'application, se chargera de définir les répertoirs à synchroniser et les stratégies à appliquer.
Enfin, il faut modifier le fichier docker-compose de l'application pour que les répertoirs utilisés soient configurés sur les volumes créés par docker-sync et non ceux du système de fichier de MACOSX.

Exemple : 
<pre>
    <code class='Yaml'>
        app:
        image: php:7.3-dev
        depends_on:
            - database
            - mailhog
        environment:
            - NODE_ENV=development
            - LOGGY_STACKS=1
        environment:
            - COMPOSER_CACHE_DIR=/home/app/.cache/composer
            - COMPOSER_HOME=/home/app/.config/composer
            - YARN_CACHE_FOLDER=/home/node/.cache/yarn
        volumes:
            - ~/.cache/composer:/home/app/.cache/composer
            - ~/.config/composer:/home/app/.config/composer
            - ~/.cache/yarn:/home/node/.cache/yarn
            - ~/.aws/credentials:/home/app/.aws/credentials
            - mediatools-sync:/srv/:nocopy
            - mediatools-vendor:/srv/vendor/:nocopy
            - mediatools-node_modules:/srv/node_modules/:nocopy

        volumes:
            mediatools-sync:
                external: true
            mediatools-vendor:
                 external: true
            mediatools-node_modules:
                 external: true
    </code>
</pre>

Dans cet exemple les volumes ``` mediatools-sync ``` , ``` mediatools-vendor ``` , ``` mediatools-node_modules ``` ont été créés pour les différents répertoires de l'application.
Cette configuration peut etre utilisée dans un docker-compose-override (ou docker-sync.compose.override.yml dans notre exemple) afin de ne pas polluer le docker-compose des collègues.

Ces volumes sont configurés dans le fichier docker-sync ci-après :

<pre>
    <code class='Yaml'>
        version: "2"
        options:
          verbose: true
           # default: docker-compose.yml if you like, you can set a custom location (path) of your compose file like ~/app/compose.yml
          # HINT: you can also use this as an array to define several compose files to include. Order is important!
          compose-file-path: 'docker-sync.compose.override.yml'
          #compose-dev-file-path: 'docker-compose.override-sync.yml'

        syncs:
          #IMPORTANT: ensure this name is unique and does not match your other application container name
          mediatools-sync: #tip: add -sync and you keep consistent names as a convention
            src: './'
            sync_host_port: 10873
            sync_strategy: 'rsync'
            sync_args: '--delete'
            #sync_args: '-prefer newer -copyonconflict'
            host_disk_mount_mode: 'cached'
            sync_excludes: ["var/cache", "public/", "var/log", ".idea", ".git", ".docker-sync", "ui/assets","node_modules","vendor"]
            notify_terminal: true

          mediatools-vendor:
            src: './vendor'
            sync_strategy: 'native_osx'
            host_disk_mount_mode: 'cached'
            notify_terminal: true
            monit_high_cpu_cycles: 2

          mediatools-node_modules:
            src: './node_modules'
            sync_strategy: 'native_osx'
            host_disk_mount_mode: 'cached'
            notify_terminal: true
            monit_high_cpu_cycles: 2
    </code>
</pre>

La première option définit le fichier docker-compose à utiliser (docker-sync.compose.override.yml).

On peut remarquer que les volumes n'ont pas la même stratégie.
``` mediatools-sync ``` utilise du rsync
``` mediatools-vendor ``` et ``` mediatools-node_modules ``` du unison.

La raison est simple:
- Rsync est la méthode la plus rapide mais ne fonctionne que dans un sens MACOSX -> Container.
Impossible donc de lancer un yarn ou un composer dans le conteneur pour mettre à jour les données sur le local.
=> Idéal pour les fichiers sources de l'application (sans les vendors) qui sont modifiés uniquement sur le poste local via l'IDE et bougent souvent.
- Unison permet une synchro dans les 2 sens MAOSX <-> Container.
Ainsi, une modif sur le MAC est reportée sur le Container et inversement.
=> idéal pour les vendor et les node_module qui sont principalement créés/modifiés par le container et les scripts d'install

Il aurait pu être possible de ne pas synchroniser node_modules et vendor pour les laisser dans le volume mais par choix (plus facile de vérifier les libs) ils remontent aussi en local.

Petite subtilité: ``` mediatools-sync ``` cible tout le répertoire de l'application et va exclure ceux qui ne nécessitent pas de synchronisation.
ATTENTION : si RSYNC et UNISON synchronise le même répertoire, on peut se retrouver dans un cas instable où RSYNC tente de supprimer ce qui n'existe pas sur le local et Unison qui tente d'ajouter au local les fichiers présents sur le container.

####Utilisation
Une fois la configuration effectuée, la commande ``` docker-sync-stack start ``` permet de créer les containers de synchronisation, lancer les synchros et enfin créer et lancer les containers de l'application.
Cette commande continue de tourner et affiche les sorties consoles des containers. C'est utile surtout pour voir passer les commandes de synchronisation et la confirmation lorsque la synchro est terminée.
Si on suspend la commande via ``` CTRL + C ``` , docker-sync est arrêté et les containers stoppés.

####Redémarrer après mise en veille
Certains blogs remontent que la mise en veille du mac et Docker ne font pas bon ménage.
S'il vous arrive de mettre en veille votre Mac avec docker de lancé et que vous constatez par moment de mauvaises performances => pensez à redémarrer docker (quit et restart). 
