---
path: "/Alexa-homekit-skill"
date: "2017-07-12T17:12:33.962Z"
title: "Ma première skill ALexa"
blogImage: "/amazon_alexa.jpeg"
---

# Alexa homekit

## Qu'est ce que Alexa ?
Alexa est l'assistant vocal d'Amazon. Il est capable de "comprendre" certaines demande vocale et y répondre (soit en fournissant une information soit en effectuant une action). On peut donc lui demander quel temps il fait, quel est le temps de parcours pour se rendre à son travail, d'ouvrir les volets ou même d'allumer le micro onde à une certaines heure.

La plupart des assistants fonctionnent sur le même principe, cependant Alexa a une particularité : Les skills.

## Que sont les "SKILLs" ?
Les skills peuvent être considérées comme des "applications" qui étendent les possibilités d'Alexa. Tout comme sur mobile, elle permettent de jouer à des jeux ou piloter des appareils qui, nativement, ne sont pas supportés par Alexa.

Cet article s'intéresse justement à un type de SKILL : les skills "homekit" qui permettent de piloter des appareils connectés (zwave, RFY, etc.). Ces skills existent chez certains concurrents (comme Google) et les fonctionnalités sont similaires.
Alexa m'apparait néanmoins plus "pratique" par la possibilité de tester sa skill sans la publier, directement sur son ensceinte Alexa.

## Créons une skill

### Principe de base
Quelle que soit la skill, le principe de base est :
* Alexa reçoit la commande vocale de l'utilisateur et l'analyse pour détecter si l'utilisateur invoque une skill et les paramètres (cf ![la doc officielle](https://developer.amazon.com/fr/docs/custom-skills/understanding-how-users-invoke-custom-skills.html))
* Alexa appelle ensuite la skill en lui passant les paramètres détectés (action, mots de connexion, etc.)
* La skill retourne une phrase qu'Alexa lira et/ou exécute une action spécifique (par exemple commander une pizza).

### Implémentation technique
* La commande vocale est traitée directement par le service ALEXA d'Amazon, il est donc nécessaire de créer une "SKILL" qui effectuera des actions en fonction des paramètres de la commande reçue (https://developer.amazon.com/alexa/console)
Cette SKILL se décompose en 2 parties
- la partie console d'Alexa qui sert à configurer, tester et publier la skill
- La partie "code" hébergée sur un serveur tier (AWS la plupart du temps pour simplifier le fonctionnement) qui sera chargé d'effectuer une action pour la commande identifiée en implémentant le format d'échange d'Alexa.
* Dans certains cas il est possible d'associer en OAUTH un compte externe sur la skill qui permet de lui donner accès à certaines informations (compte Amazon pour une skill d'achat, serveur de domotique pour une smart home skill, etc.).
Ce service est géré par un serveur supportant OAUTH2. Alexa se chargera automatiquement d'appeler le formulaire de connexion et maintenir à jour le token (via refresh token)


### Créer une "smart home skill" Alexa

