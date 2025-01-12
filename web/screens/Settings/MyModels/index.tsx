import { useCallback, useMemo, useState } from 'react'

import { useDropzone } from 'react-dropzone'

import { LlmEngines } from '@janhq/core'
import { Button, ScrollArea } from '@janhq/joi'

import { useAtomValue, useSetAtom } from 'jotai'
import { UploadCloudIcon } from 'lucide-react'

import { twMerge } from 'tailwind-merge'

import BlankState from '@/containers/BlankState'

import ModelSearch from '@/containers/ModelSearch'

import useDropModelBinaries from '@/hooks/useDropModelBinaries'

import ModelItem from './ModelItem'

import { MainViewState, mainViewStateAtom } from '@/helpers/atoms/App.atom'
import { downloadedModelsAtom } from '@/helpers/atoms/Model.atom'

const MyModels = () => {
  const setMainViewState = useSetAtom(mainViewStateAtom)
  const downloadedModels = useAtomValue(downloadedModelsAtom)
  const { onDropModels } = useDropModelBinaries()
  const [searchText, setSearchText] = useState('')

  const filteredDownloadedModels = useMemo(
    () =>
      downloadedModels
        .filter((m) =>
          m.model.toLowerCase().includes(searchText.toLowerCase().trim())
        )
        .sort((a, b) => a.model.localeCompare(b.model)),
    [downloadedModels, searchText]
  )

  const { getRootProps, isDragActive } = useDropzone({
    noClick: true,
    multiple: true,
    onDrop: onDropModels,
  })

  const onSearchChange = useCallback((input: string) => {
    setSearchText(input)
  }, [])

  return (
    <div {...getRootProps()} className="h-full w-full">
      <ScrollArea className="h-full w-full">
        {isDragActive && (
          <div className="absolute z-50 mx-auto h-full w-full bg-[hsla(var(--app-bg))]/50 p-8 backdrop-blur-lg">
            <div
              className={twMerge(
                'flex h-full w-full items-center justify-center rounded-lg border border-dashed border-[hsla(var(--app-border))]'
              )}
            >
              <div className="mx-auto w-1/2 text-center">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <UploadCloudIcon size={24} />
                </div>
                <div className="mt-4 ">
                  <h6 className="font-bold">Drop file here</h6>
                  <p className="mt-2">File (GGUF) or folder</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="m-4 rounded-xl">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <div className="w-full sm:w-[300px]">
              <ModelSearch onSearchLocal={onSearchChange} />
            </div>
            {/* <Button
              variant="outline"
              theme="ghost"
              onClick={onImportModelClick}
            >
              <UploadIcon size={16} className="mr-2" />
              <p>Import Model</p>
            </Button> */}
          </div>

          {!filteredDownloadedModels.length ? (
            <>
              {searchText.length > 0 ? (
                <BlankState
                  title="No search results found"
                  description="You need to download model"
                  action={
                    <Button
                      className="mt-4"
                      onClick={() => setMainViewState(MainViewState.Hub)}
                    >
                      Explore The Hub
                    </Button>
                  }
                />
              ) : (
                <BlankState
                  title="Model not found"
                  description="You need to download your first model"
                  action={
                    <Button
                      className="mt-4"
                      onClick={() => setMainViewState(MainViewState.Hub)}
                    >
                      Explore The Hub
                    </Button>
                  }
                />
              )}
            </>
          ) : (
            <div className="relative w-full">
              {LlmEngines.map((engine) => {
                const modelByEngine = filteredDownloadedModels.filter(
                  (x) => x.engine === engine
                )

                if (modelByEngine.length === 0) return null

                return (
                  <div className="my-6" key={engine}>
                    <div className="flex flex-col items-start justify-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h6 className="text-base font-semibold capitalize">
                        {engine}
                      </h6>
                    </div>
                    <div className="mt-2">
                      {modelByEngine.map((model) => (
                        <ModelItem key={model.model} model={model} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default MyModels
