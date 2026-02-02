import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getOptimizedCloudinaryUrl } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";
import { User } from "@/types";

function AvatarImageWithRetry({ src, alt, key }: { src: string; alt: string; key?: string }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return null;
  }

  return (
    <AvatarImage
      key={key}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const { name, image } = user;

  const backgroundColor = getRandomColor(name);

  return (
    <Avatar className={cn("h-10", "w-10")}>
      {image && (
        <AvatarImageWithRetry
          src={getOptimizedCloudinaryUrl(image)!}
          alt={name}
          key={image}
        />
      )}
      <AvatarFallback
        className={cn("text-white font-medium")}
        style={{ backgroundColor }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

const getInitials = (name = "") => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const getRandomColor = (name: string) => {
  const colors = [
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#f59e0b", // amber-500
    "#10b981", // emerald-500
    "#3b82f6", // blue-500
    "#6366f1", // indigo-500
    "#8b5cf6", // violet-500
    "#d946ef", // fuchsia-500
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

UserAvatar.displayName = "UserAvatar";
