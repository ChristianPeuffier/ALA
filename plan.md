Plan proposé
1. Introduction

Définition simple de ce qu’est un secret (mot de passe, clé API, certificat, token, etc.)

Pourquoi c’est critique dans les pipelines CI/CD.

Exemple d’incident réel dû à une fuite de secrets (ex. clés publiées sur GitHub).

2. Partie théorique – Public non spécialiste

Contexte et motivations

Augmentation des automatisations dans DevOps.

Risques principaux : fuite de données, compromission d’infrastructure, attaques supply chain.

Notions fondamentales

Où les secrets apparaissent (build, test, déploiement, accès aux services cloud).

Mauvaises pratiques courantes :

secrets en clair dans le code,

variables d’environnement non sécurisées,

partage manuel de mots de passe.

Bonnes pratiques

Principe du moindre privilège.

Rotation régulière des secrets.

Chiffrement et audit.

Utilisation de coffres-forts à secrets.

3. Partie pratique  – Public d’utilisateurs potentiels

Présentation d’un outil principal

Exemple :GitHub Actions secrets, HashiCorp Vault, AWS Secrets Manager.

Fonctionnement général : stockage centralisé, chiffrement, gestion fine des accès.

Mini tutoriel (démonstration ou slides illustrées)

Création d’un secret.

Intégration d’un secret dans une pipeline CI/CD ( GitHub Actions).

Exécution du pipeline en utilisant ce secret.

Avantages et limites

Sécurité et conformité améliorées.

Gestion simplifiée des clés.

Limites : complexité de mise en place, coût, formation nécessaire.

4. Conclusion (1-2 min)

Résumé des points clés.

Message final : la gestion des secrets est un pilier de la sécurité DevSecOps.

Ouverture : adoption progressive des bonnes pratiques dans vos projets.
