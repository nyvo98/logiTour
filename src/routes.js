import DefaultLayout from './containers/DefaultLayout'
import User from './views/User'
import TourGallery from './views/TourGallery'
import Tour from './views/Tour'
import Config from './views/Config'
import CompanyConfig from './views/CompanyConfig'
import TourCreate from './views/TourCreate'
import BookingHistory from './views/BookingHistrory'
import LanguageConfig from './views/LanguageConfig'
import TimelineConfig from './views/TimelineConfig'
import FooterConfig from './views/FooterConfig'
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/user', exact: true, name: 'User', component: User },
  { path: '/tourgallery', exact: true, name: 'TourGallery', component: TourGallery },
  { path: '/tour', exact: true, name: 'Tour', component: Tour },
  { path: '/tourcreate/:id?', exact: true, name: 'TourCreate', component: TourCreate },
  { path: '/config', exact: true, name: 'Config', component: Config },
  { path: '/footerconfig', exact: true, name: 'FooterConfig', component: FooterConfig },
  { path: '/companyconfig', exact: true, name: 'CompanyConfig', component: CompanyConfig },
  { path: '/bookinghistory', exact: true, name: 'BookingHistory', component: BookingHistory },
  { path: '/languageconfig', exact: true, name: 'LanguageConfig', component: LanguageConfig },
  { path: '/timelineConfig', exact: true, name: 'TimelineConfig', component: TimelineConfig }

]

export default routes
