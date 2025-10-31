"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Button, ButtonAsLink } from "../UI/Button";

export interface SidebarButtonProps
    extends Omit<ButtonAsLink, "isActive"> {
    isCollapsed?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export default function SidebarButton({
    href,
    isCollapsed = true,
    icon,
    children,
    ...props
}: SidebarButtonProps) {

    const pathname = usePathname();
    const isActive = href ? pathname === href || (pathname.startsWith(href) && href !== "/") : false;

    return (
        <Button
            href={href}
            icon={icon}
            isActive={isActive}
            className={`${props.className || ""} ${isCollapsed ? "justify-start" : ""}`}
            {...props}
        >
            {
                isCollapsed
                ?
                <span></span>
                :
                <span>{children}</span>
            }
        </Button>

    );
}