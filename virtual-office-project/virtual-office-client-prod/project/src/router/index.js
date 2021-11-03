import Vue from 'vue'
import VueRouter from 'vue-router'
import DefaultLayout from '../components/templetes/layout/DefaultLayout'
import EventBoard from '../components/templetes/dashboard/EventBoard'
import InvitedEventBoard from '../components/templetes/dashboard/InvitedEventBoard'
import EntranceLayout from '../components/templetes/layout/EntranceLayout'
import EntrancePage from '../pages/EntrancePage'
import CreateEventPage from '../pages/CreateEventPage'
import NoEventPage from '../pages/NoEventPage'
import EventListPage from '../pages/EventListPage'
import OfficePage from '../pages/OfficePage'
import InvitedEventsPage from '../pages/InvitedEvents'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'EntranceLayout',
        component: EntranceLayout,
        redirect: '/entrance',
        props: true,
        children: [{
            path: '/entrance',
            name: 'Entrance',
            component: EntrancePage
        }, ]
    },
    {
        path: '/dashBoard',
        name: 'DefaultLayout',
        component: DefaultLayout,
        props: true,
        redirect: '/dashBoard/event',
        children: [{
                path: 'event',
                name: 'EventBoard',
                component: EventBoard,
                props: true,
                children: [{
                        path: 'no-event',
                        name: 'NoEventPage',
                        component: NoEventPage,
                        props: true,
                    },
                    {
                        path: 'create',
                        name: 'CreateEventPage',
                        component: CreateEventPage,
                        props: true,
                    },
                    {
                        path: 'list',
                        name: 'EventListPage',
                        component: EventListPage,
                        props: true,
                    },
                    {
                        path: 'office',
                        name: 'OfficePage',
                        component: OfficePage,
                        props: true,
                    },
                ]
            },
            {
                path: 'invited-events',
                name: 'InvitedEventBoard',
                component: InvitedEventBoard,
                props: true,
                children: [{
                        path: 'event-list',
                        name: 'InvitedEventsPage',
                        component: InvitedEventsPage,
                        props: true,
                    },
                    {
                        path: 'shared-office',
                        name: 'SharedOfficePage',
                        component: OfficePage,
                        props: true,
                    },
                ]
            },
        ],
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    store.dispatch("commonStore/setNowPagePath", to.name)
    store.dispatch("commonStore/setBeforePagePath", from.name)
    next()
})

export default router