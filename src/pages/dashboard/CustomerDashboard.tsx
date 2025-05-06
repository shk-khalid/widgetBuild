
import { useState } from 'react';
// import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, CreditCard, Download, Home, Package, Shield, User } from 'lucide-react';
import ClaimsSection from '@/components/claims/ClaimsSection';
import { ClaimType, ClaimStatus, CustomerData } from '@/types/claims';

// Enhanced mock data for our demo
const customerData: CustomerData = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    address: "123 Bandra West, Mumbai 400050",
    activePolicies: [
        {
            id: "POL-123456",
            name: "Phone Protection Plan",
            product: "Device Insurance",
            premium: "₹149",
            startDate: "2023-10-15",
            endDate: "2024-10-14",
            status: "active",
            type: "product" as ClaimType
        },
        {
            id: "POL-789012",
            name: "Travel Assurance",
            product: "Travel Insurance",
            premium: "₹299",
            startDate: "2023-12-01",
            endDate: "2024-01-15",
            status: "active",
            type: "product" as ClaimType
        },
        {
            id: "POL-345678",
            name: "Shipment Protection",
            product: "Shipping Insurance",
            premium: "₹29",
            startDate: "2023-11-20",
            endDate: "2024-12-10",
            status: "active",
            type: "shipping" as ClaimType
        }
    ],
    claims: [
        {
            id: "CLM-123789",
            policyId: "POL-123456",
            product: "Device Insurance",
            type: "product" as ClaimType,
            claimType: "Screen Damage",
            amount: "₹2,500",
            date: "2023-11-15T10:30:00Z",
            status: "approved" as ClaimStatus,
            details: {
                productCategory: "Electronics",
                purchaseDate: "2023-10-01",
                damageDate: "2023-11-10",
                issueType: "Screen Damage",
                serialNumber: "SN123456789",
                aiConfidence: 92,
                recommendedAction: "Approve - Replace",
                uploadedFiles: [
                    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                ]
            }
        },
        {
            id: "CLM-456123",
            policyId: "POL-345678",
            product: "Shipping Insurance",
            type: "shipping" as ClaimType,
            claimType: "Lost Package",
            amount: "₹1,200",
            date: "2023-12-05T14:20:00Z",
            status: "under_review" as ClaimStatus,
            details: {
                orderNumber: "ORD987654",
                trackingNumber: "TRK12345678",
                purchaseDate: "2023-11-28",
                issueType: "Lost Package",
                courierPartner: "FedEx",
                aiConfidence: 75,
                recommendedAction: "Under Review",
                uploadedFiles: [
                    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                ]
            }
        },
        {
            id: "CLM-789456",
            policyId: "POL-789012",
            product: "Travel Insurance",
            type: "product" as ClaimType,
            claimType: "Damaged Luggage",
            amount: "₹3,500",
            date: "2023-12-10T09:15:00Z",
            status: "rejected" as ClaimStatus,
            details: {
                productCategory: "Travel Accessories",
                purchaseDate: "2023-11-20",
                damageDate: "2023-12-08",
                issueType: "Damaged Luggage",
                aiConfidence: 45,
                recommendedAction: "Reject - Outside Coverage Period",
                uploadedFiles: [
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                ]
            }
        }
    ],
    recentOrders: [
        {
            id: "ORD-987654",
            date: "2023-12-02",
            items: ["iPhone 14 Pro"],
            amount: "₹119,999",
            insurance: "Device Protection"
        },
        {
            id: "ORD-876543",
            date: "2023-11-20",
            items: ["Sony Headphones WH-1000XM5"],
            amount: "₹29,999",
            insurance: "Device Protection"
        },
        {
            id: "ORD-765432",
            date: "2023-10-15",
            items: ["Flight Tickets - Mumbai to Delhi"],
            amount: "₹8,500",
            insurance: "Travel Assurance"
        }
    ]
};

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <>
{/*             <Helmet>
                <title>Customer Dashboard - Protega.ai</title>
                <meta name="description" content="Manage your insurance policies and claims with Protega.ai" />
            </Helmet> */}
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow pt-24 pb-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Sidebar */}
                            <div className="w-full md:w-64 space-y-6">
                                {/* Profile Card */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-20 h-20 rounded-full bg-protega-100 flex items-center justify-center mb-4">
                                                <User className="w-10 h-10 text-protega-600" />
                                            </div>
                                            <h3 className="font-semibold text-lg">{customerData.name}</h3>
                                            <p className="text-sm text-gray-500">{customerData.email}</p>
                                            <button className="mt-4 text-sm text-protega-600 hover:text-protega-700 hover:underline">
                                                Edit Profile
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Navigation Card */}
                                <Card>
                                    <CardContent className="p-0">
                                        <button
                                            onClick={() => setActiveTab("overview")}
                                            className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors ${activeTab === "overview" ? "bg-protega-50 text-protega-700 border-l-2 border-protega-600" : ""
                                                }`}
                                        >
                                            <Home className="w-4 h-4 mr-3" />
                                            <span className="text-sm">Overview</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("policies")}
                                            className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors ${activeTab === "policies" ? "bg-protega-50 text-protega-700 border-l-2 border-protega-600" : ""
                                                }`}
                                        >
                                            <Shield className="w-4 h-4 mr-3" />
                                            <span className="text-sm">My Policies</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("claims")}
                                            className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors ${activeTab === "claims" ? "bg-protega-50 text-protega-700 border-l-2 border-protega-600" : ""
                                                }`}
                                        >
                                            <CreditCard className="w-4 h-4 mr-3" />
                                            <span className="text-sm">Claims</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("orders")}
                                            className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors ${activeTab === "orders" ? "bg-protega-50 text-protega-700 border-l-2 border-protega-600" : ""
                                                }`}
                                        >
                                            <Package className="w-4 h-4 mr-3" />
                                            <span className="text-sm">Order History</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("analytics")}
                                            className={`flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors ${activeTab === "analytics" ? "bg-protega-50 text-protega-700 border-l-2 border-protega-600" : ""
                                                }`}
                                        >
                                            <BarChart className="w-4 h-4 mr-3" />
                                            <span className="text-sm">Analytics</span>
                                        </button>
                                    </CardContent>
                                </Card>

                                {/* Help Card */}
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="font-medium text-sm mb-2">Need Help?</h3>
                                        <p className="text-xs text-gray-500 mb-4">Our support team is available 24/7 to assist you.</p>
                                        <button className="w-full text-sm bg-protega-600 hover:bg-protega-700 text-white px-3 py-2 rounded transition-colors">
                                            Contact Support
                                        </button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1">
                                {activeTab === "overview" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Active Policies Card */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Active Policies</CardTitle>
                                                <CardDescription>Your currently active insurance policies</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {customerData.activePolicies.filter(policy => policy.status === "active").map((policy) => (
                                                        <div key={policy.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                                            <div>
                                                                <p className="font-medium">{policy.name}</p>
                                                                <p className="text-sm text-gray-500">{policy.product}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium">{policy.premium}</p>
                                                                <p className="text-xs text-gray-500">Expires: {new Date(policy.endDate).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Recent Claims Card */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Recent Claims</CardTitle>
                                                <CardDescription>Status of your recent insurance claims</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {customerData.claims.length > 0 ? (
                                                        customerData.claims.map((claim) => (
                                                            <div key={claim.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                                                <div>
                                                                    <p className="font-medium">{claim.type}</p>
                                                                    <p className="text-sm text-gray-500">{claim.product}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-medium">{claim.amount}</p>
                                                                    <span className={`inline-block px-2 py-1 text-xs rounded ${claim.status === "approved" ? "bg-green-100 text-green-800" :
                                                                            claim.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                                                "bg-blue-100 text-blue-800"
                                                                        }`}>
                                                                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <p className="text-gray-500">No claims filed yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Recent Orders Card */}
                                        <Card className="md:col-span-2">
                                            <CardHeader>
                                                <CardTitle>Recent Orders</CardTitle>
                                                <CardDescription>Your recent purchases with Protega insurance</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="pb-2 text-left font-medium text-sm">Order ID</th>
                                                                <th className="pb-2 text-left font-medium text-sm">Date</th>
                                                                <th className="pb-2 text-left font-medium text-sm">Items</th>
                                                                <th className="pb-2 text-left font-medium text-sm">Amount</th>
                                                                <th className="pb-2 text-left font-medium text-sm">Insurance</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {customerData.recentOrders.map((order) => (
                                                                <tr key={order.id} className="border-b">
                                                                    <td className="py-3 text-sm">{order.id}</td>
                                                                    <td className="py-3 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                                                                    <td className="py-3 text-sm">{order.items.join(", ")}</td>
                                                                    <td className="py-3 text-sm">{order.amount}</td>
                                                                    <td className="py-3 text-sm">
                                                                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                                                                            <Shield className="w-3 h-3 mr-1" /> {order.insurance}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {activeTab === "policies" && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>My Insurance Policies</CardTitle>
                                            <CardDescription>Manage your active and expired insurance policies</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Tabs defaultValue="active">
                                                <TabsList className="mb-6">
                                                    <TabsTrigger value="active">Active Policies</TabsTrigger>
                                                    <TabsTrigger value="expired">Expired Policies</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="active">
                                                    <div className="space-y-4">
                                                        {customerData.activePolicies.filter(policy => policy.status === "active").map((policy) => (
                                                            <div key={policy.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                                                                    <div className="flex items-center">
                                                                        <Shield className="h-5 w-5 text-protega-600 mr-2" />
                                                                        <h3 className="font-medium">{policy.name}</h3>
                                                                    </div>
                                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                                                                        Active
                                                                    </span>
                                                                </div>
                                                                <div className="p-4">
                                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Policy ID</p>
                                                                            <p className="text-sm font-medium">{policy.id}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Product</p>
                                                                            <p className="text-sm">{policy.product}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Premium</p>
                                                                            <p className="text-sm">{policy.premium}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Valid Until</p>
                                                                            <p className="text-sm">{new Date(policy.endDate).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <button className="px-3 py-1.5 text-xs bg-protega-600 text-white rounded hover:bg-protega-700 transition-colors">
                                                                            View Details
                                                                        </button>
                                                                        <button className="px-3 py-1.5 text-xs flex items-center border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                                                                            <Download className="w-3 h-3 mr-1" /> Download Policy
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="expired">
                                                    <div className="space-y-4">
                                                        {customerData.activePolicies.filter(policy => policy.status === "expired").map((policy) => (
                                                            <div key={policy.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                                                                    <div className="flex items-center">
                                                                        <Shield className="h-5 w-5 text-gray-400 mr-2" />
                                                                        <h3 className="font-medium">{policy.name}</h3>
                                                                    </div>
                                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                                                                        Expired
                                                                    </span>
                                                                </div>
                                                                <div className="p-4">
                                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Policy ID</p>
                                                                            <p className="text-sm font-medium">{policy.id}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Product</p>
                                                                            <p className="text-sm">{policy.product}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Premium</p>
                                                                            <p className="text-sm">{policy.premium}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500 mb-1">Expired On</p>
                                                                            <p className="text-sm">{new Date(policy.endDate).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <button className="px-3 py-1.5 text-xs bg-protega-600 text-white rounded hover:bg-protega-700 transition-colors">
                                                                            Renew Policy
                                                                        </button>
                                                                        <button className="px-3 py-1.5 text-xs flex items-center border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                                                                            <Download className="w-3 h-3 mr-1" /> Download Policy
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                )}

                                {activeTab === "claims" && (
                                    <ClaimsSection customerData={customerData} setActiveTab={setActiveTab} />
                                )}

                                {activeTab === "orders" && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Order History</CardTitle>
                                            <CardDescription>All your purchases with Protega insurance</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="pb-3 text-left font-medium">Order ID</th>
                                                            <th className="pb-3 text-left font-medium">Date</th>
                                                            <th className="pb-3 text-left font-medium">Items</th>
                                                            <th className="pb-3 text-left font-medium">Amount</th>
                                                            <th className="pb-3 text-left font-medium">Insurance</th>
                                                            <th className="pb-3 text-left font-medium">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {customerData.recentOrders.map((order) => (
                                                            <tr key={order.id} className="border-b">
                                                                <td className="py-4">{order.id}</td>
                                                                <td className="py-4">{new Date(order.date).toLocaleDateString()}</td>
                                                                <td className="py-4">{order.items.join(", ")}</td>
                                                                <td className="py-4">{order.amount}</td>
                                                                <td className="py-4">
                                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                                                                        <Shield className="w-3 h-3 mr-1" /> {order.insurance}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4">
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => setActiveTab("claims")}
                                                                            className="px-2 py-1 text-xs bg-protega-600 text-white rounded hover:bg-protega-700 transition-colors"
                                                                        >
                                                                            File Claim
                                                                        </button>
                                                                        <button className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                                                                            View Order
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {activeTab === "analytics" && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Insurance Analytics</CardTitle>
                                            <CardDescription>Track your protection across purchases</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-12">
                                                <BarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-700 mb-1">Analytics Coming Soon</h3>
                                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                                    We're building advanced analytics to help you understand your insurance coverage and usage patterns.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default CustomerDashboard;
