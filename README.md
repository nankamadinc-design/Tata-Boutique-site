# Tata Boutique — Boutique en ligne en Guinée

« La qualité au meilleur prix »

Site e-commerce complet pour **Tata Boutique**, une boutique en ligne basée en Guinée qui prend ses commandes directement via WhatsApp. Le projet est entièrement indépendant : il n'est **jamais** mélangé avec un autre site ou projet (ex. TABOB).

- Frontend : React + TypeScript + Vite + Tailwind CSS
- Backend : Cloudflare Workers (API REST)
- Base de données : Cloudflare D1 (SQL)
- Stockage images : Cloudflare R2
- Hébergement frontend : Cloudflare Pages
- DNS / SSL : Cloudflare (domaine `www.tataboutique.com`, déjà existant — **ce projet ne propose jamais d'acheter un domaine**)

Aucun Supabase, Firebase, Vercel ou Netlify n'est utilisé où que ce soit dans ce projet.

---

## 1. Structure du projet

```
tata-boutique/
├── public/                     robots.txt, sitemap.xml, favicon.svg, _redirects (SPA fallback Pages)
├── src/
│   ├── components/             Header, Footer, Slideshow, ProductCard, WhatsAppButton, SEO, etc.
│   ├── pages/                  Home, Shop, CategoriesPage, Product, About, Contact, NotFound
│   ├── admin/                  Login, Dashboard, ProductList/Form, Categories, Settings
│   ├── context/                SettingsContext, AdminAuthContext
│   ├── services/                api.ts (client REST), authStorage.ts
│   ├── hooks/, utils/, types/, config/
│   ├── App.tsx, main.tsx, index.css
├── workers/
│   ├── src/
│   │   ├── index.ts            routeur principal + CORS + gestion d'erreurs
│   │   ├── routes/              public.ts, adminAuth.ts, adminProducts.ts, adminCategories.ts,
│   │   │                        adminSettings.ts, adminUploads.ts, adminDashboard.ts
│   │   ├── auth.ts, crypto.ts, env.ts, http.ts, mappers.ts, types.ts
│   └── scripts/create-admin.mjs  génère le hash du mot de passe admin (jamais commité)
├── migrations/
│   ├── 0001_init.sql            schéma (products, categories, admin_users, settings, login_attempts, contact_messages)
│   └── 0002_seed.sql            catégories par défaut + ligne settings (idempotent, ne réinitialise jamais les données)
├── wrangler.toml
├── .env.example                 variables frontend (Cloudflare Pages)
├── .dev.vars.example             secrets Worker pour le développement local
└── package.json
```

---

## 2. Installation

```bash
cd tata-boutique
npm install
```

## 3. Développement local

### 3.1 Créer la base D1 locale et appliquer les migrations

```bash
npx wrangler d1 migrations apply tata_boutique_db --local
```

### 3.2 Générer un administrateur de test

```bash
node workers/scripts/create-admin.mjs "admin@tataboutique.com" "VotreMotDePasseSolide123!"
```

Le script affiche un hash PBKDF2 et un `JWT_SECRET` aléatoire — **jamais le mot de passe en clair n'est écrit sur disque**. Copiez les valeurs affichées dans un fichier `.dev.vars` (non suivi par Git) à la racine du projet :

```
ADMIN_EMAIL=admin@tataboutique.com
ADMIN_PASSWORD_HASH=pbkdf2$100000$....
JWT_SECRET=....
```

### 3.3 Lancer le Worker (API) localement

```bash
npx wrangler dev --local --port 8787
```

### 3.4 Lancer le frontend

Dans un autre terminal :

```bash
cp .env.example .env
# .env : VITE_API_BASE_URL=http://localhost:8787
npm run dev
```

Le site est disponible sur `http://localhost:5173`, connecté à l'API locale sur le port 8787.

---

## 4. Déploiement en production (Cloudflare)

### 4.1 Créer les ressources Cloudflare

```bash
# Base de données D1
npx wrangler d1 create tata_boutique_db
# → copiez le database_id retourné dans wrangler.toml (remplace REPLACE_WITH_YOUR_D1_DATABASE_ID)

# Bucket R2 pour les images produits
npx wrangler r2 bucket create tata-boutique-images
```

Dans le dashboard Cloudflare, activez l'accès public du bucket R2 (R2 → tata-boutique-images → Settings → Public access) et notez l'URL publique. Mettez-la dans `wrangler.toml` (`IMAGES_PUBLIC_BASE_URL`).

### 4.2 Appliquer les migrations en production

```bash
npx wrangler d1 migrations apply tata_boutique_db --remote
```

Cette commande ne réinitialise jamais les produits existants : la seed (`0002_seed.sql`) utilise `INSERT OR IGNORE` et ne s'exécute qu'une fois, sur une base vide.

### 4.3 Configurer les secrets (jamais dans le code ni dans wrangler.toml)

```bash
node workers/scripts/create-admin.mjs "admin@tataboutique.com" "VotreMotDePasseDefinitif!"
# copiez le hash et le secret affichés, puis :

npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD_HASH
npx wrangler secret put JWT_SECRET
```

Si `JWT_SECRET` n'est pas configuré, le Worker refuse de démarrer en production (`assertProductionSecrets`, voir `workers/src/env.ts`) — c'est intentionnel.

### 4.4 Déployer le Worker (API)

```bash
npx wrangler deploy --env production
```

Cela publie l'API sur la route `api.tataboutique.com/*` (déjà configurée dans `wrangler.toml`), à condition que la zone `tataboutique.com` soit gérée par ce compte Cloudflare.

### 4.5 Construire et déployer le frontend sur Cloudflare Pages

```bash
# Variables de build à définir dans Cloudflare Pages → Settings → Environment variables :
#   VITE_API_BASE_URL = https://api.tataboutique.com
#   VITE_ROUTER = browser

npm run build
```

Dans le dashboard Cloudflare Pages :

1. Connectez le dépôt Git du projet (ou déployez `dist/` directement via `npx wrangler pages deploy dist`).
2. Build command : `npm run build` — Build output directory : `dist`.
3. Ajoutez les variables d'environnement ci-dessus.
4. Domaine personnalisé : ajoutez `www.tataboutique.com` (et redirigez `tataboutique.com` → `www.tataboutique.com`, ou l'inverse selon votre préférence, via Cloudflare Pages → Custom domains + une règle de redirection dans Cloudflare Rules).

### 4.6 Connecter www.tataboutique.com

Le domaine existe déjà et est géré via Cloudflare — aucun achat de domaine n'est nécessaire :

1. Dans Cloudflare Pages → votre projet → Custom domains, ajoutez `www.tataboutique.com`. Cloudflare crée automatiquement l'enregistrement DNS (CNAME) pointant vers Pages.
2. Pour l'API, `wrangler.toml` réserve déjà la route `api.tataboutique.com/*` — assurez-vous qu'un enregistrement DNS (proxied, orange cloud) existe pour `api` sur la zone `tataboutique.com` (Cloudflare le crée aussi automatiquement au premier `wrangler deploy --env production` si la zone est correctement configurée, sinon ajoutez un enregistrement A/AAAA factice proxié).
3. SSL/TLS : réglez le mode sur **Full (strict)** dans Cloudflare → SSL/TLS. Le certificat est géré automatiquement par Cloudflare.
4. Redirection racine ↔ www : créez une règle de redirection (Cloudflare → Rules → Redirect Rules) pour rediriger `tataboutique.com/*` vers `https://www.tataboutique.com/$1` (ou l'inverse, selon le domaine canonique choisi — ce README suppose `www.tataboutique.com` comme domaine canonique, conformément à la balise `<link rel="canonical">` du site).

---

## 4.7 Déployer depuis Termux (Android)

Tout ce README fonctionne aussi tel quel dans Termux — Cloudflare Workers/Pages/D1/R2 ne nécessitent qu'un terminal Node.js. Quelques points spécifiques à Termux :

### Installer les paquets nécessaires

```bash
pkg update && pkg upgrade
pkg install nodejs-lts git
node --version   # doit afficher v18 ou plus (idéalement v20)
npm --version
```

Si `nodejs-lts` n'est pas disponible sur votre dépôt, utilisez `pkg install nodejs` (version courante).

### Récupérer le projet

Soit vous clonez votre dépôt Git existant, soit vous décompressez l'archive fournie :

```bash
# Option A — dépôt Git
git clone <url-de-votre-depot> tata-boutique
cd tata-boutique

# Option B — archive .zip envoyée dans la conversation
# Copiez le .zip dans le stockage partagé, puis :
termux-setup-storage   # une seule fois, autorise l'accès au stockage partagé
unzip /sdcard/Download/tata-boutique.zip -d ~/tata-boutique
cd ~/tata-boutique
```

### Installer les dépendances

```bash
npm install
cd workers && npm install && cd ..
```

### Se connecter à Cloudflare (`wrangler login` sans navigateur graphique)

Termux n'a pas de navigateur intégré capable d'ouvrir automatiquement la fenêtre d'autorisation OAuth de `wrangler login`. Deux solutions :

**Solution recommandée — jeton API (pas de navigateur nécessaire) :**

1. Sur votre téléphone ou un autre appareil, ouvrez [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens).
2. Créez un jeton avec le modèle **Edit Cloudflare Workers** (il couvre Workers, D1, R2, Pages).
3. Dans Termux :

```bash
export CLOUDFLARE_API_TOKEN="votre_jeton_ici"
# Rendez-le permanent pour les prochaines sessions :
echo 'export CLOUDFLARE_API_TOKEN="votre_jeton_ici"' >> ~/.bashrc
```

Avec cette variable définie, toutes les commandes `npx wrangler ...` de ce README fonctionnent directement, sans jamais appeler `wrangler login`.

**Solution alternative — `wrangler login` classique :**

```bash
npx wrangler login
```

Termux affiche une URL `https://dash.cloudflare.com/oauth/authorize?...` — copiez-la manuellement et ouvrez-la dans Chrome/Firefox sur le téléphone (ou un autre appareil), autorisez l'accès, puis revenez dans Termux : la commande se termine automatiquement une fois l'autorisation confirmée côté Cloudflare.

### Suite du déploiement

Une fois authentifié (par jeton ou par login), suivez normalement les sections **4.1 à 4.6** ci-dessus : création des ressources D1/R2, migrations, secrets (`wrangler secret put` fonctionne aussi en mode jeton API), déploiement du Worker, build et déploiement du frontend sur Pages.

```bash
# Exemple de séquence complète à lancer dans Termux, dans l'ordre :
npx wrangler d1 create tata_boutique_db
# → reportez le database_id dans wrangler.toml
npx wrangler r2 bucket create tata-boutique-images
npx wrangler d1 migrations apply tata_boutique_db --remote
node workers/scripts/create-admin.mjs "admin@tataboutique.com" "VotreMotDePasseDefinitif!"
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD_HASH
npx wrangler secret put JWT_SECRET
npx wrangler deploy --env production
npm run build
npx wrangler pages deploy dist --project-name tata-boutique
```

### Astuces Termux

- Si `npm install` échoue avec des erreurs de compilation native, installez d'abord `pkg install build-essential python`.
- Gardez le téléphone branché et l'écran allumé (ou utilisez `termux-wake-lock`) pendant les opérations longues (`npm install`, `wrangler deploy`) pour éviter que Android ne mette Termux en veille.
- Pour éditer les fichiers (`wrangler.toml`, `.dev.vars`, etc.) directement dans Termux : `pkg install nano` puis `nano wrangler.toml`, ou utilisez un éditeur de code Android (Acode, par exemple) pointé sur le même dossier.
- Vérifiez la connexion à tout moment avec `npx wrangler whoami`.

---

## 5. Ajouter les premiers produits

1. Connectez-vous sur `https://www.tataboutique.com/admin/connexion` avec l'administrateur créé à l'étape 4.3.
2. Allez dans **Produits → Ajouter un produit**.
3. Renseignez nom, description, prix, catégorie, stock, statut (publié / brouillon / masqué / rupture de stock).
4. Téléchargez une ou plusieurs images (JPG, JPEG, PNG ou WEBP, taille et dimensions validées côté serveur) — elles sont stockées dans le bucket R2, jamais en Base64 dans la base de données.
5. Enregistrez : le produit apparaît immédiatement sur le site public s'il est « publié ».

Les catégories sont gérables dans **Catégories** — vous pouvez en ajouter, en renommer, ou changer leur photo de couverture à tout moment. Chaque catégorie peut avoir une **image de couverture** (`imageUrl`) affichée en galerie sur la page d'accueil et sur la page « Catégories », dans un style inspiré des grandes places de marché (vignette photo + dégradé + nom), plutôt que de simples pastilles texte. Sans image définie, l'icône emoji sert de repli visuel.

---

## 6. Sécurité

- Aucun mot de passe ni secret n'est écrit en dur dans le code ou le dépôt Git — uniquement des variables d'environnement (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`) définies via `wrangler secret put`.
- Le mot de passe administrateur est haché avec PBKDF2 (100 000 itérations) — jamais stocké en clair.
- Les jetons de session admin sont des JWT HS256 signés côté serveur, vérifiés à chaque requête admin (`requireAdmin`).
- Protection anti-brute-force : après 5 tentatives de connexion échouées en 15 minutes pour une même adresse IP/email, l'API renvoie `429 too_many_attempts`.
- Toutes les routes de création/modification/suppression de produits, catégories et paramètres exigent un jeton admin valide — l'application ne fait jamais confiance à la seule interface React : la vérification est appliquée côté serveur (Worker).
- Les visiteurs publics ne peuvent que consulter les produits publiés et les pages publiques ; aucune route publique ne permet de créer, modifier ou supprimer quoi que ce soit.

## 7. Persistance des données

Les données (produits, catégories, paramètres) vivent exclusivement dans Cloudflare D1. Elles ne sont **jamais** réinitialisées au redémarrage du Worker — la seed (`migrations/0002_seed.sql`) utilise `INSERT OR IGNORE` et ne s'applique qu'une fois, à l'installation initiale sur une base vide. Ajouter, modifier ou supprimer un produit persiste immédiatement en base et survit à tout redémarrage ou redéploiement du Worker.

## 8. Évolutions futures (architecture prévue, non implémentée)

La structure du projet (routes, types, base D1) est conçue pour permettre, sans réécriture complète :

- **v2** : panier, commandes, fiches clients, gestion de la livraison.
- **v3** : paiement Orange Money / Mobile Money, coupons de réduction, factures.
- **v4** : comptes clients, notifications, programme de fidélité, statistiques avancées.

## 9. Réseaux sociaux et contact

- WhatsApp : [+224 622 06 34 19](https://wa.me/224622063419)
- Facebook : [facebook.com/tatadjina](https://www.facebook.com/tatadjina)
- TikTok : [tiktok.com/@ladjilatata](https://www.tiktok.com/@ladjilatata)
- YouTube : [youtube.com/@guineeisback](https://youtube.com/@guineeisback)

Ces liens sont éditables depuis **Admin → Paramètres** ; toute modification s'applique immédiatement sur l'ensemble du site (en-tête, pied de page, boutons WhatsApp flottants et de commande).
