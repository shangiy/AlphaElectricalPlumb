
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import RevenueAreaChart from "@/components/admin/charts/RevenueAreaChart";
import SalesBarChart from "@/components/admin/charts/SalesBarChart";
import CategoryPieChart from "@/components/admin/charts/CategoryPieChart";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Analytics Overview</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                        <CardDescription>A look at the total revenue generated per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RevenueAreaChart />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>Breakdown of product sales by category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <CategoryPieChart />
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Monthly Sales Performance</CardTitle>
                        <CardDescription>Comparison of product sales and goals for the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SalesBarChart />
                    </CardContent>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Insights and Reports</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-3">
                            <p><strong className="text-foreground">Revenue Growth:</strong> There's a consistent upward trend in revenue, with a significant spike in June. This may correlate with a recent marketing campaign.</p>
                            <p><strong className="text-foreground">Top Categories:</strong> Plumbing and Lighting are the dominant sales categories. There's an opportunity to promote the Decor and Roofing collections more heavily.</p>
                            <p><strong className="text-foreground">Sales Goals:</strong> While sales are strong, we missed the sales goal in April. It's worth investigating the cause to prevent future dips.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
