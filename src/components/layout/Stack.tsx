import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils/cn";

const stackVariants = cva("flex flex-col", {
    variants: {
        gap: {
            none: "gap-0",
            xs: "gap-1",
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-6",
            xl: "gap-8",
        },
        align: {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
        },
        justify: {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
        },
    },
    defaultVariants: {
        gap: "md",
        align: "stretch",
        justify: "start",
    },
});

interface StackProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof stackVariants> {
}

function Stack({ className, gap, align, justify, ...props }: StackProps) {
    return (
        <div
            className={cn(stackVariants({ gap, align, justify }), className)}
            {...props}
        />
    );
}

export { Stack, type StackProps };
