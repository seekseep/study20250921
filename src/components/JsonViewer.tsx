"use client"

import { JsonView, defaultStyles } from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'

interface JsonViewerProps {
  data: string
}

export function JsonViewer({ data }: JsonViewerProps) {
  try {
    const parsed = JSON.parse(data)
    return (
      <div className="text-xs">
        <JsonView data={parsed} shouldExpandNode={(level) => level < 2} style={defaultStyles} />
      </div>
    )
  } catch (error) {
    return (
      <pre className="bg-gray-100 p-2 rounded overflow-x-auto text-xs">
        {data}
      </pre>
    )
  }
}
