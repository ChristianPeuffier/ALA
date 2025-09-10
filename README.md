# Gestion de secrets - Exploration documentaire

## 1. Ressources documentaires

- https://www.gologic.ca/fr-fr/gestion-des-secrets-dans-les-pipelines-ci-cd/
  La gestion des secrets dans les pipelines CI/CD repose sur trois règles d’or : appliquer le principe du moindre accès, limiter la durée de vie des secrets et ne jamais les partager. On distingue trois niveaux d’approche :Secrets chiffrés/scellés : simples à mettre en place mais dépendants d’une clé de déchiffrement.
Voûtes de secrets : coffres-forts centralisés (intégrés, cloud ou tiers) offrant une meilleure gestion et un audit.
Identifiants temporaires (OIDC) : jetons éphémères générés à chaque pipeline, considérés comme la solution la plus sécurisée et moderne.
L’évolution va donc du stockage chiffré vers l’authentification dynamique sans secrets statiques.
- https://capgo.app/fr/blog/managing-secrets-in-cicd-pipelines/#secrets-dans-le-contr%C3%B4le-de-version
- https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
        Les secrets permettent de stocker et utiliser des informations sensibles (ex. : tokens, mots de passe) de manière sécurisée dans un workflow GitHub Actions. Ils évitent d’exposer ces données dans le code. Les secrets sont chiffrés, définis au niveau du dépôt, de l’organisation ou d’un environnement, et injectés sous forme de variables lors de l’exécution des workflows.
- https://blog.stephane-robert.info/docs/conteneurs/orchestrateurs/kubernetes/secrets/
         Les Secrets Kubernetes classiques présentent une faiblesse : ils sont stockés dans les manifests en base64, ce qui les rend vulnérables aux attaques et aux fuites d’informations. La restriction des accès avec RBAC, le chiffrement des Secrets dans etcd, ou l’utilisation d’une solution de gestion externe renforce la sécurité des applications Kubernetes.
- https://medium.com/@pgpg05/secret-management-in-ci-cd-pipeline-982846596181
- https://www.devoteam.com/fr/expert-view/hashicorp-vault/
HashiCorp Vault est un coffre-fort centralisé pour secrets (mots de passe, clés, certificats) avec contrôle d’accès et audit.
Il peut générer des secrets dynamiques, fournir un service de chiffrement et intégrer plusieurs méthodes d’authentification (AppRole, tokens…).
- https://jsaer.com/download/vol-8-iss-2-2021/JSAER2021-8-2-289-295.pdf
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
        La Secrets Management Cheat Sheet de l’OWASP présente les bonnes pratiques pour gérer les secrets (mots de passe, clés API, certificats). Elle insiste sur l’importance de ne jamais stocker ces données en clair dans le code ou dans les dépôts. Le document recommande l’usage de coffres-forts à secrets, de la rotation régulière, et de contrôles d’accès stricts. L’objectif est de limiter les risques de fuite et d’améliorer la sécurité des applications.

## 2. Outils potentiels
