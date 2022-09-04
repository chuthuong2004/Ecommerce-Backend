import logger from 'pino'
import dayjs from 'dayjs'
const transport = logger.transport({
    target: 'pino-pretty',
    options: { colorize: true }
  })
const log = logger({
    base: {
        pid:false,
    },
    timestamp: ()=> `,"time":"${dayjs().format()}"`
},transport)
export default log;