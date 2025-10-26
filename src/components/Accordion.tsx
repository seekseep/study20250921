"use client"

import { useState } from "react"
import { FiChevronDown, FiChevronRight } from "react-icons/fi"

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold">{title}</span>
        {isOpen ? <FiChevronDown /> : <FiChevronRight />}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}
