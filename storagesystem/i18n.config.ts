import i18n from 'i18next'

const resources = {
  en: {
    translation: {
      // Header
      "Product Store": "Product Storage",

      // Main Page
      "Product Storage System": "Product Storage System",
      "Manage products, shipping, clients, and financial records efficiently": "Manage products, shipping, clients, and financial records efficiently",
      "Store Overview": "Store Overview",
      "Products": "Products",
      "Shipping": "Shipping",
      "Clients": "Clients",
      "Debit": "Debit",

      // Error Messages
      "Failed to load data": "Failed to load data",

      // Clients Tab
      "Search by client name or phone number...": "Search by client name or phone number...",
      "Cancel": "Cancel",
      "Add Client": "Add Client",
      "No clients found. Start by adding a client record!": "No clients found. Start by adding a client record!",
      "Failed to delete client. Please try again.": "Failed to delete client. Please try again.",

      // Language Switch
      "Language": "Language",
      "English": "English",
      "العربية": "العربية",

      // Product Table
      "Filter Products": "Filter Products",
      "Product Name": "Product Name",
      "Storage": "Storage",
      "Shipping ID": "Shipping ID",
      "All Status": "All Status",
      "Available": "Available",
      "Out of Stock": "Out of Stock",
      "Clear Filters": "Clear Filters",
      "Box Code": "Box Code",
      "Original Price": "Original Price",
      "Selling Price": "Selling Price",
      "Group Item Price": "Group Item Price",
      "Number of boxes": "Number of boxes",
      "Pieces per box": "Pieces per box",
      "Extracted Pieces": "Extracted Pieces",
      "Status": "Status",
      "None": "None",

      // Shipping Table
      "Filter Shipping": "Filter Shipping",
      "All Types": "All Types",
      "Input Load": "Input Load",
      "Output Load": "Output Load",
      "Coming": "Coming",
      "Receiver": "Receiver",
      "Shipping Date": "Shipping Date",
      "Select Receiver": "Select Receiver",
      "Select Sender": "Select Sender",
      "No products": "No products",
      "Dollar": "Dollar",
      "Iraqi Dinar": "Iraqi Dinar",
      "Notes": "Notes",
      "Type": "Type",
      "Receiving Date": "Receiving Date",
      "Sender": "Sender",
      "Products": "Products",
      "Paid": "Paid",
      "Ship Price": "Ship Price",
      "Currency": "Currency",
      "Note": "Note",
      "Actions": "Actions",

      // Client Table
      "Filter Clients": "Filter Clients",
      "Client Name": "Client Name",
      "Phone Number": "Phone Number",

      // Debit Table
      "Filter Debits": "فلترة الديون",
      "Amount": "المبلغ",
      "Total Debits": "إجمالي الديون",
      "All Currencies": "جميع العملات",
      "Receiver Missing": "مستلم مفقود",
      "No note": "لا توجد ملاحظة",
      "View Details": "عرض التفاصيل",

      // Buttons
      "Add Product": "Add Product",
      "Save": "Save",
      "Delete": "Delete",
      "Edit": "Edit",
      "Create Product": "Create Product",
      "Upload Excel": "Upload Excel",
      "Cancel Upload": "Cancel Upload",
      "Add Shipping": "Add Shipping",
      "Add Transaction": "Add Transaction",
      "Save Shipping Information": "Save Shipping Information",
      "Save Product": "Save Product",
      "Save Client": "Save Client",
      "Add New Client": "Add New Client",
      "Add New Product": "Add New Product",
      "Add New Shipping": "Add New Shipping",
      "Add New Transaction": "Add New Transaction",
      "Create": "Create",
      "Submit": "Submit",
      "Close": "Close",
      "Upload": "Upload",
      "Search": "Search",
      "Search by product name or box code...": "Search by product name or box code...",
      "No products found. Start by adding your first product!": "No products found. Start by adding your first product!"
    }
  },
  ar: {
    translation: {
      // Header
      "Product Store": "متجر المنتجات",

      // Main Page
      "Product Storage System": "نظام تخزين المنتجات",
      "Manage products, shipping, clients, and financial records efficiently": "إدارة المنتجات والشحن والعملاء والسجلات المالية بكفاءة",
      "Store Overview": "نظرة عامة على المتجر",
      "Products": "المنتجات",
      "Shipping": "الشحن",
      "Clients": "العملاء",
      "Debit": "الديون",

      // Error Messages
      "Failed to load data": "فشل في تحميل البيانات",

      // Clients Tab
      "Search by client name or phone number...": "البحث بالاسم أو رقم الهاتف...",
      "Cancel": "إلغاء",
      "Add Client": "إضافة عميل",
      "No clients found. Start by adding a client record!": "لم يتم العثور على عملاء. ابدأ بإضافة سجل عميل!",
      "Failed to delete client. Please try again.": "فشل في حذف العميل. يرجى المحاولة مرة أخرى.",

      // Language Switch
      "Language": "اللغة",
      "English": "English",
      "العربية": "العربية",

      // Product Table
      "Filter Products": "فلترة المنتجات",
      "Product Name": "اسم المنتج",
      "Storage": "التخزين",
      "Shipping ID": "معرف الشحن",
      "All Status": "جميع الحالات",
      "Available": "متوفر",
      "Out of Stock": "غير متوفر",
      "Clear Filters": "مسح الفلاتر",
      "Box Code": "كود الصندوق",
      "Original Price": "السعر الأصلي",
      "Selling Price": "سعر البيع",
      "Group Item Price": "سعر المجموعة",
      "Number of boxes": "عدد الصناديق",
      "Pieces per box": "القطع لكل صندوق",
      "Extracted Pieces": "القطع المستخرجة",
      "Status": "الحالة",
      "None": "لا يوجد",

      // Shipping Table
      "Filter Shipping": "فلترة الشحن",
      "All Types": "جميع الأنواع",
      "Input Load": "حمل دخول",
      "Output Load": "حمل خروج",
      "Coming": "قادم",
      "Receiver": "المتلقي",
      "Shipping Date": "تاريخ الشحن",
      "Select Receiver": "اختيار المستلم",
      "Select Sender": "اختيار المرسل",
      "No products": "لا توجد منتجات",
      "Dollar": "دولار",
      "Iraqi Dinar": "دينار عراقي",
      "Notes": "ملاحظات",
      "Type": "النوع",
      "Receiving Date": "تاريخ الاستلام",
      "Sender": "المرسل",
      "Products": "المنتجات",
      "Paid": "مدفوع",
      "Ship Price": "سعر الشحن",
      "Currency": "العملة",
      "Note": "ملاحظة",
      "Actions": "الإجراءات",

      // Client Table
      "Filter Clients": "فلترة العملاء",
      "Client Name": "اسم العميل",
      "Phone Number": "رقم الهاتف",
      "N/A": "غير متوفر",
      "No history": "لا توجد سابقة",

      // Client Table Headers
      "Shipping ID": "معرف الشحن",
      "History": "السجل",
      "Total Debts": "إجمالي الديون",

      // Debit Table
      "Filter Debits": "فلترة الديون",
      "Amount": "المبلغ",
      "Total Debits": "إجمالي الديون",
      "All Currencies": "جميع العملات",
      "Receiver Missing": "مستلم مفقود",
      "No note": "لا توجد ملاحظة",
      "View Details": "عرض التفاصيل",
      "Debit Transaction Date": "تاريخ معاملة الدين",

      // Buttons
      "Add Product": "إضافة منتج",
      "Save": "حفظ",
      "Delete": "حذف",
      "Edit": "تحرير",
      "Create Product": "إنشاء منتج",
      "Upload Excel": "رفع إكسيل",
      "Cancel Upload": "إلغاء الرفع",
      "Add Shipping": "إضافة شحن",
      "Add Transaction": "إضافة معاملة",
      "Save Shipping Information": "حفظ معلومات الشحن",
      "Save Product": "حفظ المنتج",
      "Save Client": "حفظ العميل",
      "Add New Client": "إضافة عميل جديد",
      "Add New Product": "إضافة منتج جديد",
      "Add New Shipping": "إضافة شحن جديد",
      "Add New Transaction": "إضافة معاملة جديدة",
      "Create": "إنشاء",
      "Submit": "إرسال",
      "Close": "إغلاق",
      "Upload": "رفع",
      "Search": "بحث",
      "Search by product name or box code...": "البحث باسم المنتج أو كود الصندوق...",
      "No products found. Start by adding your first product!": "لم يتم العثور على منتجات. ابدأ بإضافة منتجك الأول!"
    }
  }
}

// Initialize i18n for server-side
const isServer = typeof window === 'undefined'

if (isServer) {
  i18n.init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })
}

export default i18n
export { resources }
