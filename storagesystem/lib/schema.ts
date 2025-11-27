import { sqliteTable, integer, real, text, index } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"

export const shipping = sqliteTable(
  "shipping",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type").notNull(), // "input load" or "output load"
    shipping_date: text("shipping_date").notNull(),
    receiving_date: text("receiving_date").notNull(),
    receiver: text("receiver").notNull(),
    file_path: text("file_path"),
    paid: integer("paid").default(0),
    ship_price: real("ship_price").default(0),
    created_at: text("created_at").notNull(),
  },
  (table) => ({
    typeIdx: index("idx_shipping_type").on(table.type),
  }),
)

export const shippingRelations = relations(shipping, ({ many }) => ({
  products: many(products),
}))

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    shipping_id: integer("shipping_id").references(() => shipping.id),
    box_code: text("box_code").notNull(),
    product_name: text("product_name"),
    //product_type: text("product_type").notNull(),
    original_price: real("original_price").notNull(),
    total_original_price: real("total_original_price").generatedAlwaysAs(
      sql`Total_pices * original_price`
    ),
    selling_price: real("selling_price").notNull(),
    storage: text("storage"),
    weight: real("weight"),
    //sizes: real("sizes"),
    //colors: text("colors"),
    image: text("image"),
    pice_per_box: integer("pice_per_box"),
    Total_pices: integer("Total_pices").generatedAlwaysAs(
      sql`CAST(ROUND(pice_per_box * number_of_boxes) AS INTEGER)`
    ),
    size_of_box: real("size_of_box").notNull(),
    total_box_size: real("total_box_size").notNull(),
    number_of_boxes: real("number_of_boxes").notNull(),
    extracted_pieces: integer("extracted_pieces").default(0),
    status: text("status").default("available"),
    Grope_Item_price: real("Grope_Item_price"),
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
    debt: real("debt").notNull().default(0),
    total_debts: real("total_debts").notNull().default(0),
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
    client_id: integer("client_id").references(() => client.id),
    shipping_id: integer("shipping_id").references(() => shipping.id),
    amount: real("amount").notNull(),
    type: text("type").notNull(), // "debit" for amount owed, "credit" for payment received
    description: text("description"),
    transaction_date: text("transaction_date").notNull(),
    created_at: text("created_at").notNull(),
  },
  (table) => ({
    clientIdIdx: index("idx_debit_client_id").on(table.client_id),
    shippingIdIdx: index("idx_debit_shipping_id").on(table.shipping_id),
    typeIdx: index("idx_debit_type").on(table.type),
  }),
)

export const debitsRelations = relations(debits, ({ one }) => ({
  client: one(client, {
    fields: [debits.client_id],
    references: [client.id],
  }),
  shipping: one(shipping, {
    fields: [debits.shipping_id],
    references: [shipping.id],
  }),
}))
