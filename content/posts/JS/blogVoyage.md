---
path: "/tripblog"
date: "2019-02-25T21:15:33.962Z"
title: "Le plus important n'est pas la destination mais le voyage"
category: "JS"
blogImage: "https://upload.wikimedia.org/wikipedia/commons/5/53/CIA_map_Central_America_%26_Caribbean.png"
---

# Un blog de voyage pas comme les autres 

## Les voyages
Nous avons tous envie de garder un souvenir de nos voyages et il faut bien dire qu'à part les photos ce n'est pas facile d'avoir un format adequat et plaisant pour suivre et revivre nos péripéties.

Je suis tombé pourtant un jour sur un site qui a changé ma manière de voir les choses
https://tympanus.net/codrops/2015/12/16/animated-map-path-for-interactive-storytelling/

Revivre le voyage avec un blog couplé à une carte, voilà quelque chose d'original !


## Le blog
Le blog fonctionne sur la base d'un plan en SVG (pour facilement pouvoir zoomer dessus), un peu de code js permettant de faire avancer le tracé en fonction du scrolling, le tout servi par un serveur NODE

### Principe de base
Le principe est en soit très simple :
Sur le plan SVG il faut dessiner sur un calque particulier (avec un nom particulier) le chemin parcouru.
Une partie des fonctions JS sont dédiées à la découpe de ce chemin en fonction :
-de la taille du scrolling (un calcul est fait pour qu'à la fin du scrolling l'ensemble du chemin ait été parcouru)
-du nombre de sections (chaque segment du chemin correspond à une section)
-de certaines balises meta dans chaque section qui permettent de dire si cette section est un "stay" (ce qui veut dire que la section ne fait pas avancer le chemin) , si un zoom doit etre effectué etc.
Par exemple, si la section d'arrivée du scroll est un zoom X2, la carte va zoomer progressivement sur tout le segment jusqu'à ce que le scroll arrive à la section en question. A ce moment là le zoom de la carte sera x2
De même, si la section est en "stay" la carte n'avance pas jusqu'à ce que le scroll dépasse cette section.

```
<section class="js-section" data-zoom-start="5" >
				<h2><span class="title-up">🏡 Le départ de la maison</span><span class="title-down">Le départ</span></h2>
				<p class="text-intro">C'est parti pour des vacances de 7j</p>
				<p> A venir </p>
				<!-- figure>
					<img class="js-image" src="img/journey/test.jpg" />
					<figcaption>Teste avec une photo de confluence !</figcaption>
				</figure -->
			</section>
```

Sur cet exemple, le zoom de départ est de 5 et jusque la procaine section le zoom restera à 5 (le déplacement se fera que le long du chemin)

```
<section class="js-section" data-zoom-start="5" data-zoom-middle="2" data-icon="img/plane.svg" data-stay="true">
				<h2><span class="title-up">Vol pour PORTO</span>
				...

			</section>
```
Sur cet exemple, la section définit un zoom de 5 avec une modification à mi-parcourt de 2.
Cette configuration conduira à un effet "dezoom" jusqu'à la moitié du chemin. Selon le zoom de la section d'arrivée le script décidera ou non de zoomer/dezoomer sur la seconde partie du chemin.

Pour résumer : 
-La section en cours définit le zoom de départ et le zoom de mi-parcourt, la section d'arrivée le zoom d'arrivée et le zoom de la seconde moitié de parcourt.
