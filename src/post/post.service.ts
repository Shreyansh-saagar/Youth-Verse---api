import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { postDto } from './post-dto/post.dto';
import { updateDto } from './update-dto/update.dto';

@Injectable()
export class PostService {

    constructor(private _prisma: PrismaService){}

    async getAllPost():Promise<any>{
        try {
            const allPost = await this._prisma.post.findMany({include:{user:true}})
            if(!allPost){
                throw new NotFoundException('posts not found')
            }
            return {allPost}
        } catch (error) {
            throw error
        }
    }

    async getSinglePost(id: string): Promise<any>{
        try {
            const singlePost = await this._prisma.post.findUnique({
                where:{id}, include:{user:true}
            })
            if(!singlePost){
                throw new NotFoundException('post not found')
            }
            return {singlePost}
        } catch (error) {
            throw error
        }
    }

    async createPost(postDto: postDto,id:string,image?:string):Promise<any>{
        try {
            const {title,desc,topics,related} = postDto
            const createdPost = await this._prisma.post.create({
                data:{
                    title,
                    desc,
                    image:image?image:null,
                    related,
                    topics,
                    userId:id
                }
            })
            return {createdPost}
        } catch (error) {
            throw error
        }
    }

    async updatePost(postId: string, updateDto: updateDto, userId: string): Promise<any> {
        try {
          console.log('Received updateDto:', updateDto);
          const { title, desc, topics, related } = updateDto;
          const existingPost = await this._prisma.post.findUnique({ where: { id: postId } });
      
          console.log('Existing post:', existingPost);
          if (!existingPost) {
            throw new NotFoundException('Post not found');
          }
      
          if (existingPost.userId !== userId) {
            throw new ForbiddenException('You are not allowed to access this');
          }
      
          const updatedPost = await this._prisma.post.update({
            where: { id: postId },
            data: {
              title: title || existingPost.title,
              desc: desc || existingPost.desc,
              topics: topics || existingPost.topics,
              related: related || existingPost.related
            }
          });
      
          console.log('Updated post:', updatedPost);
          return updatedPost;
        } catch (error) {
          console.error('Error updating post:', error);
          throw error;
        }
      }


      async deletePost(postId: string, userId: string): Promise<any> {
        const existingPost = await this._prisma.post.findUnique({ where: { id: postId } });
    
        if (!existingPost) {
          throw new NotFoundException('Post not found');
        }
    
        if (existingPost.userId !== userId) {
          throw new ForbiddenException('You are not allowed to access this');
        }
    
        await this._prisma.post.delete({ where: { id: postId } });
    
        return { message: 'Post deleted successfully' };
      }

}
