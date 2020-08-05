import { lazy } from 'react'

const Social = lazy(() => import('containers/Social'))

const social = [
  {
    title: 'Social | Jean Souza - Front-End Engineer',
    path: '/social',
    Component: Social
  }
]

export default social
