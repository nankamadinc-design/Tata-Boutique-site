// Static brand constants that never change at runtime (used as safe defaults
// before /api/settings loads, and for social links which are not stored in DB
// per the spec — WhatsApp number and shop text ARE editable via /admin/parametres).
export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/224622063419',
  tiktok: 'https://www.tiktok.com/@ladjilatata',
  facebook: 'https://www.facebook.com/tatadjina',
  youtube: 'https://youtube.com/@guineeisback',
};

export const DEFAULT_WHATSAPP_NUMBER = '224622063419';

export const CATEGORY_SEED = [
  {
    "name": "Tous",
    "slug": "tous"
  },
  {
    "name": "Mode et vêtements",
    "slug": "mode-vetements"
  },
  {
    "name": "Chaussures et maroquinerie",
    "slug": "chaussures-maroquinerie"
  },
  {
    "name": "Beauté et cosmétiques",
    "slug": "beaute-cosmetiques"
  },
  {
    "name": "Téléphones et accessoires",
    "slug": "telephones"
  },
  {
    "name": "Électronique et informatique",
    "slug": "electronique-informatique"
  },
  {
    "name": "Maison et électroménager",
    "slug": "maison-electromenager"
  },
  {
    "name": "Construction et bricolage",
    "slug": "construction-bricolage"
  },
  {
    "name": "Enfants et bébés",
    "slug": "enfants-bebes"
  },
  {
    "name": "Jouets et loisirs",
    "slug": "jouets-loisirs"
  },
  {
    "name": "Vélos et mobilité",
    "slug": "velos-mobilite"
  },
  {
    "name": "Sport et fitness",
    "slug": "sport-fitness"
  },
  {
    "name": "Automobile et accessoires",
    "slug": "automobile"
  },
  {
    "name": "Jardinage",
    "slug": "jardinage"
  },
  {
    "name": "Fournitures scolaires",
    "slug": "fournitures-scolaires"
  },
  {
    "name": "Autres",
    "slug": "autres"
  }
];

// The 11 official Tata Boutique slideshow images — do not replace or reorder arbitrarily.
export const SLIDESHOW_IMAGES: string[] = [
  'https://i.ibb.co/nMdLwdVJ/Screenshot-20260926-015418-Facebook.jpg',
  'https://i.ibb.co/4ZXQx0Xp/FB-IMG-1790387682037.jpg',
  'https://i.ibb.co/ccrdGmr7/FB-IMG-1790387688397.jpg',
  'https://i.ibb.co/DH3Xgwts/FB-IMG-1790387722253.jpg',
  'https://i.ibb.co/NdG3w7Ln/FB-IMG-1790387725850.jpg',
  'https://i.ibb.co/d0jdth02/FB-IMG-1790387728961.jpg',
  'https://i.ibb.co/TBXcMz8q/FB-IMG-1790387732026.jpg',
  'https://i.ibb.co/bMWhtgkm/FB-IMG-1790387734665.jpg',
  'https://i.ibb.co/wFxLD6X4/FB-IMG-1790387737445.jpg',
  'https://i.ibb.co/zTqFvpC6/FB-IMG-1790387739429.jpg',
  'https://i.ibb.co/9HfSfDY8/FB-IMG-1790388663730.jpg',
];
