# Bahi — Full Page / Screen List

Every page across the product, grouped by area. Pages are grouped as (a) public/marketing, (b) auth/onboarding, (c) shell/global, then (d) one block per module, then (e) settings/admin, (f) billing.

---

## A. Public / Marketing Site (pre-login)
1. Landing page (homepage)
2. Pricing page
3. Feature pages (one per module — CRM, Sales, Inventory, Accounting, HR, Projects) — 6 pages
4. About / Company page
5. Blog index + Blog post template
6. Contact / Book-a-demo page
7. Legal — Terms of Service
8. Legal — Privacy Policy
9. Status page (system uptime, can be a subdomain e.g. status.bahi.com)

## B. Auth & Onboarding
10. Sign up
11. Log in
12. Forgot password
13. Reset password
14. Email verification (waiting/confirmation screen)
15. Company/tenant creation wizard (name, industry, currency, timezone)
16. Module selection step (choose which apps to enable — CRM/Sales/Inventory/etc.)
17. Invite teammates step
18. Onboarding checklist/progress page (post-signup home for new tenants)
19. Org/tenant switcher (for users belonging to multiple companies)

## C. Shell / Global (present across all modules)
20. Global dashboard / home (widgets summarizing each enabled module)
21. Global search results page
22. Command palette (overlay, not a full page, but a distinct UI surface)
23. Notifications center (full page + dropdown panel)
24. Global activity feed ("everything that happened recently")
25. 404 / Not Found page
26. 403 / Permission Denied page
27. 500 / Error / Something Went Wrong page
28. Maintenance mode page

## D. CRM Module
29. Leads list
30. Lead detail page
31. Lead → Convert to Opportunity screen/modal
32. Opportunities list (table view)
33. Pipeline board (Kanban view of opportunities by stage)
34. Opportunity detail page
35. Pipeline settings (edit stages) — could live in Settings
36. Contacts list (unified contacts across CRM/Sales/vendors)
37. Contact detail page

## E. Sales Module
38. Quotations list
39. Quotation builder / create-edit page
40. Quotation detail / preview page (PDF-style preview)
41. Sales Orders list
42. Sales Order detail page
43. Price Lists list
44. Price List detail/edit page
45. Products catalog (shared with Inventory, but Sales-facing pricing view)

## F. Inventory Module
46. Product catalog (grid/list)
47. Product detail/edit page
48. Warehouses list
49. Warehouse detail page
50. Stock levels dashboard (per warehouse / per product)
51. Stock Moves list (receive/ship/transfer history)
52. Stock Move detail page
53. Receive Stock wizard
54. Ship/Transfer Stock wizard
55. Low-stock alerts page

## G. Accounting / Invoicing Module
56. Invoices list
57. Invoice builder / create-edit page
58. Invoice detail / preview page (PDF-style)
59. Bills (vendor invoices) list
60. Bill detail page
61. Payments list
62. Record Payment modal/page
63. Chart of Accounts page
64. Journal Entries list
65. Journal Entry detail page
66. Reports — Profit & Loss
67. Reports — Balance Sheet
68. Reports — Cash Flow (if included)
69. Tax settings/report page

## H. HR Module
70. Employee directory (grid/list)
71. Employee detail/profile page
72. Departments list
73. Department detail page
74. Leave requests list (employee view — "my requests")
75. Leave request create/edit page
76. Leave approvals inbox (manager view)
77. Attendance calendar (individual view)
78. Attendance overview (team/admin view)

## I. Projects Module
79. Projects list
80. Project detail page (overview tab)
81. Task board (Kanban, per project)
82. Task detail page/modal
83. Timesheet entry page (weekly grid)
84. Timesheet approvals (manager view)
85. Project reports/summary page (hours logged, budget vs actual)

## J. Settings / Admin Area
86. Settings home/index
87. Company profile settings (name, logo, address, currency, timezone)
88. Users list (admin view)
89. User detail/edit page (admin view)
90. Invite user page
91. Roles & Permissions list
92. Role detail/edit page (permission matrix)
93. Module management (enable/disable apps per tenant)
94. Custom Fields editor (per object type)
95. Tax configuration page
96. Email/notification settings page
97. API Keys management page
98. Webhooks management page
99. Webhook detail/logs page
100. Audit Log viewer
101. Data import page (CSV import per module)
102. Data export page

## K. Billing / Subscription (the SaaS's own billing, not customer invoicing)
103. Subscription/plan overview page
104. Change plan / upgrade-downgrade page
105. Payment method management page
106. Billing history / past invoices page
107. Usage/seats overview page (seats used vs. plan limit)

## L. Account / Profile (per user, not per tenant)
108. My profile page
109. My account security settings (password, 2FA)
110. My notification preferences

---

## Build Priority Grouping
If you want to sequence UI work instead of building all ~110 pages at once:

- **Must-have for a usable v1 demo:** A, B (all), C (20, 25–27), D (all), E (all), J (86–93), L (all) — this gets you a sellable CRM+Sales product with settings and onboarding.
- **v1.1:** F (Inventory) + relevant Accounting pages (56–65) — completes the quote-to-cash loop.
- **v1.2:** Remaining Accounting reports (66–69), H (HR), I (Projects).
- **Ongoing/parallel:** J's admin-heavy pages (94–102) and K (billing) — needed before charging real customers, but not needed to demo the product.
