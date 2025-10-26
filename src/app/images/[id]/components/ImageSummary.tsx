"use client"

import { useState } from "react"
import { Image } from "@/domain/entity/image"
import { FiRefreshCw } from "react-icons/fi"

interface ImageSummaryProps {
  image: Image
}

export function ImageSummary({ image: initialImage }: ImageSummaryProps) {
  const [image, setImage] = useState(initialImage)
  const [isLoading, setIsLoading] = useState(false)

  const handleSummarize = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/images/${image.id}/summarize`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to summarize image')
      }

      // Poll for the result
      const pollInterval = setInterval(async () => {
        const imageResponse = await fetch(`/api/images/${image.id}`)
        const imageData = await imageResponse.json()

        if (imageData.success && imageData.data) {
          const updatedImage = imageData.data
          setImage(updatedImage)

          if (updatedImage.summarizeStatus === 'completed' || updatedImage.summarizeStatus === 'failed') {
            clearInterval(pollInterval)
            setIsLoading(false)
          }
        }
      }, 2000)

      // Stop polling after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval)
        setIsLoading(false)
      }, 60000)
    } catch (error) {
      console.error('Failed to summarize:', error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      {image.summarizeStatus === 'idle' && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">この画像はまだ要約されていません</p>
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            要約を生成
          </button>
        </div>
      )}

      {image.summarizeStatus === 'processing' && (
        <div className="text-center py-8">
          <FiRefreshCw className="animate-spin mx-auto mb-4 text-2xl text-blue-600" />
          <p className="text-gray-600">要約を生成中...</p>
        </div>
      )}

      {image.summarizeStatus === 'completed' && image.summarizeResult && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">要約結果</h3>
            <button
              onClick={handleSummarize}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 flex items-center gap-2"
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
              再生成
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap">
            {image.summarizeResult}
          </div>
        </div>
      )}

      {image.summarizeStatus === 'failed' && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">要約の生成に失敗しました</p>
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            再試行
          </button>
        </div>
      )}
    </div>
  )
}
