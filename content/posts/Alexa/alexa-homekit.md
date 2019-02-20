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
Alexa m'apparait néanmoins plus "pratique" par la possibilité de tester sa skill sans la publier, directement sur son enceinte Alexa.

## Créons une skill

### Principe de base
Quelle que soit la skill, le principe de base est :
* Alexa reçoit la commande vocale de l'utilisateur et l'analyse pour détecter si l'utilisateur invoque une skill et les paramètres (cf ![la doc officielle](https://developer.amazon.com/fr/docs/custom-skills/understanding-how-users-invoke-custom-skills.html))
* Alexa appelle ensuite la skill en lui passant les paramètres détectés (action, mots de connexion, etc.)
* La skill retourne une phrase qu'Alexa lira et/ou exécute une action spécifique (par exemple commander une pizza).


OAUTH
### Process
The following diagram illustrates the initial setup when the user links their account and Alexa obtains the access token from your authorization server.
![Authorization code grant flow](https://m.media-amazon.com/images/G/01/mobile-apps/dex/ask-accountlinking/auth-code-grant-flow-sequence._TTH_.png)
*Authorization code grant flow*

This diagram shows the flow when the user makes a request to the skill and the skill then uses the access token to retrieve information from the resource server.
![Skill interaction sequence](https://m.media-amazon.com/images/G/01/mobile-apps/dex/ask-accountlinking/skill-interaction-sequence._TTH_.png)
*Skill interaction sequence*

### Exchange format

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

### Debug
https://developer.amazon.com/fr/blogs/post/TxQN2C04S97C0J/how-to-set-up-amazon-api-gateway-as-a-proxy-to-debug-account-linking

https://forums.developer.amazon.com/articles/38610/alexa-debugging-account-linking.html
especially the "Note that the account linking URL must be a HTTPS URL on port 443, with a certificate from an Amazon approved CA authority"


### use it in alexa Skill
https://developer.amazon.com/fr/docs/account-linking/add-account-linking-logic-smart-home.html

### TODO
- si pas de logs, penser aux droits par défaut à mettre
- pour oauth il ne faut pas activer le retour asynchrone sinon il faut gérer l'event
- si la skill n'est pas appelée par homekit : vérifier la région
