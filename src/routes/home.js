import { lazy } from 'react'

const Home = lazy(() => import('containers/Home'))
const Theme = lazy(() => import('themes/DefaultTheme'))

const home = [
  {
    path: '/',
    component: Home,
    theme: Theme,
    exact: true
  }
]

export default home
