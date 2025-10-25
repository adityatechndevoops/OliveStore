That's a smart use of Google Forms to streamline the initial intake! Since you are onboarding three distinct types of stores (**Kirana, Wholesaler, Latent**), the form should use **Conditional Logic** to guide them through relevant questions based on their store type.

Here is a design for your Google Form, titled **"Dashit Merchant Onboarding Form."**

---

## Google Form Structure: Dashit Merchant Onboarding

### Form Title: Dashit Partner Application - Join Our E-Commerce Network

### Section 1: Basic Store & Contact Information

| Question | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| **Store Name** | Short Answer | Legal/Trading Name of the Store (e.g., *Patel Kirana Store*) | Yes |
| **Store Owner/Manager Full Name** | Short Answer | | Yes |
| **Store Owner Mobile Number** | Short Answer | This will be the main contact for Dashit. | Yes |
| **Store Owner Email Address** | Short Answer | | Yes |
| **Store Type (Crucial for Conditional Logic)** | Multiple Choice | **Options:** 1. Kirana/Local Grocery Store, 2. Wholesale/Bulk Distributor, 3. Latent/Specialty/Niche Store | Yes |
| **Full Store Address** | Paragraph | Include Building Name, Street, Landmark, Pin Code (Use Data Validation to ensure a valid Pin Code format is entered). | Yes |
| **Store Location (Map Link)** | Short Answer | Request a Google Maps or Plus Code link for accurate delivery mapping. | Recommended |

---

### Section 2: Business Documentation (For Legal Verification - KYC)

*Use a **File Upload** question type to collect documents (ensure the form is set to collect email addresses for file upload).*

| Question | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| **Bank Account Name, A/C Number, IFSC Code** | Short Answer/Paragraph | Where Dashit will remit your earnings. | Yes |
| **Upload Photo of Business Registration Proof** | File Upload | Shop Establishment Certificate, Trade License, or equivalent. (Max 1-2 files) | Yes |
| **Upload Photo of Owner's ID Proof** | File Upload | Aadhar Card, Passport, or Driver's License. (Max 1 file) | Yes |
| **Tax ID (GST/VAT/Other) Number** | Short Answer | Enter 'NA' if not applicable. | Yes |

---

### Section 3: Inventory & Operational Details

This section is where you will apply **Conditional Logic** based on the answer in **Question 5 (Store Type)**.

#### $\rightarrow$ **Conditional Path: Kirana/Local Grocery Store**

| Question | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| **Average Number of SKUs (Items) in Stock** | Multiple Choice | **Options:** < 500, 500 - 2,000, 2,000 - 5,000, > 5,000 | Yes |
| **What is your primary method of inventory tracking?** | Multiple Choice | **Options:** Manual Register/Book, Basic POS/Billing Software, Excel/Spreadsheets, Other | Yes |
| **Are you willing to use a dedicated Dashit App for order management?** | Multiple Choice | **Options:** Yes, No, Need Training/Support | Yes |

#### $\rightarrow$ **Conditional Path: Wholesaler/Bulk Distributor**

| Question | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| **Estimated Monthly Bulk Sales Volume (in local currency)** | Multiple Choice | **Options:** < 1 Lac, 1 - 5 Lacs, 5 - 25 Lacs, > 25 Lacs | Yes |
| **Do you have an existing digital catalog (Excel/CSV)?** | Multiple Choice | **Options:** Yes, we can upload it, No, we manage it manually, We use proprietary software (need API integration) | Yes |
| **Can you manage orders requiring different units (e.g., 1 KG, 1 Carton, 1 Dozen)?** | Multiple Choice | Yes, No | Yes |

#### $\rightarrow$ **Conditional Path: Latent/Specialty/Niche Store**

| Question | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| **Describe your Specialty Goods/Niche** | Paragraph | (e.g., *Handmade organic soaps*, *Imported gourmet foods*, *Fresh-baked daily items*) | Yes |
| **Do your products have a short shelf life (e.g., less than 48 hours)?** | Multiple Choice | Yes, No | Yes |
| **Are you comfortable arranging high-quality photos for your unique product catalog?** | Multiple Choice | Yes, No (Need help from Dashit team) | Yes |

---

### Section 4: Agreement & Final Steps

| Question | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| **Preferred Language for Support & Training** | Multiple Choice | (e.g., English, Hindi, Local Regional Language 1, Local Regional Language 2) | Yes |
| **Do you agree to Dashit's standard Commission Structure and Terms & Conditions?** | Checkbox | Include a hyperlink to the actual T&Cs document. | Yes |
| **Any final questions or requests for the Dashit Onboarding Team?** | Paragraph | Open-ended feedback. | No |

### $\star$ Why this Google Form design works:

1.  **KYC Compliance:** Sections 1 and 2 cover all necessary business and identity verification data.
2.  **Efficiency with Conditional Logic:** By branching the form in Section 3, you only ask the wholesaler about API integration and bulk data, and the Kirana store about manual tracking, which keeps the form short and relevant for each partner.
3.  **Data for Strategy:** The responses help your team categorize the new partner and assign the right onboarding plan (e.g., a "Wholesaler with API need" gets routed to a tech integration specialist).
4.  **Actionable Information:** You collect the bank details and commitment to T&Cs in the same process, accelerating the sign-up-to-sell time!
