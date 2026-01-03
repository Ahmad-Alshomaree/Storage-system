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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/tauri-api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Database commands - works in both development and Tauri environments
// Using dynamic imports and type assertions to avoid build-time issues
__turbopack_context__.s([
    "tauriApi",
    ()=>tauriApi
]);
const tauriApi = {
    // Check if running in Tauri environment
    isTauri: ()=>{
        return ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window.__TAURI_INTERNALS__;
    },
    // Initialize database
    initializeDatabase: async ()=>{
        console.log('tauriApi: __TAURI_INTERNALS__ present?', tauriApi.isTauri());
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Running in Tauri, calling initialize_database');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                const storagePath = localStorage.getItem('storagePath');
                return await invoke('initialize_database', {
                    storagePath
                });
            } catch (error) {
                console.error('tauriApi: Failed to initialize database in Tauri:', error);
                // Fallback to no-op in development
                return Promise.resolve();
            }
        }
        console.log('tauriApi: Running in web mode, skipping database initialization');
        // In development, just resolve
        return Promise.resolve();
    },
    // Products
    getProducts: async ()=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Fetching products via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('get_products');
            } catch (error) {
                console.error('tauriApi: Failed to fetch products via Tauri:', error);
                throw new Error('Failed to fetch products');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Fetching products via HTTP API');
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },
    createProduct: async (product)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Creating product via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('create_product', {
                    productData: product
                });
            } catch (error) {
                console.error('tauriApi: Failed to create product via Tauri:', error);
                throw new Error('Failed to create product');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Creating product via HTTP API');
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },
    deleteProduct: async (id)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Deleting product via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('delete_product', {
                    id
                });
            } catch (error) {
                console.error('tauriApi: Failed to delete product via Tauri:', error);
                throw new Error('Failed to delete product');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Deleting product via HTTP API');
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
    },
    // Clients
    getClients: async ()=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Fetching clients via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('get_clients');
            } catch (error) {
                console.error('tauriApi: Failed to fetch clients via Tauri:', error);
                throw new Error('Failed to fetch clients');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Fetching clients via HTTP API');
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        return response.json();
    },
    createClient: async (client)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Creating client via Tauri', client);
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('create_client', {
                    clientData: client
                });
            } catch (error) {
                console.error('tauriApi: Failed to create client via Tauri:', error);
                throw new Error(`Failed to create client: ${error}`);
            }
        }
        // In development, use API routes
        console.log('tauriApi: Creating client via HTTP API');
        const response = await fetch('/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });
        if (!response.ok) throw new Error('Failed to create client');
        return response.json();
    },
    deleteClient: async (id)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Deleting client via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('delete_client', {
                    id
                });
            } catch (error) {
                console.error('tauriApi: Failed to delete client via Tauri:', error);
                throw new Error('Failed to delete client');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Deleting client via HTTP API');
        const response = await fetch(`/api/clients/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete client');
    },
    // Shipping
    getShipping: async ()=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Fetching shipping via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('get_shipping');
            } catch (error) {
                console.error('tauriApi: Failed to fetch shipping via Tauri:', error);
                throw new Error('Failed to fetch shipping');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Fetching shipping via HTTP API');
        const response = await fetch('/api/shipping');
        if (!response.ok) throw new Error('Failed to fetch shipping');
        return response.json();
    },
    createShipping: async (shipping)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Creating shipping via Tauri', shipping);
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('create_shipping', {
                    shippingData: shipping
                });
            } catch (error) {
                console.error('tauriApi: Failed to create shipping via Tauri:', error);
                throw new Error(`Failed to create shipping: ${error}`);
            }
        }
        // In development, use API routes
        console.log('tauriApi: Creating shipping via HTTP API');
        const response = await fetch('/api/shipping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shipping)
        });
        if (!response.ok) throw new Error('Failed to create shipping');
        return response.json();
    },
    deleteShipping: async (id)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Deleting shipping via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('delete_shipping', {
                    id
                });
            } catch (error) {
                console.error('tauriApi: Failed to delete shipping via Tauri:', error);
                throw new Error('Failed to delete shipping');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Deleting shipping via HTTP API');
        const response = await fetch(`/api/shipping/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete shipping');
    },
    // Debits
    getDebits: async ()=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Fetching debits via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('get_debits');
            } catch (error) {
                console.error('tauriApi: Failed to fetch debits via Tauri:', error);
                throw new Error('Failed to fetch debits');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Fetching debits via HTTP API');
        const response = await fetch('/api/debits');
        if (!response.ok) throw new Error('Failed to fetch debits');
        return response.json();
    },
    deleteDebit: async (id)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Deleting debit via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('delete_debit', {
                    id
                });
            } catch (error) {
                console.error('tauriApi: Failed to delete debit via Tauri:', error);
                throw new Error('Failed to delete debit');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Deleting debit via HTTP API');
        const response = await fetch(`/api/debits/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete debit');
    },
    // Rooms
    getRooms: async ()=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Fetching rooms via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('get_rooms');
            } catch (error) {
                console.error('tauriApi: Failed to fetch rooms via Tauri:', error);
                throw new Error('Failed to fetch rooms');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Fetching rooms via HTTP API');
        const response = await fetch('/api/rooms');
        if (!response.ok) throw new Error('Failed to fetch rooms');
        return response.json();
    },
    // Store Products
    getStoreProducts: async ()=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Fetching store products via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('get_store_products');
            } catch (error) {
                console.error('tauriApi: Failed to fetch store products via Tauri:', error);
                throw new Error('Failed to fetch store products');
            }
        }
        // In development, use API routes
        console.log('tauriApi: Fetching store products via HTTP API');
        const response = await fetch('/api/store-products');
        if (!response.ok) throw new Error('Failed to fetch store products');
        return response.json();
    },
    // File upload
    uploadFile: async (filePath)=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Uploading file via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('upload_file', {
                    filePath
                });
            } catch (error) {
                console.error('tauriApi: Failed to upload file via Tauri:', error);
                throw new Error('Failed to upload file');
            }
        }
        // In development, this would use API routes, but for now just return the path
        console.log('tauriApi: File upload not supported in web mode');
        return filePath;
    },
    // Select storage directory
    selectStorageDirectory: async ()=>{
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Selecting storage directory via Tauri');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)");
                return await invoke('select_storage_directory');
            } catch (error) {
                console.error('tauriApi: Failed to select storage directory via Tauri:', error);
                throw new Error('Failed to select storage directory');
            }
        }
        // In development, just return a default path
        console.log('tauriApi: Directory selection not supported in web mode');
        return '/default/storage/path';
    }
};
}),
"[project]/app/api/shipping/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/tauri-api.ts [app-route] (ecmascript)");
;
;
async function PUT(request, { params }) {
    try {
        const updates = await request.json();
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid shipping ID'
            }, {
                status: 400
            });
        }
        // Get the existing shipping record
        const shipping = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tauriApi"].getShipping();
        const existingShipping = shipping.find((s)=>s.id === id);
        if (!existingShipping) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Shipping record not found'
            }, {
                status: 404
            });
        }
        // Merge updates with existing data
        const updatedShipping = {
            ...existingShipping,
            ...updates,
            id
        };
        // In development mode, we'll simulate the update by returning the updated shipping
        // In production (Tauri), this would call the actual database update
        console.log('Updating shipping:', id, updates);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedShipping);
    } catch (error) {
        console.error('Error updating shipping:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update shipping record'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cf1f4618._.js.map