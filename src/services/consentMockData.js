
export const ledgerData = [
    {
        customerId: "CUST-10293",
        customerName: "John Doe",
        details: {
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            status: "High Value"
        },
        apis: [
            {
                name: "Accounts Information API",
                consents: [
                    { status: "Active", granter: "User (Mobile App)", date: "2023-11-15 14:22:01" },
                    { status: "Expired", granter: "System Auto-renewal", date: "2023-01-10 09:15:22" }
                ]
            },
            {
                name: "Payments Initiation API",
                consents: [
                    { status: "Revoked", granter: "User (Customer Portal)", date: "2024-02-01 11:30:45" }
                ]
            }
        ],
        products: [
            {
                name: "Express Savings Account",
                consents: [
                    { status: "Active", granter: "User (Mobile App)", date: "2023-12-05 16:45:00" }
                ]
            }
        ],
        tpps: [
            {
                name: "TrueLayer",
                consents: [
                    { status: "Active", granter: "User (OAuth)", date: "2023-10-10 12:00:00" }
                ]
            }
        ]
    },
    {
        customerId: "CUST-20394",
        customerName: "Jane Smith",
        details: {
            email: "jane.smith@fintech.com",
            phone: "+44 20 7946 0123",
            status: "Premium"
        },
        apis: [
            {
                name: "Card Details API",
                consents: [
                    { status: "Active", granter: "User (Third Party App)", date: "2024-01-20 08:00:15" },
                    { status: "Suspended", granter: "Bank Audit", date: "2024-02-10 10:12:33" }
                ]
            }
        ],
        products: [
            {
                name: "Global Student Account",
                consents: [
                    { status: "Active", granter: "User (Web)", date: "2023-09-12 11:05:55" }
                ]
            }
        ],
        tpps: [
            {
                name: "Plaid",
                consents: [
                    { status: "Active", granter: "User (Direct)", date: "2024-01-05 09:30:00" }
                ]
            }
        ]
    }
];
