import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { products } from './schema';
import crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log('🌱 Começando o seeding...');

  await db.insert(products).values([
    {
      id: crypto.randomUUID(),
      name: 'Broca de Diamante',
      slug: 'broca-de-diamante',
      price: 15000, // R$ 150,00
      inventory: 10,
      imageUrl: 'https://via.placeholder.com/150',
      weight: '0.5',
      width: '10',
      height: '5',
      length: '15',
    },
    {
      id: crypto.randomUUID(),
      name: 'Kit Cuidado com Unhas',
      slug: 'kit-cuidado-com-unhas',
      price: 25000, // R$ 250,00
      inventory: 5,
      imageUrl: 'https://via.placeholder.com/150',
      weight: '1.2',
      width: '20',
      height: '10',
      length: '25',
    }
  ]);

  console.log('✅ Seeding finalizado!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Erro no seeding:', err);
  process.exit(1);
});
