import { memo } from 'react'

import { Button } from '@janhq/joi'
import { useSetAtom } from 'jotai'

import LogoMark from '@/containers/Brand/Logo/Mark'

import CenterPanelContainer from '@/containers/CenterPanelContainer'

import { MainViewState, mainViewStateAtom } from '@/helpers/atoms/App.atom'

const EmptyModel = () => {
  const setMainViewState = useSetAtom(mainViewStateAtom)

  return (
    <CenterPanelContainer>
      <div className="mx-auto flex h-full w-3/4 flex-col items-center justify-center text-center">
        <LogoMark
          className="mx-auto mb-4 animate-wave"
          width={48}
          height={48}
        />
        <h1 className="text-base font-semibold">Welcome!</h1>
        <p className="mt-1 text-[hsla(var(--text-secondary))]">
          You need to download your first model
        </p>
        <Button
          className="mt-4"
          onClick={() => setMainViewState(MainViewState.Hub)}
        >
          Explore The Hub
        </Button>
      </div>
    </CenterPanelContainer>
  )
}

export default memo(EmptyModel)
