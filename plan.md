Plan proposé
1. Introduction

Qu’est-ce qu’un “secret” ? → mot de passe, clé API, certificat, token.

Pourquoi c’est critique en CI/CD ? → les pipelines manipulent ces secrets automatiquement.

Annonce du plan : on verra d’abord l’importance stratégique (vue manager), puis comment faire concrètement (vue développeurs).

2. Partie théorique – Public non spécialiste (8 min)

🎯 Objectif : convaincre managers/directeurs de l’importance stratégique.

2.1 Les risques

Fuite de secrets → intrusions, pertes de données, sanctions (RGPD, NIS2).

Impact financier et réputationnel : arrêt de service, perte de confiance clients.

2.2 Exemple réel marquant (au lieu d’en intro)

Incident Uber 2022 : un attaquant a exploité une clé exposée pour accéder au système interne.

Résultat : compromission massive, communication de crise, perte de confiance.

2.3 Les enjeux business

Sécuriser les actifs stratégiques.

Réduire le risque juridique et financier.

Montrer que l’entreprise prend la cybersécurité au sérieux.

2.4 Grandes solutions (vue d’ensemble, non technique) Tableau !

Outils intégrés (GitHub, GitLab).

Solutions cloud (AWS/GCP/Azure).

Open source (Vault, SOPS).

➡️ Message clé managers : Investir dans la gestion des secrets = protéger l’image et la valeur de l’entreprise.

3. Partie pratique – Public technique (8-9 min)

🎯 Objectif : donner aux développeurs des outils et méthodes concrètes.

3.1 Panorama d’outils

GitHub Actions Secrets → simple, natif.

GitLab CI/CD Variables → gestion par environnement.

HashiCorp Vault → complet, open source, rotation.

AWS Secrets Manager → rotation auto, natif AWS.

3.2 Mini tutoriel / démo

Exemple YAML : injection d’un secret dans un pipeline CI/CD.

Démonstration visuelle : pipeline → appel secret → déploiement.

4. Conclusion (1-2 min)

Résumé des points clés.

Message final : la gestion des secrets est un pilier de la sécurité DevSecOps.

Ouverture : adoption progressive des bonnes pratiques dans vos projets.
