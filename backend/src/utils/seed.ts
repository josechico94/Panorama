import dotenv from 'dotenv';
dotenv.config();

const slugify = (text: string): string =>
  text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now().toString(36);

import mongoose from 'mongoose';
import { Place } from '../models/Place';
import { Admin } from '../models/Admin';

const makeSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  + '-' + Date.now().toString(36)

const PLACES = [
  {
    name: 'Osteria dell\'Orsa',
    city: 'bologna',
    category: 'eat',
    tags: ['trattoria', 'tortellini', 'tagliatelle', 'economico', 'locale'],
    shortDescription: 'La trattoria storica di Bologna, famosa per le tagliatelle al ragù a prezzi onesti.',
    description: 'Dal 1978, l\'Osteria dell\'Orsa è il tempio della cucina bolognese autentica. Tortellini in brodo, tagliatelle al ragù e lasagne come vuole la tradizione. Ambiente informale, code inevitabili ma ne vale la pena.',
    location: { address: 'Via Mentana 1, Bologna', neighborhood: 'Centro Storico', coordinates: { lat: 44.4946, lng: 11.3461 } },
    priceRange: 1,
    contact: { phone: '+39 051 231576', instagram: 'osteriadellorsa' },
    hours: {
      monday: { open: '12:00', close: '23:00', closed: false },
      tuesday: { open: '12:00', close: '23:00', closed: false },
      wednesday: { open: '12:00', close: '23:00', closed: false },
      thursday: { open: '12:00', close: '23:00', closed: false },
      friday: { open: '12:00', close: '23:30', closed: false },
      saturday: { open: '12:00', close: '23:30', closed: false },
      sunday: { open: '12:00', close: '22:30', closed: false },
    },
    meta: { featured: true, active: true, views: 0 },
  },
  {
    name: 'Enoteca Italiana',
    city: 'bologna',
    category: 'drink',
    tags: ['vino', 'aperitivo', 'cocktail', 'terrazza', 'centro'],
    shortDescription: 'Selezione curata di vini locali e cocktail creativi, perfetti per l\'aperitivo bolognese.',
    description: 'Un\'enoteca moderna nel cuore di Bologna, con oltre 200 etichette selezionate tra le migliori cantine emiliane e italiane. L\'aperitivo qui è un rito: taglieri generosi, bollicine e ottima compagnia.',
    location: { address: 'Via Pescherie Vecchie 3, Bologna', neighborhood: 'Quadrilatero', coordinates: { lat: 44.4940, lng: 11.3430 } },
    priceRange: 2,
    contact: { instagram: 'enotecaitalianabo', website: 'https://example.com' },
    hours: {
      monday: null,
      tuesday: { open: '17:00', close: '01:00', closed: false },
      wednesday: { open: '17:00', close: '01:00', closed: false },
      thursday: { open: '17:00', close: '01:00', closed: false },
      friday: { open: '17:00', close: '02:00', closed: false },
      saturday: { open: '17:00', close: '02:00', closed: false },
      sunday: { open: '17:00', close: '00:00', closed: false },
    },
    meta: { featured: true, active: true, views: 0 },
  },
  {
    name: 'MAMbo – Museo d\'Arte Moderna',
    city: 'bologna',
    category: 'culture',
    tags: ['museo', 'arte moderna', 'contemporanea', 'cultura', 'weekend'],
    shortDescription: 'Il principale museo d\'arte moderna e contemporanea di Bologna, nel cuore della Bolognina.',
    description: 'Il Museo d\'Arte Moderna di Bologna ospita la collezione civica d\'arte moderna e mostre temporanee di artisti nazionali e internazionali. Un must per gli amanti dell\'arte contemporanea.',
    location: { address: 'Via Don Minzoni 14, Bologna', neighborhood: 'Bolognina', coordinates: { lat: 44.5020, lng: 11.3470 } },
    priceRange: 1,
    contact: { website: 'https://www.mambo-bologna.org', phone: '+39 051 6496611' },
    hours: {
      monday: { open: '00:00', close: '00:00', closed: true },
      tuesday: { open: '10:00', close: '18:00', closed: false },
      wednesday: { open: '10:00', close: '18:00', closed: false },
      thursday: { open: '10:00', close: '18:00', closed: false },
      friday: { open: '10:00', close: '22:00', closed: false },
      saturday: { open: '10:00', close: '20:00', closed: false },
      sunday: { open: '10:00', close: '20:00', closed: false },
    },
    meta: { featured: true, active: true, views: 0 },
  },
  {
    name: 'Mercato delle Erbe',
    city: 'bologna',
    category: 'shop',
    tags: ['mercato', 'street food', 'biologico', 'locale', 'frutta'],
    shortDescription: 'Il mercato coperto storico di Bologna, con bancarelle di prodotti freschi e street food.',
    description: 'Il Mercato delle Erbe è uno dei mercati coperti più belli d\'Italia. Al mattino trovi prodotti freschi, frutta e verdura di stagione. La sera si trasforma in un vivace polo gastronomico con banchi di street food e birra artigianale.',
    location: { address: 'Via Ugo Bassi 25, Bologna', neighborhood: 'Centro Storico', coordinates: { lat: 44.4957, lng: 11.3397 } },
    priceRange: 1,
    contact: { website: 'https://www.mercatodellerbe.it', instagram: 'mercatodellerbe' },
    hours: {
      monday: { open: '07:00', close: '24:00', closed: false },
      tuesday: { open: '07:00', close: '24:00', closed: false },
      wednesday: { open: '07:00', close: '24:00', closed: false },
      thursday: { open: '07:00', close: '24:00', closed: false },
      friday: { open: '07:00', close: '24:00', closed: false },
      saturday: { open: '07:00', close: '24:00', closed: false },
      sunday: { open: '00:00', close: '00:00', closed: true },
    },
    meta: { featured: false, active: true, views: 0 },
  },
  {
    name: 'Portico di San Luca',
    city: 'bologna',
    category: 'walk',
    tags: ['portico', 'panorama', 'passeggiata', 'colline', 'iconico'],
    shortDescription: 'Il portico più lungo del mondo, 3,8 km di archi che portano alla Basilica di San Luca.',
    description: 'Con i suoi 666 archi e 3,8 km di lunghezza, il Portico di San Luca è il portico coperto più lungo del mondo. La passeggiata fino alla Basilica di San Luca offre una vista mozzafiato sulla città. Imperdibile al tramonto.',
    location: { address: 'Via di San Luca, Bologna', neighborhood: 'Colli', coordinates: { lat: 44.4755, lng: 11.3091 } },
    priceRange: 1,
    contact: { website: 'https://www.santuariosanluca.it' },
    hours: {
      monday: { open: '07:00', close: '20:00', closed: false },
      tuesday: { open: '07:00', close: '20:00', closed: false },
      wednesday: { open: '07:00', close: '20:00', closed: false },
      thursday: { open: '07:00', close: '20:00', closed: false },
      friday: { open: '07:00', close: '20:00', closed: false },
      saturday: { open: '07:00', close: '20:00', closed: false },
      sunday: { open: '07:00', close: '20:00', closed: false },
    },
    meta: { featured: true, active: true, views: 0 },
  },
  {
    name: 'Bonsai Club Bologna',
    city: 'bologna',
    category: 'sport',
    tags: ['yoga', 'pilates', 'fitness', 'wellness', 'centro'],
    shortDescription: 'Centro wellness moderno con yoga, pilates e functional training nel cuore della città.',
    description: 'Uno spazio dedicato al benessere fisico e mentale nel centro di Bologna. Classi di yoga, pilates, meditazione e functional training. Istruttori certificati e ambiente accogliente.',
    location: { address: 'Via Indipendenza 44, Bologna', neighborhood: 'Centro Storico', coordinates: { lat: 44.5010, lng: 11.3440 } },
    priceRange: 2,
    contact: { phone: '+39 051 9876543', instagram: 'bonsaibologna', website: 'https://example.com' },
    hours: {
      monday: { open: '07:00', close: '22:00', closed: false },
      tuesday: { open: '07:00', close: '22:00', closed: false },
      wednesday: { open: '07:00', close: '22:00', closed: false },
      thursday: { open: '07:00', close: '22:00', closed: false },
      friday: { open: '07:00', close: '21:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '14:00', closed: false },
    },
    meta: { featured: false, active: true, views: 0 },
  },
  {
    name: 'Cassero LGBTQ+ Center',
    city: 'bologna',
    category: 'night',
    tags: ['club', 'lgbtq', 'serate', 'musica', 'inclusivo'],
    shortDescription: 'Il locale notturno più iconico e inclusivo di Bologna, storico punto di riferimento LGBTQ+.',
    description: 'Il Cassero è uno dei club più storici e inclusivi d\'Italia, punto di riferimento della comunità LGBTQ+ bolognese. Serate a tema, concerti, dj set e apertura verso tutti.',
    location: { address: 'Via Don Minzoni 18, Bologna', neighborhood: 'Bolognina', coordinates: { lat: 44.5018, lng: 11.3472 } },
    priceRange: 1,
    contact: { website: 'https://www.cassero.it', instagram: 'casserobologna' },
    hours: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: { open: '22:00', close: '04:00', closed: false },
      friday: { open: '22:00', close: '05:00', closed: false },
      saturday: { open: '22:00', close: '05:00', closed: false },
      sunday: { open: '22:00', close: '04:00', closed: false },
    },
    meta: { featured: false, active: true, views: 0 },
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now().toString(36)
}

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cityapp';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Place.deleteMany({ city: 'bologna' });
    console.log('🗑️  Cleared existing Bologna places');

    // Insert places
    for (const p of PLACES) {
      const place = new Place({ ...p, slug: slugify(p.name) });
      await place.save();
      console.log(`✅ Created: ${p.name}`);
    }

    // Create admin if not exists
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@cityapp.com' });
    if (!exists) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@cityapp.com',
        password: process.env.ADMIN_PASSWORD || 'changeme123',
        name: 'Super Admin',
        role: 'superadmin',
      });
      console.log('✅ Admin user created');
    }

    console.log('\n🎉 Seed complete!');
    console.log(`📍 ${PLACES.length} places inserted for Bologna`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
