"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

export default function MagneticLink(props: ComponentProps<typeof Link>) {
  const magnetic = useMagnetic<HTMLAnchorElement>();

  return <Link {...props} ref={magnetic.ref} style={{ ...props.style, ...magnetic.style }} />;
}
