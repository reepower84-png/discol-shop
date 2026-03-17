import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Vercel 서버리스 환경에서는 /tmp만 쓰기 가능
const isVercel = process.env.VERCEL === '1';
const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'discol.db');

if (!isVercel && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    product_type TEXT,
    payment_method TEXT,
    status TEXT DEFAULT '대기중',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    detail_images TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// 기본 상품 데이터 삽입 (없을 경우에만)
const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (existingProducts.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (id, type, name, price, description)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertProduct.run('adult-foam', 'adult', '디스콜 거품치약 (성인용)', 18000, '성인을 위한 프리미엄 거품치약. 풍부한 거품으로 구석구석 깨끗하게 세정합니다.');
  db.prepare("UPDATE products SET image_url = '/main-K 2.jpg' WHERE id = 'adult-foam'").run();
  insertProduct.run('child-foam', 'child', '디스콜 거품치약 (어린이용)', 18000, '어린이를 위한 순한 거품치약. 자극 없이 부드럽게 세정합니다.');
  db.prepare("UPDATE products SET image_url = '/main-C 2.jpg' WHERE id = 'child-foam'").run();
  insertProduct.run('baby', 'baby', '디스콜 치약 (영유아용)', 20000, '영유아를 위한 저자극 치약. 삼켜도 안전한 성분으로 제조되었습니다.');
  db.prepare("UPDATE products SET image_url = '/main-bebe 4.jpg' WHERE id = 'baby'").run();
  insertProduct.run('pet', 'pet', '디스콜 치약 (반려동물용)', 22000, '반려동물을 위한 안전한 치약. 반려동물 구강 건강을 지켜줍니다.');
  db.prepare("UPDATE products SET image_url = '/d&k 1.jpg' WHERE id = 'pet'").run();
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  product_type?: string;
  payment_method?: string;
  status: string;
  created_at: string;
}

export interface Product {
  id: string;
  type: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  detail_images?: string;
  created_at: string;
  updated_at: string;
}

// 문의 관련 함수
export function createInquiry(inquiry: Omit<Inquiry, 'id' | 'status' | 'created_at'>): Inquiry {
  const id = crypto.randomUUID();
  const stmt = db.prepare(`
    INSERT INTO inquiries (id, name, phone, message, product_type, payment_method)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, inquiry.name, inquiry.phone, inquiry.message, inquiry.product_type || null, inquiry.payment_method || null);
  return getInquiry(id)!;
}

export function getInquiry(id: string): Inquiry | undefined {
  return db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id) as Inquiry | undefined;
}

export function getAllInquiries(): Inquiry[] {
  return db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all() as Inquiry[];
}

export function updateInquiryStatus(id: string, status: string): boolean {
  const stmt = db.prepare('UPDATE inquiries SET status = ? WHERE id = ?');
  const result = stmt.run(status, id);
  return result.changes > 0;
}

export function deleteInquiry(id: string): boolean {
  const stmt = db.prepare('DELETE FROM inquiries WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

// 상품 관련 함수
export function getProduct(id: string): Product | undefined {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
}

export function getAllProducts(): Product[] {
  return db.prepare('SELECT * FROM products ORDER BY type').all() as Product[];
}

export function updateProduct(id: string, data: Partial<Product>): boolean {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.price !== undefined) {
    fields.push('price = ?');
    values.push(data.price);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(data.image_url);
  }
  if (data.detail_images !== undefined) {
    fields.push('detail_images = ?');
    values.push(data.detail_images);
  }

  if (fields.length === 0) return false;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`);
  const result = stmt.run(...values);
  return result.changes > 0;
}

export default db;
