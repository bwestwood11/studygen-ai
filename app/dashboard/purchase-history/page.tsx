import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPurchaseHistory } from "@/lib/purchase-history";
import { currencyFormatter, numberFormatter } from "@/lib/utils";
import PurchaseModalButton from "@/components/modal/purchase-modal-button";

export default async function Component() {
  const purchaseHistory = await getPurchaseHistory();
  if (!purchaseHistory) return null;
  const totalCredits = purchaseHistory.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );
  const totalAmount = purchaseHistory.reduce(
    (acc, curr) => acc + curr.price,
    0
  );

  return (
    <div>
      <div className="grid gap-8">
        <div className="grid gap-4">
          <h1 className="text-2xl font-bold">Purchase History</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View your past transactions and credits.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Credits Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {numberFormatter(totalCredits)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Amount Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">
                {currencyFormatter(totalAmount)}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credits</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date/Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseHistory.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>${purchase.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(purchase.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {purchaseHistory.length < 1 ? (
              <div className=" py-8 flex flex-col justify-center items-center gap-3">
                <p className="text-lg">Your purchase history is empty!</p>
                <PurchaseModalButton>Purchase Now</PurchaseModalButton>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
