import { lazy } from 'react'

const Home = lazy(() => import('containers/Home'))

const home = [
  {
    path: '/',
    component: Home,
    exact: true
  }
]

export default home
