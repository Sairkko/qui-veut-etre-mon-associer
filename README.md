# Qui veut être mon associé

## 📋 Description

**Qui veut être mon associé** est une plateforme de mise en relation entre entrepreneurs et investisseurs. Cette API REST développée avec NestJS permet aux entrepreneurs de présenter leurs projets et aux investisseurs de découvrir et financer des projets qui correspondent à leurs centres d'intérêt.

## 🚀 Fonctionnalités principales

- **Authentification JWT** avec gestion des rôles (Admin, Entrepreneur, Investisseur)
- **Gestion des utilisateurs** avec profils personnalisés
- **Système de projets** avec création, modification et recommandations
- **Gestion des investissements** avec suivi des montants
- **Centres d'intérêt** pour personnaliser les recommandations
- **Interface d'administration** avec privilèges complets (création, modification, suppression de tous les éléments)
- **Documentation API Swagger** intégrée

## 🛠️ Technologies utilisées

- **Backend** : NestJS, TypeScript
- **Base de données** : MySQL avec TypeORM
- **Authentification** : JWT avec Passport
- **Validation** : class-validator, class-transformer
- **Documentation** : Swagger
- **Sécurité** : bcrypt pour le hashage des mots de passe

## 📦 Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- MySQL (version 8.0 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <url-du-repository>
cd qui-veut-etre-mon-associer
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de la base de données**

Créer un fichier `.env` à la racine du projet :
```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=qui_veut_etre_mon_associe
DB_SYNCHRONIZE=true

# JWT
JWT_SECRET=votre_secret_jwt_super_securise
JWT_EXPIRES_IN=24h

# Application
PORT=3000
```

4. **Créer la base de données**
```sql
CREATE DATABASE qui_veut_etre_mon_associe;
```

5. **Démarrer l'application**
```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

6. **Peupler la base de données (optionnel)**
```bash
npm run seed
```

## 👥 Comptes par défaut

Après avoir exécuté le seeding (`npm run seed`), les comptes suivants sont disponibles :

### 🔑 Compte Administrateur
- **Email** : `admin@example.com`
- **Mot de passe** : `password123`
- **Rôle** : `admin`
- **Permissions** : Accès complet à toutes les fonctionnalités (création, modification, suppression de projets, investissements, utilisateurs et centres d'intérêt)

### 💼 Comptes Entrepreneurs
- **Mot de passe** : `password123` (pour tous)
- **Rôle** : `entrepreneur`
- **Permissions** : Création et gestion de projets, consultation des investissements
- 10 comptes générés automatiquement avec des données fictives

### 💰 Comptes Investisseurs
- **Mot de passe** : `password123` (pour tous)
- **Rôle** : `investor`
- **Permissions** : Consultation des projets, création d'investissements
- 8 comptes générés automatiquement avec des données fictives

## 📚 Documentation API

### 🌐 Swagger UI

La documentation interactive Swagger est disponible à l'adresse :
```
http://localhost:3000/api/docs
```

### 🔗 Endpoints principaux

#### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| `POST` | `/api/auth/register` | Créer un nouveau compte | ✅ |
| `POST` | `/api/auth/login` | Se connecter | ✅ |

#### Utilisateurs (`/api/users`)

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|-------------|-------------|
| `GET` | `/api/users` | Lister tous les utilisateurs | Admin |
| `GET` | `/api/users/profile` | Récupérer son profil | Tous |
| `PATCH` | `/api/users/profile` | Modifier son profil | Tous |
| `DELETE` | `/api/users/:id` | Supprimer un utilisateur | Admin |
| `GET` | `/api/users/interests` | Récupérer ses centres d'intérêt | Tous |
| `POST` | `/api/users/interests` | Associer des centres d'intérêt | Tous |

#### Projets (`/api/projects`)

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|-------------|-------------|
| `POST` | `/api/projects` | Créer un nouveau projet | Entrepreneur/Admin |
| `GET` | `/api/projects` | Lister tous les projets | Tous |
| `GET` | `/api/projects/recommended` | Projets recommandés | Tous |
| `GET` | `/api/projects/:id` | Récupérer un projet | Tous |
| `PATCH` | `/api/projects/:id` | Modifier un projet | Entrepreneur/Admin |
| `DELETE` | `/api/projects/:id` | Supprimer un projet | Entrepreneur/Admin |

#### Investissements (`/api/investments`)

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|-------------|-------------|
| `POST` | `/api/investments` | Créer un investissement | Investisseur/Admin |
| `GET` | `/api/investments` | Lister ses investissements (investisseur/admin) OU tous les investissements (admin) | Investisseur/Admin |
| `GET` | `/api/investments/project/:id` | Investissements d'un projet | Tous |
| `DELETE` | `/api/investments/:id` | Supprimer un investissement | Investisseur/Admin |

#### Centres d'intérêt (`/api/interests`)

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|-------------|-------------|
| `POST` | `/api/interests` | Créer un centre d'intérêt | Admin |
| `GET` | `/api/interests` | Lister les centres d'intérêt | Tous |
| `GET` | `/api/interests/:id` | Récupérer un centre d'intérêt | Tous |
| `DELETE` | `/api/interests/:id` | Supprimer un centre d'intérêt | Admin |

#### Seeding (`/api/seeds`)

| Méthode | Endpoint | Description | Rôle requis |
|---------|----------|-------------|-------------|
| `POST` | `/api/seeds` | Peupler la base de données | Admin |

## 🔐 Authentification

L'API utilise l'authentification JWT. Pour accéder aux endpoints protégés :

1. **Se connecter** via `/api/auth/login`
2. **Récupérer le token** dans la réponse
3. **Inclure le token** dans l'en-tête `Authorization: Bearer <token>`

### Exemple de requête authentifiée

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:3000/api/users/profile
```

## 🎯 Exemples d'utilisation

### Créer un compte entrepreneur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "password": "motdepasse123",
    "role": "entrepreneur"
  }'
```

### Se connecter

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "motdepasse123"
  }'
```

### Créer un projet

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Application mobile innovante",
    "description": "Une application révolutionnaire...",
    "budget": 50000,
    "category": "Technologie"
  }'
```

### Investir dans un projet

```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "projectId": "uuid-du-projet",
    "amount": 5000
  }'
```