import {Server as NetServer} from 'http'
import { NextApiRequest } from 'next'
import {Server as ServerIO} from 'socket.io'

import { NextApiResponseServerIo } from '@/types'
export const config = {
  api :{
    bodyParser: false,
  }
}
const IoHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if(!res.socket.server.io){
    const path = `/api/socket/io`;
    const httServer:  NetServer = res.socket.server as any;
    const io = new ServerIO(httServer,{
      path: path,
      addTrailingSlash: false,

    })
    res.socket.server.io = io ;
  }
  res.end()
}
export default IoHandler