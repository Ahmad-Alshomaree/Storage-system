import { sqliteTable, integer, real, text, index } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"

export const shipping = sqliteTable(
  "shipping",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type").notNull(), // "input load" or "output load"
    shipping_date: text("shipping_date").notNull(),
    receiving_date: text("receiving_date").notNull(),
    receiver_client_id: integer("receiver_client_id").references(() => client.id).notNull(),
    sender_client_id: integer("sender_client_id").references(() => client.id).notNull(),
    file_path: text("file_path"),
    paid: integer("paid").default(0),
    ship_price: real("ship_price").default(0),
    currency: text("currency").default("Dollar"),
    note: text("note"),
    created_at: text("created_at").notNull(),
  },
  (table) => ({
    typeIdx: index("idx_shipping_type").on(table.type),
  }),
)

export const shippingRelations = relations(shipping, ({ many, one }) => ({
  products: many(products),
  receiver: one(client, {
    fields: [shipping.receiver_client_id],
    references: [client.id],
  }),
  sender: one(client, {
    fields: [shipping.sender_client_id],
    references: [client.id],
  }),
}))

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    shipping_id: integer("shipping_id").references(() => shipping.id),
    item_no: text("item_no"),
    box_code: text("box_code").notNull(),
    product_name: text("product_name"),
    //product_type: text("product_type").notNull(),
    cost: real("cost").notNull(),
    selling_price: real("selling_price").notNull(),
    storage: text("storage"),
    weight: real("weight"),
    //sizes: real("sizes"),
    //colors: text("colors"),
    image: text("image"),
    pice_per_box: integer("pice_per_box"),
    Total_pices: integer("Total_pices").default(0),
    total_cost: real("total_cost").default(0),
    size_of_box: real("size_of_box").notNull(),
    total_box_size: real("total_box_size").notNull(),
    number_of_boxes: integer("number_of_boxes").notNull(),
    extracted_pieces: integer("extracted_pieces").default(0),
    status: text("status").default("available"),
    Grope_Item_price: real("Grope_Item_price"),
    currency: text("currency").notNull(),
    note: text("note"),
    created_at: text("created_at"),
    updated_at: text("updated_at"),
  },
  (table) => ({
    productNameIdx: index("idx_product_name").on(table.product_name),
    boxCodeIdx: index("idx_box_code").on(table.box_code),
    shippingIdIdx: index("idx_shipping_id").on(table.shipping_id),
  }),
)

export const productsRelations = relations(products, ({ one }) => ({
  shipping: one(shipping, {
    fields: [products.shipping_id],
    references: [shipping.id],
  }),
}))

export const client = sqliteTable(
  "client",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    client_name: text("client_name").notNull(),
    phone_number: text("phone_number"),
    shipping_id: integer("shipping_id").references(() => shipping.id),
    history: text("history"),
    //debt: real("debt").notNull().default(0),
    //total_debts: real("total_debts").notNull().default(0),
  },
  (table) => ({
    clientNameIdx: index("idx_client_name").on(table.client_name),
    shippingIdIdx: index("idx_client_shipping_id").on(table.shipping_id),
  }),
)

export const clientRelations = relations(client, ({ one, many }) => ({
  shipping: one(shipping, {
    fields: [client.shipping_id],
    references: [shipping.id],
  }),
  debits: many(debits),
}))

export const debits = sqliteTable(
  "debits",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    sender_id: integer("sender_id").references(() => client.id),
    receiver_id: integer("receiver_id").references(() => client.id),
    shipping_id: integer("shipping_id").references(() => shipping.id),
    amount: real("amount").notNull(),
    currency: text("currency").default("Dollar"),
    note: text("note"),
    transaction_date: text("transaction_date"),
    total_debit: real("total_debit"),
    created_at: text("created_at").notNull(),
  },
  (table) => ({
    senderIdIdx: index("idx_debit_sender_id").on(table.sender_id),
    receiverIdIdx: index("idx_debit_receiver_id").on(table.receiver_id),
    shippingIdIdx: index("idx_debit_shipping_id").on(table.shipping_id),
  }),
)

export const debitsRelations = relations(debits, ({ one }) => ({
  sender: one(client, {
    fields: [debits.sender_id],
    references: [client.id],
  }),
  receiver: one(client, {
    fields: [debits.receiver_id],
    references: [client.id],
  }),
  shipping: one(shipping, {
    fields: [debits.shipping_id],
    references: [shipping.id],
  }),
}))

export const rooms = sqliteTable(
  "rooms",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    room_name: text("room_name").notNull(),
  },
  (table) => ({
    roomNameIdx: index("idx_room_name").on(table.room_name),
  }),
)

export const storeProducts = sqliteTable(
  "store_products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    product_id: integer("product_id").references(() => products.id).notNull(),
    product_name: text("product_name").notNull(),
    individual_item_selling_price: real("individual_item_selling_price").notNull(),
    image: text("image"),
    group_item_price: real("group_item_price"),
    number_of_items: integer("number_of_items").notNull(),
    entered_at: text("entered_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => ({
    productIdIdx: index("idx_store_product_id").on(table.product_id),
  }),
)

export const storeProductsRelations = relations(storeProducts, ({ one }) => ({
  product: one(products, {
    fields: [storeProducts.product_id],
    references: [products.id],
  }),
}))
