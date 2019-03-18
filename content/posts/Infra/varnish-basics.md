---
path: "/varnish-basics"
date: "2019-03-11T23:30:00.962Z"
title: "Varnish basics 🍼"
blogImage: "http://blog.visualtis.com/wp-content/uploads/2015/06/varnish-cache-opt.png"
---

#Les bases de varnish
Je ne vais pas reprendre la description de varnish, plusieurs blogs le font très bien.
Ce que j'en retiens c'est que varnish est un serveur de "cache" permettant de décharger un serveur en enregistrant les réponses de certaines requêtes et en les servant directement au client quand elles se représentent (cache).
La principale difficulté est de le configurer correctment pour garder le cache le temps nécessaire et pouvoir le forcer de se mettre à jour si une donnée est changée côté serveur.

Il a bien entendu d'autres fonctionnalités (comme nettoyer les requêtes avant d'interroger le serveur) mais je me concentre sur la principale : le cache.

##Fonctionnement simplifié
Le fonctionnement de varnish se fait en 3 étapes.
1) Réception de la requête du client (varnish créé une clef unique correspondant à la requete)
2) Recherche de la requête dans le cache (la clef unique), s'il la trouve il renvoie la réponse enregistrée (si elle est encore valide c'est à dire que son temps de cache n'a pas expiré)
3) Si pas trouvé, varnish va interroger le serveur, retourner la réponse au client et la sauvegarder dans son cache.

Ce fonctionement est bien entendu simplifié car varnish fait d'autres actions avant de vérifier le cache (si présence d'un cookie il ne sert pas le cache) et la sauvegarde (il vérifie si la configuration autorise de sauvegarde la réponse pour la requête).

![schéma simplifié](https://datadog-prod.imgix.net/img/blog/top-varnish-performance-metrics/1-05.png?fit=max)

Niveau "termes techniques", un HIT correspond à une requête qui a été trouvée en cache, un MISS, une requête non attrapée par varnish et délivée directement au serveur.

##Configuration

Varnish va appeler les fonctions suivantes dans l'ordre du schéma.
![process et fonctions](https://book.varnish-software.com/4.0/_images/simplified_fsm.svg)


### exemples

Si on détecte un cookie, un header de réponse est setté et la fonction retourne hit_for_pass qui veut dire qu'on demande à varnish de passer la requête alors qu'elle pouvait etre mise en cache (les prochaines requetes seront du coup directement passées au serveur).
```
if (header.get(beresp.http.set-cookie,"TestCookie=") ~ "TestCookie")
 {
     set beresp.http.cookie-test = 1;
     return(hit_for_pass);
 }
```


##Commandes utiles
`varnishadm` permet d'afficher l'interface d'administration, permettant (entre autres) de rafraichir la configuration varnish "à chaud"
`varnishlog -q 'ReqURL ~ "^/$"’` Liste toutes les requêtes reçues par varnish (varnish log les requetes du client = REQ et les réponse du serveur = RESP)
```
vcl.load newconfig03 /etc/varnish/default.vcl
vcl.use newconfig03
quit
500
Closing CLI connection
```
Permet de recharger à "chaud" la configuration de varnish (qu'il faut stoquer dans un nom de configuration , ici `newconfig03`);
`vcl.discard <configname>` permet de supprimer les fichiers de configurations (si non utilisés)


##Liens utiles
http://book.varnish-software.com/3.0/VCL_Basics.html
https://info.varnish-software.com/blog/10-varnish-cache-mistakes-and-how-avoid-them

