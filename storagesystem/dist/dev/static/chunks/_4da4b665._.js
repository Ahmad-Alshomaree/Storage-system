(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/tauri-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        return ("TURBOPACK compile-time value", "object") !== 'undefined' && !!window.__TAURI_INTERNALS__;
    },
    // Initialize database
    initializeDatabase: async ()=>{
        console.log('tauriApi: __TAURI_INTERNALS__ present?', tauriApi.isTauri());
        // In Tauri environment
        if (tauriApi.isTauri()) {
            try {
                console.log('tauriApi: Running in Tauri, calling initialize_database');
                // @ts-ignore
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
                const { invoke } = await __turbopack_context__.A("[project]/node_modules/@tauri-apps/api/core.js [app-client] (ecmascript, async loader)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/useAppData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAppData",
    ()=>useAppData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/tauri-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useAppData() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shipping, setShipping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [clients, setClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [debits, setDebits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [storeProducts, setStoreProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAppData.useCallback[fetchData]": async ()=>{
            console.log('useAppData: Starting data fetch');
            setIsLoading(true);
            setError(null);
            try {
                // Initialize database first
                console.log('useAppData: Initializing database');
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].initializeDatabase();
                // Fetch all data using Tauri API
                console.log('useAppData: Fetching data from APIs');
                const [productsData, shippingData, clientsData, debitsData, storeProductsData] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].getProducts(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].getShipping(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].getClients(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].getDebits(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].getStoreProducts()
                ]);
                console.log('useAppData: Data fetched successfully', {
                    products: productsData?.length || 0,
                    shipping: shippingData?.length || 0,
                    clients: clientsData?.length || 0,
                    debits: debitsData?.length || 0,
                    storeProducts: storeProductsData?.length || 0
                });
                // Process products
                setProducts(Array.isArray(productsData) ? productsData.map({
                    "useAppData.useCallback[fetchData]": (p)=>{
                        // Ensure only Product properties are included, no nested objects
                        const { shipping, ...productData } = p;
                        return productData;
                    }
                }["useAppData.useCallback[fetchData]"]) : []);
                // Process shipping - keep full objects for components that need them
                setShipping(Array.isArray(shippingData) ? shippingData : []);
                // Process clients
                setClients(Array.isArray(clientsData) ? clientsData.map({
                    "useAppData.useCallback[fetchData]": (c)=>({
                            ...c,
                            shipping: c.shipping ? {
                                ...c.shipping,
                                receiver: typeof c.shipping.receiver === 'object' && c.shipping.receiver !== null ? c.shipping.receiver.client_name || "" : c.shipping.receiver || ""
                            } : c.shipping
                        })
                }["useAppData.useCallback[fetchData]"]) : []);
                // Process debits
                setDebits(Array.isArray(debitsData) ? debitsData.map({
                    "useAppData.useCallback[fetchData]": (d)=>({
                            ...d,
                            shipping: d.shipping ? {
                                ...d.shipping,
                                receiver: typeof d.shipping.receiver === 'object' && d.shipping.receiver !== null ? d.shipping.receiver.client_name || "" : d.shipping.receiver || ""
                            } : d.shipping
                        })
                }["useAppData.useCallback[fetchData]"]) : []);
                // Process store products
                setStoreProducts(Array.isArray(storeProductsData) ? storeProductsData : []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch data");
                console.error("Error fetching data:", err);
            } finally{
                setIsLoading(false);
            }
        }
    }["useAppData.useCallback[fetchData]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAppData.useEffect": ()=>{
            fetchData();
        }
    }["useAppData.useEffect"], [
        fetchData
    ]);
    return {
        products,
        shipping,
        clients,
        debits,
        storeProducts,
        isLoading,
        error,
        refetch: fetchData
    };
}
_s(useAppData, "BrC7JZaJSDaD0sEuS2CiBN3lbsA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$setup$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/setup-page.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ProductsTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShippingTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ShippingTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ClientsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ClientsTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DebitsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DebitsTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useAppData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n.client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
function Home() {
    _s();
    const { products, shipping, clients, debits, isLoading, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppData"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("products");
    const [setupCompleted, setSetupCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    // Check if setup is completed on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const isSetupCompleted = localStorage.getItem("setupCompleted") === "true";
            console.log("Setup check - setupCompleted:", localStorage.getItem("setupCompleted"), "isSetupCompleted:", isSetupCompleted);
            // TEMPORARY: Force setup as completed for testing
            setSetupCompleted(true);
        }
    }["Home.useEffect"], []);
    const handleSetupComplete = ()=>{
        setSetupCompleted(true);
    };
    // Show loading while checking setup status
    if (setupCompleted === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground",
                    children: t("Loading...")
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 42,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this);
    }
    // Show setup page if not completed
    if (!setupCompleted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$setup$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SetupPage"], {
            onComplete: handleSetupComplete
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 50,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "container mx-auto py-8 px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-destructive text-lg mb-4",
                                    children: t("Failed to load data")
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 60,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 59,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto py-8 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-foreground text-balance",
                                children: t("Product Storage System")
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground mt-1",
                                children: t("Manage products, shipping, clients, and financial records efficiently")
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex gap-2 border-b border-border",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("products"),
                                className: `px-4 py-2 font-medium transition-colors ${activeTab === "products" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "inline w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this),
                                    t("Products")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 79,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("shipping"),
                                className: `px-4 py-2 font-medium transition-colors ${activeTab === "shipping" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                        className: "inline w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    t("Shipping")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("clients"),
                                className: `px-4 py-2 font-medium transition-colors ${activeTab === "clients" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "inline w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 109,
                                        columnNumber: 13
                                    }, this),
                                    t("Clients")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab("debits"),
                                className: `px-4 py-2 font-medium transition-colors ${activeTab === "debits" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                        className: "inline w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this),
                                    t("Debit")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    activeTab === "products" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductsTab"], {
                        products: products,
                        isLoading: isLoading,
                        refetch: refetch
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this),
                    activeTab === "shipping" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShippingTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingTab"], {
                        shipping: shipping,
                        clients: clients,
                        isLoading: isLoading,
                        refetch: refetch
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this),
                    activeTab === "clients" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ClientsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClientsTab"], {
                        clients: clients,
                        isLoading: isLoading,
                        refetch: refetch
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    activeTab === "debits" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DebitsTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DebitsTab"], {
                        debits: debits,
                        isLoading: isLoading,
                        refetch: refetch
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(Home, "SxBacGq+jYtq9bHn9ymXir9tMWQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useAppData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_4da4b665._.js.map