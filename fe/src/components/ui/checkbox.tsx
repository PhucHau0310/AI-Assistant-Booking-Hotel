"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
    id?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, id, disabled, ...props }, ref) => {
        return (
            <label className="relative flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={id}
                    ref={ref}
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    disabled={disabled}
                    className={cn(
                        "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                        checked && "bg-primary text-primary-foreground",
                        className
                    )}
                    {...props}
                />
                {checked && (
                    <div className="absolute left-0 top-0 flex items-center justify-center w-4 h-4 pointer-events-none">
                        <Check className="h-3 w-3 text-white" />
                    </div>
                )}
            </label>
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
