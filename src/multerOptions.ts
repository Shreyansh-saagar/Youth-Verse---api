import { BadRequestException } from '@nestjs/common';
import {diskStorage} from 'multer'
export const disk={
    storage:diskStorage({
        destination:'./public',
        filename:(req,file,cb)=>{
            try {
                const allowedMimeTypes = ['image/jpeg','image/png']
                if(!allowedMimeTypes.includes(file.mimetype)){
                    throw new BadRequestException('Invalid file mime type')
                }
                const uniqueName = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueName)
            } catch (error) {
                console.log(error);
                
            }
        }
    })
}