# ALA - Mini Projet Gestion des Secrets CI/CD

## Description

Ce projet démontre les meilleures pratiques pour la gestion des secrets dans les pipelines CI/CD. Il comprend une application exemple et une configuration GitHub Actions qui illustre comment gérer les secrets de manière sécurisée.

This project demonstrates best practices for secrets management in CI/CD pipelines. It includes a sample application and GitHub Actions configuration that illustrates how to handle secrets securely.

## Structure du Projet / Project Structure

```
.
├── app/                    # Application exemple / Sample application
├── .github/workflows/      # Configuration CI/CD GitHub Actions
├── docs/                   # Documentation détaillée / Detailed documentation
├── examples/               # Exemples d'usage / Usage examples
└── README.md              # Ce fichier / This file
```

## Fonctionnalités / Features

- ✅ Application web simple utilisant des secrets
- ✅ Pipeline CI/CD avec GitHub Actions
- ✅ Gestion sécurisée des variables d'environnement
- ✅ Exemples de bonnes et mauvaises pratiques
- ✅ Documentation complète en français et anglais
- ✅ Tests automatisés de sécurité

## Installation et Usage

Voir la documentation dans le dossier `docs/` pour les instructions détaillées.

## Sécurité

Ce projet suit les meilleures pratiques de sécurité pour la gestion des secrets :
- Utilisation des GitHub Secrets
- Variables d'environnement chiffrées
- Principe du moindre privilège
- Audit et logging des accès aux secrets