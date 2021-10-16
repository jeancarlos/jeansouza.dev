import { lazy } from 'react'

const Video = lazy(() => import('containers/Video'))
const Theme = lazy(() => import('themes/Empty'))

const video = [
  {
    path: '/video',
    component: Video,
    theme: Theme,
    exact: true
  }
]

export default video
