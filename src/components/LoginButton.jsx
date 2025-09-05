import { forwardRef } from "react"

const LoginButton = forwardRef(
  (
    {
      children,
      variant = "primary",
      icon: Icon,
      className = "",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-gray-800 hover:bg-gray-900 text-stone-50 focus:ring-gray-500",
      linkedin: "bg-gray-800 hover:bg-gray-900 text-stone-50 focus:ring-gray-500",
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
        ${baseStyles}
        ${variants[variant]}
        w-full px-6 py-4 text-base
        ${className}
      `}
        {...props}
      >
        {Icon && <Icon className="w-6 h-6 mr-2" />}
        {children}
      </button>
    )
  },
)

LoginButton.displayName = "Button"

export default LoginButton