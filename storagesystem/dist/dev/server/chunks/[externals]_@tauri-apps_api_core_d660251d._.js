module.exports = [
"[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_@tauri-apps_api_core_673e2dc6._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/@tauri-apps/api/core [external] (@tauri-apps/api/core, esm_import)");
    });
});
}),
];