#### Créer la skill sur Alexa
Il suffit de créer un compte sur Alexa developper (https://developer.amazon.com/alexa/) et créer sa skill "smart home".
il faudra configurer dans "build" le payload 
.....


#### Créer le service OAUTH2

##### Schéma de fonctionnement OAUTH2
Le schéma qui suit illustre le service permettant à un utilisateur d'associer sont compte  à Alexa et fournir le token d'accès.
![Authorization code grant flow](https://m.media-amazon.com/images/G/01/mobile-apps/dex/ask-accountlinking/auth-code-grant-flow-sequence._TTH_.png)
*Authorization code grant flow*

Le diagrame suivant schématise le workflow d'utilisation du token par Alexa pour retrouver les informations concernant le compte de l'utilisateur 
![Skill interaction sequence](https://m.media-amazon.com/images/G/01/mobile-apps/dex/ask-accountlinking/skill-interaction-sequence._TTH_.png)
*Skill interaction sequence*

Le fonctionnement est assez simple, le but est d'utiliser une identification sur une plateforme externe pour donner l'autorisation de se connecter à Alexa.
1. En premier lieu l'application qui souhaite utiliser OAUTH fait un appel au service d'identification 
2.  Le service d'identification va afficherun formulaire à l'utilisateur
3.  ce dernier, une fois correctement identifié, sera redirigé vers le service appelant (Alexa) avec un code d'identification valide pendant une courte durée
4.  Alexa va présenter ce code au service OAUTH et obtenir un "TOKEN" d'identification, unique et permettant d'identifier, à chaque futur appel, l'utilisateur

*Exemple:
Après identification l'utilisateur obtient le token aaabbb.
S'il lance la commande "Alexa ouvre le volet", Alexa va appeler la skill avec la commande "ouvre le volet" et présenter le token aaabbb.
La skill va demander au serveur OAUTH à quel utilisateur appartient ce token et récupérer les paramètres de connexion au serveur Domoticz.
A aucun moment les codes d'identification transitent entre l'utilisateur et Alexa. 
Par contre Alexa et le serveur d'application font transiter des données protégées (accès à Domoticz) mais de serveur à serveur en HTTPS (donc limitant les risques d'interception).*


##### Format d'échange

For example, if the authorization URI for your page is https://www.carfu.com/login, the URL called by the Alexa app might look like this:

```
https://www.carfu.com/login?state=abc&client_id=unique-id&scope=order_car%20basic_profile&response_type=code&redirect_uri=https%3A//pitangui.amazon.com/api/skill/link/M2AAAAAAAAAAAA
```
For example, assume your Amazon-provided redirect URL is the following:

```https://pitangui.amazon.com/api/skill/link/M2AAAAAAAAAAAA```
Your authorization URI would then redirect the user to:

```https://pitangui.amazon.com/api/skill/link/M2AAAAAAAAAAAA&state=xyz&code=SplxlOBeZQQYbYS6WxSbIA```
Note that the parameters are passed in the URL query string.


Request format
Your servers obtain their access tokens by providing your client credentials in a request call to ADM servers. You can use this same request to acquire an initial access token or to obtain a new one when a prior access token has expired.

To obtain an access token, your server issues a POST request on an HTTPS connection. The request looks similar to this:

```
POST /auth/O2/token HTTP/1.1
Host: api.amazon.com
Content-Type: application/x-www-form-urlencoded;charset=UTF-8

grant_type=client_credentials&scope=messaging:push&client_id=(YOUR_CLIENT_ID)&client_secret=(YOUR_CLIENT_SECRET)
```


Response format
After successfully receiving and interpreting your POST request message, ADM sends your server an HTTP response message that looks similar to this:

```
X-Amzn-RequestId: d917ceac-2245-11e2-a270-0bc161cb589d
Content-Type: application/json

{
  "access_token":"Atc|MQEWYJxEnP3I1ND03ZzbY_NxQkA7Kn7Aioev_OfMRcyVQ4NxGzJMEaKJ8f0lSOiV-yW270o6fnkI",
  "expires_in":3600,
  "scope":"messaging:push",
  "token_type":"Bearer"
}
```

##### Debug
https://developer.amazon.com/fr/blogs/post/TxQN2C04S97C0J/how-to-set-up-amazon-api-gateway-as-a-proxy-to-debug-account-linking

https://forums.developer.amazon.com/articles/38610/alexa-debugging-account-linking.html
especially the "Note that the account linking URL must be a HTTPS URL on port 443, with a certificate from an Amazon approved CA authority"


### use it in alexa Skill
https://developer.amazon.com/fr/docs/account-linking/add-account-linking-logic-smart-home.html

### TODO
- si pas de logs, penser aux droits par défaut à mettre
- pour oauth il ne faut pas activer le retour asynchrone sinon il faut gérer l'event
- si la skill n'est pas appelée par homekit : vérifier la région
