Plan proposé
1. Introduction (2 min)

Définition simple de ce qu’est un secret (mot de passe, clé API, certificat, token, etc.)

Pourquoi c’est critique dans les pipelines CI/CD.

Exemple d’incident réel dû à une fuite de secrets (ex. clés publiées sur GitHub).

2. Partie théorique (8 min) – Public non spécialiste

Contexte et motivations

Augmentation des automatisations dans DevOps.

Risques principaux : fuite de données, compromission d’infrastructure, attaques supply chain.

Notions fondamentales

Qu’est-ce qu’un pipeline CI/CD ?

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

3. Partie pratique (8-9 min) – Public d’utilisateurs potentiels

Présentation d’un outil principal

Exemple : HashiCorp Vault, AWS Secrets Manager, ou GitHub Actions secrets.

Fonctionnement général : stockage centralisé, chiffrement, gestion fine des accès.

Mini tutoriel (démonstration ou slides illustrées)

Création d’un secret.

Intégration d’un secret dans un pipeline CI/CD (exemple avec GitHub Actions ou GitLab CI).

Exécution du pipeline en utilisant ce secret.

Avantages et limites

Sécurité et conformité améliorées.

Gestion simplifiée des clés.

Limites : complexité de mise en place, coût, formation nécessaire.

4. Conclusion (1-2 min)

Résumé des points clés.

Message final : la gestion des secrets est un pilier de la sécurité DevSecOps.

Ouverture : adoption progressive des bonnes pratiques dans vos projets.
