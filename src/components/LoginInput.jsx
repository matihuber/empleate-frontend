import { forwardRef } from "react"

const LoginInput = forwardRef(({ type = "text", placeholder, icon: Icon, className = "", error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-4 
            ${Icon ? "pl-12" : "pl-4"} 
            bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
})

LoginInput.displayName = "LoginInput"

export default LoginInput