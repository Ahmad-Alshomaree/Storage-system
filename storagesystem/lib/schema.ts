import { sqliteTable, integer, real, text, index } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"

export const shipping = sqliteTable(
  "shipping",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type").notNull(), // "input load" or "output load"
    shipping_date: text("shipping_date").notNull(),
    receiver: text("receiver").notNull(),
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
    product_name: text("product_name").notNull(),
    product_type: text("product_type").notNull(),
    original_price: real("original_price").notNull(),
    selling_price: real("selling_price").notNull(),
    storage: text("storage").notNull(),
    quantity: integer("quantity"),
    weight: real("weight"),
    sizes: real("sizes"),
    colors: text("colors"),
    image: text("image"),
    box_number: real("box_number").notNull(),
    price_per_box: integer("price_per_box").notNull(),
    shipping_id: integer("shipping_id").references(() => shipping.id, { onDelete: "set null" }),
    total_original_price: real("total_original_price").notNull(),
    size_of_box_at_ship: real("size_of_box_at_ship").notNull(),
    total_box_size: real("total_box_size").notNull(),
    box_code: text("box_code").notNull(),
    created_at: text("created_at").notNull(),
    updated_at: text("updated_at").notNull(),
  },
  (table) => ({
    productNameIdx: index("idx_product_name").on(table.product_name),
    productTypeIdx: index("idx_product_type").on(table.product_type),
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
