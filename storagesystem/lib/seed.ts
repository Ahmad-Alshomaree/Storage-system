import { db } from './db';
import { shipping, products, client } from './schema';

async function seed() {
  console.log('Seeding database...');

  // Insert shipping records
  const shippingData = [
    {
      type: 'input load' as const,
      shipping_date: '2024-11-20',
      receiving_date: '2024-11-22',
      receiver: 'John Smith',
      file_path: '/uploads/shipment_001.pdf',
      created_at: new Date().toISOString(),
    },
    {
      type: 'input load' as const,
      shipping_date: '2024-11-18',
      receiving_date: '2024-11-20',
      receiver: 'Sarah Johnson',
      file_path: '/uploads/shipment_002.pdf',
      created_at: new Date().toISOString(),
    },
    {
      type: 'output load' as const,
      shipping_date: '2024-11-25',
      receiving_date: '2024-11-27',
      receiver: 'Mike Davis',
      file_path: '/uploads/delivery_001.pdf',
      created_at: new Date().toISOString(),
    },
  ];

  const insertedShipping = await db.insert(shipping).values(shippingData).returning();
  console.log('Inserted shipping records:', insertedShipping.length);

  // Insert products for each shipping record
  const productData = [
    {
      shipping_id: insertedShipping[0].id,
      box_code: 'BOX001',
      product_name: 'Wireless Headphones',
      original_price: 150.0,
      total_original_price: 2400.0,
      selling_price: 180.0,
      storage: 'Aisle 3, Shelf 2',
      weight: 0.5,
      image: '/images/headphones.jpg',
      pice_per_box: 10,
      Total_pices: 16,
      size_of_box: 2.5,
      total_box_size: 40.0,
      number_of_boxes: 16,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      shipping_id: insertedShipping[0].id,
      box_code: 'BOX002',
      product_name: 'Bluetooth Speaker',
      original_price: 80.0,
      total_original_price: 1600.0,
      selling_price: 100.0,
      storage: 'Aisle 2, Shelf 1',
      weight: 0.8,
      image: '/images/speaker.jpg',
      pice_per_box: 5,
      Total_pices: 20,
      size_of_box: 1.5,
      total_box_size: 30.0,
      number_of_boxes: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      shipping_id: insertedShipping[1].id,
      box_code: 'BOX003',
      product_name: 'Smartphone Charger',
      original_price: 25.0,
      total_original_price: 500.0,
      selling_price: 35.0,
      storage: 'Aisle 1, Shelf 3',
      weight: 0.2,
      image: '/images/charger.jpg',
      pice_per_box: 20,
      Total_pices: 20,
      size_of_box: 0.8,
      total_box_size: 16.0,
      number_of_boxes: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      shipping_id: insertedShipping[2].id,
      box_code: 'BOX004',
      product_name: 'Laptop Stand',
      original_price: 45.0,
      total_original_price: 225.0,
      selling_price: 60.0,
      storage: 'Aisle 4, Shelf 1',
      weight: 1.2,
      image: '/images/laptop_stand.jpg',
      pice_per_box: 5,
      Total_pices: 5,
      size_of_box: 3.0,
      total_box_size: 15.0,
      number_of_boxes: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const insertedProducts = await db.insert(products).values(productData).returning();
  console.log('Inserted product records:', insertedProducts.length);

  // Insert client records
  const clientData = [
    {
      client_name: 'ABC Electronics Ltd',
      phone_number: '+1-555-0100',
      shipping_id: insertedShipping[0].id,
      history: 'Regular customer for electronics components',
      debt: 500.0,
      total_debts: 2500.0,
    },
    {
      client_name: 'Tech Solutions Inc',
      phone_number: '+1-555-0200',
      shipping_id: insertedShipping[1].id,
      history: 'First-time customer, good payment history',
      debt: 0.0,
      total_debts: 1200.0,
    },
    {
      client_name: 'Global Distributors',
      phone_number: '+1-555-0300',
      shipping_id: insertedShipping[2].id,
      history: 'Wholesale buyer for retail distribution',
      debt: 1200.0,
      total_debts: 3200.0,
    },
    {
      client_name: 'Local Retail Store',
      phone_number: '+1-555-0400',
      shipping_id: null,
      history: 'Local customer, seasonal purchases',
      debt: 150.0,
      total_debts: 850.0,
    },
    {
      client_name: 'Independent Contractor',
      phone_number: '+1-555-0500',
      shipping_id: null,
      history: 'Small orders, reliable payment',
      debt: 0.0,
      total_debts: 200.0,
    },
  ];

  const insertedClients = await db.insert(client).values(clientData).returning();
  console.log('Inserted client records:', insertedClients.length);

  console.log('Seeding completed successfully!');
}

// Run the seed function
seed().catch(console.error);
