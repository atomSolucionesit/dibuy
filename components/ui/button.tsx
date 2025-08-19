import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-magenta text-blanco hover:bg-magenta-dark shadow-lg hover:shadow-xl",
        destructive:
          "bg-red-600 text-blanco hover:bg-red-700 shadow-lg hover:shadow-xl",
        outline:
          "border border-magenta bg-transparent text-magenta hover:bg-magenta hover:text-blanco",
        secondary:
          "bg-zafiro text-blanco hover:bg-zafiro-dark shadow-lg hover:shadow-xl",
        ghost: "hover:bg-magenta/10 hover:text-magenta",
        link: "text-magenta underline-offset-4 hover:underline",
        // Nuevas variantes con la paleta personalizada
        magenta: "bg-magenta text-blanco hover:bg-magenta-dark shadow-lg hover:shadow-xl",
        zafiro: "bg-zafiro text-blanco hover:bg-zafiro-dark shadow-lg hover:shadow-xl",
        amatista: "bg-amatista text-blanco hover:bg-amatista-dark shadow-lg hover:shadow-xl",
        oro: "bg-oro text-negro hover:bg-oro-dark shadow-lg hover:shadow-xl",
        gradient: "bg-gradient-primary text-blanco hover:opacity-90 shadow-lg hover:shadow-xl",
        gradientSecondary: "bg-gradient-secondary text-blanco hover:opacity-90 shadow-lg hover:shadow-xl",
        gradientAccent: "bg-gradient-accent text-negro hover:opacity-90 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
