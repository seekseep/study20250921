"use client"

import Link from "next/link"
import { useReactTable, getCoreRowModel, createColumnHelper } from "@tanstack/react-table"
import { Image } from "@/domain/entity/image"
import { Table } from "@/components/Table"
import { FiUser, FiMessageSquare, FiFile } from "react-icons/fi"

type ImageWithUrl = Image & { url?: string }

const columnHelper = createColumnHelper<ImageWithUrl>()

const TRUNCATE_LENGTH = 8

function CopyableId({ icon, value, label }: { icon: React.ReactNode; value: string | null | undefined; label: string }) {
  if (!value) return <span className="text-gray-400">-</span>

  const truncated = value.slice(0, TRUNCATE_LENGTH)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 font-mono text-xs hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
      title={`クリックして${label}をコピー: ${value}`}
    >
      {icon}
      <span>{truncated}...</span>
    </button>
  )
}

const columns = [
  columnHelper.accessor('id', {
    header: '画像ID',
    cell: info => (
      <Link
        href={`/images/${info.getValue()}`}
        className="font-mono text-xs text-blue-600 hover:underline select-text"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('fileName', {
    header: 'ファイル名',
    cell: info => {
      const image = info.row.original
      const imageUrl = image.url

      return (
        <div className="flex items-center gap-2 relative group">
          <FiFile className="text-gray-500 flex-shrink-0" />
          <span className="font-mono text-xs">{info.getValue()}</span>
          <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-10 pointer-events-none">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={info.getValue() || ''}
                className="max-w-xs max-h-48 object-contain shadow-lg rounded border border-gray-200 bg-white"
              />
            ) : (
              <div className="max-w-xs px-3 py-2 bg-white shadow-lg rounded border border-gray-200 text-sm text-gray-500">
                画像なし
              </div>
            )}
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor('lineUserId', {
    header: 'LINEユーザーID',
    cell: info => <CopyableId icon={<FiUser className="text-blue-500" />} value={info.getValue()} label="ユーザーID" />,
  }),
  columnHelper.accessor('lineMessageId', {
    header: 'LINEメッセージID',
    cell: info => <CopyableId icon={<FiMessageSquare className="text-green-500" />} value={info.getValue()} label="メッセージID" />,
  }),
  columnHelper.accessor('uploadedAt', {
    header: 'アップロード日時',
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
]

export function ImagesTable({ data }: { data: ImageWithUrl[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <Table table={table} />
}
