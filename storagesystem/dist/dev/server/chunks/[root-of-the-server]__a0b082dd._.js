module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/lib/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "client",
    ()=>client,
    "clientRelations",
    ()=>clientRelations,
    "debits",
    ()=>debits,
    "debitsRelations",
    ()=>debitsRelations,
    "products",
    ()=>products,
    "productsRelations",
    ()=>productsRelations,
    "rooms",
    ()=>rooms,
    "shipping",
    ()=>shipping,
    "shippingRelations",
    ()=>shippingRelations,
    "storeProducts",
    ()=>storeProducts,
    "storeProductsRelations",
    ()=>storeProductsRelations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/sqlite-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/sqlite-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/sqlite-core/columns/real.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/sqlite-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/sqlite-core/indexes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/relations.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
;
;
const shipping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])("shipping", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("id").primaryKey({
        autoIncrement: true
    }),
    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("type").notNull(),
    shipping_date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("shipping_date").notNull(),
    receiving_date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("receiving_date").notNull(),
    receiver_client_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("receiver_client_id").references(()=>client.id).notNull(),
    sender_client_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("sender_client_id").references(()=>client.id).notNull(),
    file_path: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("file_path"),
    paid: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("paid").default(0),
    ship_price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("ship_price").default(0),
    currency: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("currency").default("Dollar"),
    note: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("note"),
    created_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("created_at").notNull()
}, (table)=>({
        typeIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_shipping_type").on(table.type)
    }));
const shippingRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(shipping, ({ many, one })=>({
        products: many(products),
        receiver: one(client, {
            fields: [
                shipping.receiver_client_id
            ],
            references: [
                client.id
            ]
        }),
        sender: one(client, {
            fields: [
                shipping.sender_client_id
            ],
            references: [
                client.id
            ]
        })
    }));
const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])("products", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("id").primaryKey({
        autoIncrement: true
    }),
    shipping_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("shipping_id").references(()=>shipping.id),
    item_no: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("item_no"),
    box_code: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("box_code").notNull(),
    product_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("product_name"),
    //product_type: text("product_type").notNull(),
    cost: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("cost").notNull(),
    selling_price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("selling_price").notNull(),
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("storage"),
    weight: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("weight"),
    //sizes: real("sizes"),
    //colors: text("colors"),
    image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("image"),
    pice_per_box: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("pice_per_box"),
    Total_pices: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("Total_pices").default(0),
    total_cost: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("total_cost").default(0),
    size_of_box: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("size_of_box").notNull(),
    total_box_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("total_box_size").notNull(),
    number_of_boxes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("number_of_boxes").notNull(),
    extracted_pieces: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("extracted_pieces").default(0),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").default("available"),
    Grope_Item_price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("Grope_Item_price"),
    currency: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("currency").notNull(),
    note: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("note"),
    created_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("created_at"),
    updated_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("updated_at")
}, (table)=>({
        productNameIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_product_name").on(table.product_name),
        boxCodeIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_box_code").on(table.box_code),
        shippingIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_shipping_id").on(table.shipping_id)
    }));
const productsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(products, ({ one })=>({
        shipping: one(shipping, {
            fields: [
                products.shipping_id
            ],
            references: [
                shipping.id
            ]
        })
    }));
const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])("client", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("id").primaryKey({
        autoIncrement: true
    }),
    client_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("client_name").notNull(),
    phone_number: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("phone_number"),
    shipping_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("shipping_id").references(()=>shipping.id),
    history: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("history")
}, (table)=>({
        clientNameIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_client_name").on(table.client_name),
        shippingIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_client_shipping_id").on(table.shipping_id)
    }));
const clientRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(client, ({ one, many })=>({
        shipping: one(shipping, {
            fields: [
                client.shipping_id
            ],
            references: [
                shipping.id
            ]
        }),
        debits: many(debits)
    }));
