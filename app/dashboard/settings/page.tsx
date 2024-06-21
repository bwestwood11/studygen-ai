import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  UserAvatar,
} from "@/components/ui/avatar";
import { CreditCardIcon, WalletIcon } from "lucide-react";
import { numberFormatter } from "@/lib/utils";
import { getDbCurrentUser } from "@/actions/auth.action";
import { Zap } from "lucide-react";
import PurchaseModalButton from "@/components/modal/purchase-modal-button";

export default async function SettingsPage() {
  const user = await getDbCurrentUser({includes: {purchases: true}});
  if (!user) return null;
  return (
    <div className="flex flex-col min-h-fullscreen">
      <main className="flex-1 bg-background px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto grid gap-8">
          <Card className="bg-card rounded-lg shadow-md text-card-foreground">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center gap-4">
                <UserAvatar
                  ProfileSrc={user.image || undefined}
                  name={user.name || "user"}
                  alt={user.name || "user image"}
                />
                <div className="grid gap-1">
                  <div className="text-lg font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Account Type</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                 {user.purchases.length > 0 ? "Pro" : "FREE"}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Joined</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card rounded-lg shadow-md p-6 text-card-foreground">
            <div className="flex items-center gap-4 mb-4">
              <WalletIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-medium">Credits</h3>
            </div>

<div className=" space-y-2">

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Total Credits</div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <CreditCardIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  {numberFormatter(user.credits)}
                </div>
              </div>
            </div>
            <PurchaseModalButton>
              Purchase
              <Zap size={20} className="fill-primary" />
            </PurchaseModalButton>
</div>

          </Card>
          
        </div>
      </main>
    </div>
  );
}
