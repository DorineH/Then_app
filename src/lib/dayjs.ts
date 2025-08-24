import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/fr';


dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);
dayjs.locale('fr');


export { dayjs };