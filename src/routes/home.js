import { lazy } from 'react'

const Home = lazy(() => import('containers/Home'))

const home = [
    {
        title: 'Jean Souza - Front-End Engineer',
        description: 'Specialist in technologies for the creation of web applications.',
        path: '/',
        Component: Home
    }
]

export default home