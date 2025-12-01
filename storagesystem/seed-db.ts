import { db } from './lib/db.js';
import { client, shipping, products, debits, storeProducts } from './lib/schema.js';

async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');

    // Insert sample clients
    const clients = await db.insert(client).values([
      {
        client_name: 'ABC Imports Ltd',
        phone_number: '+1-555-0123',
        history: 'Regular importer of electronics'
      },
      {
        client_name: 'XYZ Exports Co',
        phone_number: '+1-555-0456',
        history: 'Major exporter of textiles'
      },
      {
        client_name: 'Global Traders Inc',
        phone_number: '+1-555-0789',
        history: 'International trading company'
      }
    ]).returning();

    console.log('Inserted clients:', clients.length);

    // Insert sample shipping records
    const shippingRecords = await db.insert(shipping).values([
      {
        type: 'input load',
        shipping_date: new Date().toISOString(),
        receiving_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days later
        receiver_client_id: clients[0].id,
        sender_client_id: clients[1].id,
        file_path: null,
        paid: 0,
        ship_price: 1500.0,
        currency: 'Dollar',
        note: 'Electronic components shipment',
        created_at: new Date().toISOString()
      },
      {
        type: 'output load',
        shipping_date: new Date().toISOString(),
        receiving_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days later
        receiver_client_id: clients[2].id,
        sender_client_id: clients[0].id,
        file_path: null,
        paid: 1,
        ship_price: 2500.0,
        currency: 'Dollar',
        note: 'Textile products export',
        created_at: new Date().toISOString()
      }
    ]).returning();

    console.log('Inserted shipping records:', shippingRecords.length);

    // Insert sample products
    const productRecords = await db.insert(products).values([
      {
        shipping_id: shippingRecords[0].id,
        box_code: 'BOX-001',
        product_name: 'Smartphone Accessories',
        original_price: 50.0,
        selling_price: 75.0,
        storage: 'A1-01',
        weight: 2.5,
        image: null,
        pice_per_box: 20,
        Total_pices: 100,
        total_original_price: 5000.0,
        size_of_box: 25.0,
        total_box_size: 625.0,
        number_of_boxes: 5,
        extracted_pieces: 0,
        status: 'available',
        Grope_Item_price: 70.0,
        currency: 'Dollar',
        note: 'High quality accessories',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        shipping_id: shippingRecords[1].id,
        box_code: 'BOX-002',
        product_name: 'Cotton T-Shirts',
        original_price: 10.0,
        selling_price: 18.0,
        storage: 'B2-03',
        weight: 4.0,
        image: null,
        pice_per_box: 50,
        Total_pices: 500,
        total_original_price: 5000.0,
        size_of_box: 30.0,
        total_box_size: 900.0,
        number_of_boxes: 10,
        extracted_pieces: 0,
        status: 'available',
        Grope_Item_price: 15.0,
        currency: 'Dollar',
        note: 'Various sizes and colors',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]).returning();

    console.log('Inserted products:', productRecords.length);

    // Insert sample debits
    const debitRecords = await db.insert(debits).values([
      {
        sender_id: clients[1].id,
        receiver_id: clients[0].id,
        shipping_id: shippingRecords[0].id,
        amount: 1200.0,
        currency: 'Dollar',
        note: 'Payment for shipping services',
        transaction_date: new Date().toISOString(),
        total_debit: 1200.0,
        created_at: new Date().toISOString()
      },
      {
        sender_id: clients[0].id,
        receiver_id: clients[2].id,
        shipping_id: shippingRecords[1].id,
        amount: 2500.0,
        currency: 'Dollar',
        note: 'Debt settlement',
        transaction_date: new Date().toISOString(),
        total_debit: 2500.0,
        created_at: new Date().toISOString()
      }
    ]).returning();

    console.log('Inserted debits:', debitRecords.length);

    // Insert sample store products
    const storeProductRecords = await db.insert(storeProducts).values([
      {
        product_id: productRecords[0].id,
        product_name: 'Phone Case - Black',
        individual_item_selling_price: 15.0,
        image: null,
        group_item_price: 12.0,
        number_of_items: 20,
        entered_at: new Date().toISOString()
      },
      {
        product_id: productRecords[1].id,
        product_name: 'T-Shirt - Large',
        individual_item_selling_price: 20.0,
        image: null,
        group_item_price: 18.0,
        number_of_items: 50,
        entered_at: new Date().toISOString()
      }
    ]).returning();

    console.log('Inserted store products:', storeProductRecords.length);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase();
