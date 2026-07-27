"use client";

import { HugeiconsIcon, HugeiconsProps } from "@hugeicons/react";
import * as CoreIcons from "@hugeicons/core-free-icons";

export interface IconProps extends Omit<HugeiconsProps, "icon"> {
  name: keyof typeof CoreIcons;
  className?: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  const iconData = CoreIcons[name] as any;
  if (!iconData) {
    console.warn(`Icon "${name}" not found in @hugeicons/core-free-icons`);
    return null;
  }
  return <HugeiconsIcon icon={iconData} className={className} {...props} />;
}
