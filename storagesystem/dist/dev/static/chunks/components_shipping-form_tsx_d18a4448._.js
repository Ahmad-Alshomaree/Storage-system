(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/shipping-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShippingForm",
    ()=>ShippingForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/tauri-api.ts [app-client] (ecmascript)");
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
function ShippingForm({ onSuccess }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        type: "input load",
        shipping_date: "",
        receiving_date: "",
        receiver: "",
        sender: "",
        paid: 0,
        ship_price: 0,
        currency: "Dollar",
        note: "",
        shipToStore: false
    });
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [availableProducts, setAvailableProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedProductIds, setSelectedProductIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingProducts, setIsLoadingProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newProducts, setNewProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nextProductId, setNextProductId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [existingClients, setExistingClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingClients, setIsLoadingClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showNewClientForm, setShowNewClientForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newClientData, setNewClientData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        client_name: "",
        phone_number: "",
        history: ""
    });
    const [isLoadingNewClient, setIsLoadingNewClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [targetField, setTargetField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('receiver');
    const [currentShippingId, setCurrentShippingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [savingProductId, setSavingProductId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedOutputProducts, setSelectedOutputProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [productDialogOpen, setProductDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentProductSelection, setCurrentProductSelection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newlyAddedClients, setNewlyAddedClients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShippingForm.useEffect": ()=>{
            const fetchClients = {
                "ShippingForm.useEffect.fetchClients": async ()=>{
                    try {
                        const clients = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].getClients();
                        setExistingClients(clients);
                    } catch (error) {
                        console.error("Failed to fetch clients:", error);
                    } finally{
                        setIsLoadingClients(false);
                    }
                }
            }["ShippingForm.useEffect.fetchClients"];
            fetchClients();
        }
    }["ShippingForm.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShippingForm.useEffect": ()=>{
            if (formData.type === 'output load') {
                setIsLoadingProducts(true);
                const fetchProducts = {
                    "ShippingForm.useEffect.fetchProducts": async ()=>{
                        try {
                            const response = await fetch("/api/products");
                            if (response.ok) {
                                const products = await response.json();
                                // Filter products that have status 'available' (can be assigned to output shipping)
                                const availableProducts = products.filter({
                                    "ShippingForm.useEffect.fetchProducts.availableProducts": (product)=>product.status === 'available'
                                }["ShippingForm.useEffect.fetchProducts.availableProducts"]);
                                setAvailableProducts(availableProducts);
                            }
                        } catch (error) {
                            console.error("Failed to fetch products:", error);
                        } finally{
                            setIsLoadingProducts(false);
                        }
                    }
                }["ShippingForm.useEffect.fetchProducts"];
                fetchProducts();
            }
        }
    }["ShippingForm.useEffect"], [
        formData.type
    ]);
    const handleProductSelection = (productId, isSelected)=>{
        setSelectedProductIds((prev)=>isSelected ? [
                ...prev,
                productId
            ] : prev.filter((id)=>id !== productId));
    };
    const openProductSelectionDialog = (product)=>{
        const existingSelection = selectedOutputProducts.find((s)=>s.productId === product.id);
        setCurrentProductSelection(existingSelection || {
            productId: product.id,
            quantityType: 'pieces',
            quantity: 1,
            sellingPrice: product.selling_price,
            product: product
        });
        setProductDialogOpen(true);
    };
    const saveProductSelection = ()=>{
        if (!currentProductSelection) return;
        const existingIndex = selectedOutputProducts.findIndex((s)=>s.productId === currentProductSelection.productId);
        if (existingIndex >= 0) {
            setSelectedOutputProducts((prev)=>prev.map((s, i)=>i === existingIndex ? currentProductSelection : s));
        } else {
            setSelectedOutputProducts((prev)=>[
                    ...prev,
                    currentProductSelection
                ]);
        }
        // Also update selectedProductIds for backward compatibility with the form submission
        if (!selectedProductIds.includes(currentProductSelection.productId)) {
            setSelectedProductIds((prev)=>[
                    ...prev,
                    currentProductSelection.productId
                ]);
        }
        setProductDialogOpen(false);
        setCurrentProductSelection(null);
    };
    const closeProductSelectionDialog = ()=>{
        setProductDialogOpen(false);
        setCurrentProductSelection(null);
    };
    const removeProductSelection = (productId)=>{
        setSelectedOutputProducts((prev)=>prev.filter((s)=>s.productId !== productId));
        setSelectedProductIds((prev)=>prev.filter((id)=>id !== productId));
    };
    const handleChange = (e)=>{
        const { name, value, type } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) || 0 : value
            }));
    };
    const handleDateChange = (e)=>{
        handleChange(e);
        // Force close date picker immediately after selection
        setTimeout(()=>e.target.blur(), 0);
    };
    // Close date picker when clicking outside
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "ShippingForm.useEffect": ()=>{
            const handleClickOutside = {
                "ShippingForm.useEffect.handleClickOutside": (event)=>{
                    const target = event.target;
                    // If clicking outside any input, blur all date inputs to close pickers
                    if (!target.closest('input[type="date"]')) {
                        const dateInputs = document.querySelectorAll('input[type="date"]');
                        dateInputs.forEach({
                            "ShippingForm.useEffect.handleClickOutside": (input)=>input.blur()
                        }["ShippingForm.useEffect.handleClickOutside"]);
                    }
                }
            }["ShippingForm.useEffect.handleClickOutside"];
            document.addEventListener('click', handleClickOutside);
            return ({
                "ShippingForm.useEffect": ()=>document.removeEventListener('click', handleClickOutside)
            })["ShippingForm.useEffect"];
        }
    }["ShippingForm.useEffect"], []);
    const handleClientSelectChange = (field, value)=>{
        if (value === 'add-new-client') {
            setTargetField(field);
            setShowNewClientForm(true);
            setFormData((prev)=>({
                    ...prev,
                    [field]: ''
                }));
        } else {
            setShowNewClientForm(false);
            setFormData((prev)=>({
                    ...prev,
                    [field]: value
                }));
        }
    };
    const addNewProduct = ()=>{
        const newProduct = {
            id: `temp-${nextProductId}`,
            product_name: "",
            product_type: "",
            box_code: "",
            original_price: 0,
            selling_price: 0,
            storage: "",
            number_of_boxes: 1,
            size_of_box: 0,
            total_box_size: 0,
            weight: 0,
            pice_per_box: 1,
            grope_item_price: 0,
            image: "",
            Total_pices: 1,
            total_original_price: 0,
            currency: "Dollar",
            note: ""
        };
        setNewProducts((prev)=>[
                ...prev,
                newProduct
            ]);
        setNextProductId((prev)=>prev + 1);
    };
    const removeNewProduct = (id)=>{
        setNewProducts((prev)=>prev.filter((p)=>p.id !== id));
    };
    const ensureShippingRecord = async ()=>{
        // If shipping record already exists, return it
        if (currentShippingId) {
            return currentShippingId;
        }
        // Validate that required fields are filled
        if (!formData.shipping_date || !formData.receiving_date || !formData.receiver || !formData.sender) {
            throw new Error(t("Please fill in all required shipping information (dates, receiver, sender)"));
        }
        // Find client IDs
        const receiverClient = existingClients.find((client)=>client.client_name === formData.receiver);
        const senderClient = existingClients.find((client)=>client.client_name === formData.sender);
        if (!receiverClient || !senderClient) {
            throw new Error(t("Please select a receiver"));
        }
        // Create shipping record
        const shippingData = {
            type: formData.type,
            shipping_date: formData.shipping_date,
            receiving_date: formData.receiving_date,
            receiver_client_id: receiverClient.id,
            sender_client_id: senderClient.id,
            paid: formData.paid || 0,
            ship_price: formData.ship_price || 0,
            currency: formData.currency,
            note: formData.note || null
        };
        const newShipping = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].createShipping(shippingData);
        setCurrentShippingId(newShipping.id);
        return newShipping.id;
    };
    const saveIndividualProduct = async (product)=>{
        setSavingProductId(product.id);
        try {
            // Ensure shipping record exists
            const shippingId = await ensureShippingRecord();
            // Prepare product data
            const productData = {
                product_name: product.product_name,
                box_code: product.box_code,
                original_price: product.original_price,
                selling_price: product.selling_price,
                storage: product.storage,
                number_of_boxes: product.number_of_boxes,
                size_of_box: product.size_of_box,
                total_box_size: product.total_box_size,
                weight: product.weight,
                pice_per_box: product.pice_per_box,
                grope_item_price: product.grope_item_price,
                image: product.image || null,
                Total_pices: product.Total_pices,
                total_original_price: product.total_original_price,
                currency: product.currency,
                note: product.note || null,
                shipping_id: shippingId
            };
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                throw new Error(t("Failed to save product"));
            }
            const savedProduct = await response.json();
            // Update the product in the list to mark it as saved
            setNewProducts((prev)=>prev.map((p)=>p.id === product.id ? {
                        ...p,
                        isSaved: true,
                        savedProductId: savedProduct.id
                    } : p));
        } catch (err) {
            setError(err instanceof Error ? err.message : t("Failed to save product"));
        } finally{
            setSavingProductId(null);
        }
    };
    const updateNewProduct = (id, field, value)=>{
        setNewProducts((prev)=>prev.map((p)=>{
                if (p.id === id) {
                    const updated = {
                        ...p,
                        [field]: value
                    };
                    // Recalculate derived fields
                    if (field === 'number_of_boxes' || field === 'pice_per_box' || field === 'original_price' || field === 'size_of_box') {
                        updated.Total_pices = updated.number_of_boxes * updated.pice_per_box;
                        updated.total_original_price = updated.original_price * updated.number_of_boxes;
                        updated.total_box_size = updated.size_of_box * updated.number_of_boxes;
                    }
                    return updated;
                }
                return p;
            }));
    };
    const handleNewClientSubmit = async ()=>{
        if (!newClientData.client_name.trim()) {
            return;
        }
        setIsLoadingNewClient(true);
        try {
            const clientData = {
                client_name: newClientData.client_name,
                phone_number: newClientData.phone_number || null,
                shipping_id: null,
                history: newClientData.history || null,
                debt: 0,
                total_debts: 0
            };
            const newClient = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].createClient(clientData);
            // Track newly added clients to prevent automatic linking to shipping
            setNewlyAddedClients((prev)=>new Set(prev).add(newClient.id));
            // Update clients list
            setExistingClients((prev)=>[
                    ...prev,
                    newClient
                ]);
            // Set the target field
            setFormData((prev)=>({
                    ...prev,
                    [targetField]: newClient.client_name
                }));
            // Hide form and reset
            setShowNewClientForm(false);
            setNewClientData({
                client_name: "",
                phone_number: "",
                history: ""
            });
        } catch (err) {
            console.error("Failed to add new client:", err);
        // Optionally set an error state here
        } finally{
            setIsLoadingNewClient(false);
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            // Validate required shipping information
            if (!formData.shipping_date || !formData.receiving_date || !formData.receiver || !formData.sender) {
                setError(t("Please fill in all required shipping information (dates, receiver, sender)"));
                setIsLoading(false);
                return;
            }
            // Find client IDs by name
            const receiverClient = existingClients.find((client)=>client.client_name === formData.receiver);
            const senderClient = existingClients.find((client)=>client.client_name === formData.sender);
            if (!receiverClient || !senderClient) {
                setError(t("Please select a receiver"));
                setIsLoading(false);
                return;
            }
            const shippingData = {
                type: formData.type,
                shipping_date: formData.shipping_date,
                receiving_date: formData.receiving_date,
                receiver_client_id: receiverClient.id,
                sender_client_id: senderClient.id,
                paid: formData.paid || 0,
                ship_price: formData.ship_price || 0,
                currency: formData.currency,
                note: formData.note || null
            };
            const newShipping = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$tauri$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tauriApi"].createShipping(shippingData);
            // Handle client assignment - only link existing clients, not newly added ones
            if (formData.receiver) {
                const existingClient = existingClients.find((client)=>client.client_name === formData.receiver);
                if (existingClient && !newlyAddedClients.has(existingClient.id)) {
                    await fetch(`/api/clients/${existingClient.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            shipping_id: newShipping.id
                        })
                    });
                }
            }
            // Store the shipping ID for future use (products can be saved separately)
            setCurrentShippingId(newShipping.id);
            // Notify success - shipping information saved
            onSuccess(newShipping);
            // Clear newly added clients tracking for next form submission
            setNewlyAddedClients(new Set());
            // Show success message but keep form data for potential order saving
            setError(""); // Clear any errors
        } catch (err) {
            setError(err instanceof Error ? err.message : t("An error occurred"));
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "bg-card border border-border rounded-lg p-6 space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-lg font-semibold text-foreground",
                children: t("Add Shipping Record")
            }, void 0, false, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 501,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 bg-destructive/10 text-destructive text-sm rounded-lg",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 503,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: [
                                    t("Shipping Type"),
                                    " *"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 507,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                name: "type",
                                value: formData.type,
                                onChange: handleChange,
                                required: true,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "input load",
                                        children: t("Input Load")
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 515,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "output load",
                                        children: t("Output Load")
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 516,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 508,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 506,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: [
                                    t("Shipping Date"),
                                    " *"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 521,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                name: "shipping_date",
                                value: formData.shipping_date,
                                onChange: handleDateChange,
                                required: true,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 522,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 520,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: [
                                    t("Receiving Date"),
                                    " *"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 533,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                name: "receiving_date",
                                value: formData.receiving_date,
                                onChange: handleDateChange,
                                required: true,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 534,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 532,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: [
                                    t("Receiver"),
                                    " *"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: formData.receiver,
                                onChange: (e)=>handleClientSelectChange('receiver', e.target.value),
                                required: true,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: t("Select Receiver")
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 552,
                                        columnNumber: 13
                                    }, this),
                                    !isLoadingClients && existingClients.map((client)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: client.client_name,
                                            children: [
                                                client.client_name,
                                                " ",
                                                client.phone_number ? `(${client.phone_number})` : ''
                                            ]
                                        }, client.id, true, {
                                            fileName: "[project]/components/shipping-form.tsx",
                                            lineNumber: 554,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "add-new-client",
                                        className: "font-medium text-primary",
                                        children: [
                                            "+ ",
                                            t("Add New Client")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 558,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 546,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 544,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: [
                                    t("Sender"),
                                    " *"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 563,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: formData.sender,
                                onChange: (e)=>handleClientSelectChange('sender', e.target.value),
                                required: true,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: t("Select Sender")
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 570,
                                        columnNumber: 13
                                    }, this),
                                    !isLoadingClients && existingClients.map((client)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: client.client_name,
                                            children: [
                                                client.client_name,
                                                " ",
                                                client.phone_number ? `(${client.phone_number})` : ''
                                            ]
                                        }, client.id, true, {
                                            fileName: "[project]/components/shipping-form.tsx",
                                            lineNumber: 572,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "add-new-client",
                                        className: "font-medium text-primary",
                                        children: [
                                            "+ ",
                                            t("Add New Client")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 576,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 564,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 562,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: [
                                    t("Currency"),
                                    " *"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 581,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                name: "currency",
                                value: formData.currency,
                                onChange: handleChange,
                                required: true,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Dollar",
                                        children: t("Dollar")
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 589,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "Iraqi Dinar",
                                        children: t("Iraqi Dinar")
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 590,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 582,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 580,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: t("Ship Price")
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 595,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                name: "ship_price",
                                value: formData.ship_price || '',
                                onChange: handleChange,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 596,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 594,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: t("Paid")
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 607,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                step: "0.01",
                                name: "paid",
                                value: formData.paid || '',
                                onChange: handleChange,
                                className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 608,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 606,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 505,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-foreground mb-2",
                        children: t("Note")
                    }, void 0, false, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 620,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        name: "note",
                        value: formData.note,
                        onChange: handleChange,
                        rows: 2,
                        placeholder: t("Notes"),
                        className: "w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    }, void 0, false, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 621,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 619,
                columnNumber: 7
            }, this),
            showNewClientForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border border-border rounded-lg p-4 bg-muted/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-foreground",
                                children: t("Add New Client")
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 635,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowNewClientForm(false),
                                className: "text-destructive hover:text-destructive/80",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/shipping-form.tsx",
                                    lineNumber: 641,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 636,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 634,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: t("Client Name") + " *",
                                value: newClientData.client_name,
                                onChange: (e)=>setNewClientData((prev)=>({
                                            ...prev,
                                            client_name: e.target.value
                                        })),
                                className: "px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 646,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: t("Phone Number"),
                                value: newClientData.phone_number,
                                onChange: (e)=>setNewClientData((prev)=>({
                                            ...prev,
                                            phone_number: e.target.value
                                        })),
                                className: "px-3 py-2 border border-input rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 654,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    placeholder: t("History") + "/" + t("Notes"),
                                    value: newClientData.history,
                                    onChange: (e)=>setNewClientData((prev)=>({
                                                ...prev,
                                                history: e.target.value
                                            })),
                                    rows: 2,
                                    className: "w-full px-3 py-2 border border-input rounded bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                }, void 0, false, {
                                    fileName: "[project]/components/shipping-form.tsx",
                                    lineNumber: 662,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 661,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 645,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 pt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            onClick: handleNewClientSubmit,
                            disabled: isLoadingNewClient,
                            size: "sm",
                            children: [
                                isLoadingNewClient ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "w-4 h-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/shipping-form.tsx",
                                    lineNumber: 674,
                                    columnNumber: 37
                                }, this) : null,
                                t("Save Client")
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shipping-form.tsx",
                            lineNumber: 673,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 672,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 633,
                columnNumber: 9
            }, this),
            formData.type === 'input load' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: t("Add New Products")
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 685,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                onClick: addNewProduct,
                                variant: "outline",
                                size: "sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "w-4 h-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 687,
                                        columnNumber: 15
                                    }, this),
                                    t("Add Product")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 686,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 684,
                        columnNumber: 11
                    }, this),
                    newProducts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 text-center text-muted-foreground border border-dashed border-border rounded-lg",
                        children: t("No products added. Click \"Add Product\" to create new products for this shipment.")
                    }, void 0, false, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 693,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: newProducts.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-border rounded-lg p-4 bg-muted/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-medium text-foreground",
                                                children: [
                                                    t("Products"),
                                                    " ",
                                                    product.id.split('-')[1]
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 701,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>removeNewProduct(product.id),
                                                className: "text-destructive hover:text-destructive/80",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 707,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 702,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 700,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Product Name"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 713,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: t("Product Name") + " *",
                                                        value: product.product_name,
                                                        onChange: (e)=>updateNewProduct(product.id, 'product_name', e.target.value),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 714,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 712,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Product Type")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: t("Product Type"),
                                                        value: product.product_type,
                                                        onChange: (e)=>updateNewProduct(product.id, 'product_type', e.target.value),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 723,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Box Code"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 734,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: t("Box Code") + " *",
                                                        value: product.box_code,
                                                        onChange: (e)=>updateNewProduct(product.id, 'box_code', e.target.value),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 735,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 733,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Original Price"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 745,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: t("Original Price") + " *",
                                                        value: product.original_price || '',
                                                        onChange: (e)=>updateNewProduct(product.id, 'original_price', parseFloat(e.target.value) || 0),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 746,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 744,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Selling Price"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 757,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: t("Selling Price") + " *",
                                                        value: product.selling_price || '',
                                                        onChange: (e)=>updateNewProduct(product.id, 'selling_price', parseFloat(e.target.value) || 0),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 758,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 756,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Storage Location")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 769,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: t("Storage Location"),
                                                        value: product.storage,
                                                        onChange: (e)=>updateNewProduct(product.id, 'storage', e.target.value),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 770,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 768,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Number of boxes"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 779,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        placeholder: t("Number of boxes") + " *",
                                                        value: product.number_of_boxes || '',
                                                        onChange: (e)=>updateNewProduct(product.id, 'number_of_boxes', parseInt(e.target.value) || 1),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true,
                                                        min: "1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 780,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 778,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Pieces per box"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 791,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        placeholder: t("Pieces per box") + " *",
                                                        value: product.pice_per_box || '',
                                                        onChange: (e)=>updateNewProduct(product.id, 'pice_per_box', parseInt(e.target.value) || 1),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true,
                                                        min: "1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 792,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 790,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Size of Box"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: t("Size of Box") + " *",
                                                        value: product.size_of_box || '',
                                                        onChange: (e)=>updateNewProduct(product.id, 'size_of_box', parseFloat(e.target.value) || 0),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 804,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 802,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Or enter Image URL")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 815,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: t("Or enter Image URL"),
                                                        value: product.image,
                                                        onChange: (e)=>updateNewProduct(product.id, 'image', e.target.value),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 816,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 814,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Weight")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 825,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: t("Weight"),
                                                        value: product.weight || '',
                                                        onChange: (e)=>updateNewProduct(product.id, 'weight', parseFloat(e.target.value) || 0),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 826,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 824,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Group Item Price")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 836,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: t("Group Item Price"),
                                                        value: product.grope_item_price || '',
                                                        onChange: (e)=>updateNewProduct(product.id, 'grope_item_price', parseFloat(e.target.value) || 0),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 837,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 835,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: [
                                                            t("Currency"),
                                                            " *"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 847,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: product.currency,
                                                        onChange: (e)=>updateNewProduct(product.id, 'currency', e.target.value),
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full",
                                                        required: true,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Dollar",
                                                                children: t("Dollar")
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shipping-form.tsx",
                                                                lineNumber: 854,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "Iraqi Dinar",
                                                                children: t("Iraqi Dinar")
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shipping-form.tsx",
                                                                lineNumber: 855,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 848,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 846,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Total Pieces")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 859,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        placeholder: t("Total Pieces"),
                                                        value: product.Total_pices || '',
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs w-full",
                                                        readOnly: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 860,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 858,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Total Original Price")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 869,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: t("Total Original Price"),
                                                        value: product.total_original_price || '',
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs w-full",
                                                        readOnly: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 868,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Total Box Size")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 880,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        placeholder: t("Total Box Size"),
                                                        value: product.total_box_size || '',
                                                        className: "px-3 py-2 border border-input rounded bg-background text-foreground text-xs w-full",
                                                        readOnly: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 879,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2 lg:col-span-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-foreground mb-1",
                                                        children: t("Note")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 891,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        placeholder: t("Enter note..."),
                                                        value: product.note,
                                                        onChange: (e)=>updateNewProduct(product.id, 'note', e.target.value),
                                                        rows: 2,
                                                        className: "w-full px-3 py-2 border border-input rounded bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 892,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 890,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 711,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between pt-2 border-t border-border",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `text-xs ${product.isSaved ? 'text-green-600' : 'text-muted-foreground'}`,
                                                children: product.isSaved ? `✓ Saved to products table (ID: ${product.savedProductId})` : 'Not saved yet'
                                            }, void 0, false, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 904,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                onClick: ()=>saveIndividualProduct(product),
                                                disabled: product.isSaved || savingProductId === product.id,
                                                variant: "outline",
                                                size: "sm",
                                                className: `gap-1 ${product.isSaved ? 'bg-green-50 border-green-200 hover:bg-green-100' : ''}`,
                                                children: savingProductId === product.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                            className: "w-3 h-3 animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shipping-form.tsx",
                                                            lineNumber: 917,
                                                            columnNumber: 27
                                                        }, this),
                                                        "Saving..."
                                                    ]
                                                }, void 0, true) : product.isSaved ? t('Saved') + ' ✓' : t('Save Product')
                                            }, void 0, false, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 907,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 903,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, product.id, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 699,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 697,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 683,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-2",
                                children: t("Select products for shipment")
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 935,
                                columnNumber: 13
                            }, this),
                            isLoadingProducts ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 text-center text-muted-foreground",
                                children: "Loading products..."
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 937,
                                columnNumber: 15
                            }, this) : availableProducts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 text-center text-muted-foreground border border-dashed border-border rounded-lg",
                                children: "No available products to select for output load"
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 939,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                children: availableProducts.map((product)=>{
                                    const selection = selectedOutputProducts.find((s)=>s.productId === product.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border border-border rounded-lg p-4 bg-muted/30",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-medium text-foreground",
                                                                children: product.box_code
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shipping-form.tsx",
                                                                lineNumber: 950,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: product.product_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shipping-form.tsx",
                                                                lineNumber: 951,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: [
                                                                    product.number_of_boxes,
                                                                    " ",
                                                                    t("Number of boxes"),
                                                                    " • ",
                                                                    product.Total_pices,
                                                                    " ",
                                                                    t("Total Pieces")
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shipping-form.tsx",
                                                                lineNumber: 952,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 949,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>openProductSelectionDialog(product),
                                                        className: "text-primary hover:text-primary/80",
                                                        children: selection ? t('Edit') : t('Select')
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 956,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 948,
                                                columnNumber: 23
                                            }, this),
                                            selection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-muted-foreground bg-muted p-2 rounded",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Quantity: ",
                                                            selection.quantity,
                                                            " ",
                                                            selection.quantityType
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 967,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            "Selling Price: $",
                                                            selection.sellingPrice
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 968,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 966,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, product.id, true, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 947,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 943,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 934,
                        columnNumber: 11
                    }, this),
                    selectedOutputProducts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t pt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-foreground mb-3",
                                children: [
                                    t("Selected Products"),
                                    " (",
                                    selectedOutputProducts.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 981,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: selectedOutputProducts.map((selection)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between bg-muted p-3 rounded",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-sm",
                                                        children: [
                                                            selection.product?.box_code,
                                                            " - ",
                                                            selection.product?.product_name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 986,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-muted-foreground ml-2",
                                                        children: [
                                                            selection.quantity,
                                                            " ",
                                                            selection.quantityType,
                                                            " @ $",
                                                            selection.sellingPrice
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shipping-form.tsx",
                                                        lineNumber: 987,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 985,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>removeProductSelection(selection.productId),
                                                className: "text-destructive hover:text-destructive/80 ml-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 996,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/shipping-form.tsx",
                                                lineNumber: 991,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, selection.productId, true, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 984,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/shipping-form.tsx",
                                lineNumber: 982,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 980,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                        open: productDialogOpen,
                        onOpenChange: closeProductSelectionDialog,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                            className: "sm:max-w-[425px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                        children: currentProductSelection?.product?.product_name || 'Select Product Quantity'
                                    }, void 0, false, {
                                        fileName: "[project]/components/shipping-form.tsx",
                                        lineNumber: 1008,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/shipping-form.tsx",
                                    lineNumber: 1007,
                                    columnNumber: 15
                                }, this),
                                currentProductSelection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 py-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 items-center gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "quantity-type",
                                                    className: "text-right",
                                                    children: t("Type")
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1015,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    id: "quantity-type",
                                                    value: currentProductSelection.quantityType,
                                                    onChange: (e)=>setCurrentProductSelection({
                                                            ...currentProductSelection,
                                                            quantityType: e.target.value
                                                        }),
                                                    className: "col-span-3 px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "pieces",
                                                            children: "Pieces"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shipping-form.tsx",
                                                            lineNumber: 1027,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "kilos",
                                                            children: "Kilos"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shipping-form.tsx",
                                                            lineNumber: 1028,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1018,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shipping-form.tsx",
                                            lineNumber: 1014,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 items-center gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "quantity",
                                                    className: "text-right",
                                                    children: "Quantity"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1033,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "quantity",
                                                    type: "number",
                                                    min: "0.1",
                                                    step: "0.1",
                                                    value: currentProductSelection.quantity,
                                                    onChange: (e)=>setCurrentProductSelection({
                                                            ...currentProductSelection,
                                                            quantity: parseFloat(e.target.value) || 0
                                                        }),
                                                    className: "col-span-3 px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1036,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shipping-form.tsx",
                                            lineNumber: 1032,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 items-center gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "selling-price",
                                                    className: "text-right",
                                                    children: t("Selling Price")
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1051,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "selling-price",
                                                    type: "number",
                                                    step: "0.01",
                                                    min: "0",
                                                    value: currentProductSelection.sellingPrice,
                                                    onChange: (e)=>setCurrentProductSelection({
                                                            ...currentProductSelection,
                                                            sellingPrice: parseFloat(e.target.value) || 0
                                                        }),
                                                    className: "col-span-3 px-3 py-2 border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1054,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shipping-form.tsx",
                                            lineNumber: 1050,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-end gap-2 pt-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    variant: "outline",
                                                    onClick: closeProductSelectionDialog,
                                                    children: t("Cancel")
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1069,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    onClick: saveProductSelection,
                                                    children: [
                                                        selectedOutputProducts.find((s)=>s.productId === currentProductSelection.productId) ? t('Update') : t('Add'),
                                                        " ",
                                                        t("Products")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shipping-form.tsx",
                                                    lineNumber: 1072,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shipping-form.tsx",
                                            lineNumber: 1068,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shipping-form.tsx",
                                    lineNumber: 1013,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shipping-form.tsx",
                            lineNumber: 1006,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/shipping-form.tsx",
                        lineNumber: 1005,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 933,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 pt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "submit",
                    disabled: isLoading,
                    className: "gap-2",
                    children: [
                        isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-4 h-4 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/components/shipping-form.tsx",
                            lineNumber: 1085,
                            columnNumber: 25
                        }, this),
                        t("Save Shipping Information")
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shipping-form.tsx",
                    lineNumber: 1084,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/shipping-form.tsx",
                lineNumber: 1083,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/shipping-form.tsx",
        lineNumber: 500,
        columnNumber: 5
    }, this);
}
_s(ShippingForm, "81mJl/NgqPwiRFnapkBpjvU8wDA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = ShippingForm;
var _c;
__turbopack_context__.k.register(_c, "ShippingForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_shipping-form_tsx_d18a4448._.js.map