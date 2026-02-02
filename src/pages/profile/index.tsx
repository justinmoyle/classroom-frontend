import { useGetIdentity, useUpdate, useNotification, useInvalidate } from "@refinedev/core";
import { User, UploadWidgetValue } from "@/types";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import UploadWidget from "@/components/upload-widget";
import { cn } from "@/lib/utils";
import { UserIcon, MailIcon, ShieldIcon, SaveIcon } from "lucide-react";
import { authClient } from "@/lib/auth.client";

const ProfilePage = () => {
  const { data: user, isLoading: identityLoading, refetch: refetchIdentity } = useGetIdentity<User>();
  const { mutate: update, isLoading: isUpdating } = useUpdate();
  const { open } = useNotification();
  const invalidate = useInvalidate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<UploadWidgetValue | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      if (user.image) {
        setImage({
          url: user.image,
          publicId: user.imageCldPubId || "",
        });
      }
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    try {
      // Use authClient to update the user profile so better-auth session is also updated
      const { error: authError } = await authClient.updateUser({
        name,
        image: image?.url,
        // @ts-ignore - imageCldPubId is an additional field
        imageCldPubId: image?.publicId,
      });

      if (authError) {
        throw new Error(authError.message || "Failed to update auth profile");
      }

      // Also update via the users resource to ensure any other custom fields are saved
      // and to trigger Refine's cache invalidation
      update(
        {
          resource: "users",
          id: user.id,
          values: {
            name,
            email,
            image: image?.url,
            imageCldPubId: image?.publicId,
          },
        },
        {
          onSuccess: () => {
            open?.({
              type: "success",
              message: "Profile updated successfully",
              description: "Your profile information has been saved.",
            });
            
            // Invalidate identity and user data to update the header and global state
            invalidate({
              resource: "users",
              invalidates: ["resourceAll", "detail"],
              id: user.id,
            });
            
            invalidate({
              resource: "auth",
              invalidates: ["identity"],
            });

            // No need to manually update localStorage anymore as authProvider 
            // now uses authClient.getSession() directly.
            refetchIdentity();
          },
          onError: (error) => {
            open?.({
              type: "error",
              message: "Failed to update profile",
              description: error.message,
            });
          },
        }
      );
    } catch (error: any) {
      open?.({
        type: "error",
        message: "Failed to update profile",
        description: error.message,
      });
    }
  };

  if (identityLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
      <div className="flex flex-col gap-2">
        <Breadcrumb />
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Your avatar will be visible to other users.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <UploadWidget
              value={image}
              onChange={(val) => setImage(val)}
            />
            {user?.role && (
              <div className="flex flex-col items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize px-3 py-1">
                  <ShieldIcon className="size-3 mr-1" />
                  {user.role}
                </Badge>
                <p className="text-xs text-muted-foreground">Account Role</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your name and email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <UserIcon className="size-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <MailIcon className="size-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your email address is used for login and notifications.
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button 
              type="submit" 
              form="profile-form" 
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isUpdating ? "Saving..." : (
                <>
                  <SaveIcon className="size-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3 border-dashed border-2">
          <CardHeader>
            <CardTitle className="text-lg">Account Security</CardTitle>
            <CardDescription>
              Additional security settings to protect your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between">
                <div>
                   <p className="font-medium">Password</p>
                   <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
                </div>
                <Button variant="outline" disabled>
                   Change Password
                </Button>
             </div>
             <p className="text-xs text-muted-foreground mt-4 italic">
                * Password management is handled by our authentication provider.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
