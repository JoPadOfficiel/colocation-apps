import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      "group/select-trigger flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon render={<ChevronDownIcon className="size-3.5 opacity-50 group-data-[open]/select-trigger:rotate-180 transition-transform duration-200" />} />
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectPortal = SelectPrimitive.Portal

const SelectContent = React.forwardRef(({ className, children, sideOffset = 4, ...props }, ref) => (
  <SelectPortal>
    <SelectPrimitive.Positioner data-slot="select-positioner" sideOffset={sideOffset}>
      <SelectPrimitive.Popup
        ref={ref}
        data-slot="select-content"
        className={cn(
          "z-50 min-w-[var(--anchor-width)] overflow-hidden rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10 shadow-lg outline-none origin-[var(--transform-origin)] duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        <div className="p-1">{children}</div>
      </SelectPrimitive.Popup>
    </SelectPrimitive.Positioner>
  </SelectPortal>
))
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      "group/select-item relative flex w-full cursor-default items-center rounded-lg py-1.5 pl-2 pr-8 text-sm outline-none transition-colors select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
      <CheckIcon className="size-3.5" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="select-label"
    className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
    {...props} />
))
SelectLabel.displayName = "SelectLabel"

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectPortal,
}