const debits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])("debits", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("id").primaryKey({
        autoIncrement: true
    }),
    sender_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("sender_id").references(()=>client.id),
    receiver_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("receiver_id").references(()=>client.id),
    shipping_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("shipping_id").references(()=>shipping.id),
    amount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("amount").notNull(),
    currency: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("currency").default("Dollar"),
    note: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("note"),
    transaction_date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("transaction_date"),
    total_debit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("total_debit"),
    created_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("created_at").notNull()
}, (table)=>({
        senderIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_debit_sender_id").on(table.sender_id),
        receiverIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_debit_receiver_id").on(table.receiver_id),
        shippingIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_debit_shipping_id").on(table.shipping_id)
    }));
const debitsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(debits, ({ one })=>({
        sender: one(client, {
            fields: [
                debits.sender_id
            ],
            references: [
                client.id
            ]
        }),
        receiver: one(client, {
            fields: [
                debits.receiver_id
            ],
            references: [
                client.id
            ]
        }),
        shipping: one(shipping, {
            fields: [
                debits.shipping_id
            ],
            references: [
                shipping.id
            ]
        })
    }));
const rooms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])("rooms", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("id").primaryKey({
        autoIncrement: true
    }),
    room_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("room_name").notNull()
}, (table)=>({
        roomNameIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_room_name").on(table.room_name)
    }));
const storeProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sqliteTable"])("store_products", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("id").primaryKey({
        autoIncrement: true
    }),
    product_id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("product_id").references(()=>products.id).notNull(),
    product_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("product_name").notNull(),
    individual_item_selling_price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("individual_item_selling_price").notNull(),
    image: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("image"),
    group_item_price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["real"])("group_item_price"),
    number_of_items: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("number_of_items").notNull(),
    entered_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("entered_at").notNull().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`(datetime('now'))`)
}, (table)=>({
        productIdIdx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sqlite$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("idx_store_product_id").on(table.product_id)
    }));
const storeProductsRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["relations"])(storeProducts, ({ one })=>({
        product: one(products, {
            fields: [
                storeProducts.product_id
            ],
            references: [
                products.id
            ]
        })
    }));
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$better$2d$sqlite3$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/better-sqlite3/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.ts [app-route] (ecmascript)");
;
;
;
;
;
const dbDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dbDir)) {
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(dbDir, {
        recursive: true
    });
}
const dbPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dbDir, "products.db");
const sqlite = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](dbPath);
// Enable foreign keys and WAL mode
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$better$2d$sqlite3$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(sqlite, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
});
}),
"[project]/app/api/store-products/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/drizzle-orm@0.44.7_@types+better-sqlite3@7.6.13_better-sqlite3@11.10.0/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        const allStoreProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].query.storeProducts.findMany({
            with: {
                product: true
            },
            orderBy: (storeProducts, { desc })=>desc(storeProducts.entered_at)
        });
        return Response.json(allStoreProducts);
    } catch (error) {
        console.error("Error fetching store products:", error);
        return Response.json({
            error: "Failed to fetch store products"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { product_id, product_name, individual_item_selling_price, image, group_item_price, number_of_items } = body;
        if (!product_id || !product_name || !individual_item_selling_price || !number_of_items) {
            return Response.json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeProducts"]).values({
            product_id,
            product_name,
            individual_item_selling_price,
            image: image || null,
            group_item_price: group_item_price || null,
            number_of_items
        }).returning();
        return Response.json(result[0], {
            status: 201
        });
    } catch (error) {
        console.error("Error creating store product record:", error);
        return Response.json({
            error: "Failed to create store product record"
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { id, number_of_items } = body;
        if (!id || number_of_items === undefined) {
            return Response.json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeProducts"]).set({
            number_of_items
        }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$drizzle$2d$orm$40$0$2e$44$2e$7_$40$types$2b$better$2d$sqlite3$40$7$2e$6$2e$13_better$2d$sqlite3$40$11$2e$10$2e$0$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeProducts"].id, id)).returning();
        if (result.length === 0) {
            return Response.json({
                error: "Store product not found"
            }, {
                status: 404
            });
        }
        return Response.json(result[0]);
    } catch (error) {
        console.error("Error updating store product:", error);
        return Response.json({
            error: "Failed to update store product"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a0b082dd._.js.map