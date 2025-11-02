'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  children?: ReactNode
}

export function Select({ options, value, onValueChange, placeholder = "Select an option", className = "", children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(opt => opt.value === value)
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-md text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          className.includes('bg-gray-700')
            ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
            : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <span className={selectedOption
          ? (className.includes('bg-gray-700') ? "text-white" : "text-gray-900 dark:text-white")
          : "text-gray-500 dark:text-gray-400"
        }>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute z-20 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-auto ${
            className.includes('bg-gray-700')
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onValueChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-left focus:outline-none ${
                  className.includes('bg-gray-700')
                    ? `hover:bg-gray-700 focus:bg-gray-700 ${
                        value === option.value ? 'bg-blue-600 text-white' : 'text-gray-300'
                      }`
                    : `hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 ${
                        value === option.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'
                      }`
                }`}
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
      {children}
    </div>
  )
}