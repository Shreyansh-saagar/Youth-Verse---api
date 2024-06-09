import { Body, Controller, Get, Param, Patch, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { disk } from 'src/multerOptions';
import { postDto } from './post-dto/post.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { updateDto } from './update-dto/update.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private _jwt: JwtService,
  ) {}

  @Get()
  async getAllPost(
    @Response() res
  ){
    const {allPost} =  await this.postService.getAllPost()
    res.status(200).json({
     allPost
    })
  }

  @Get(':id')
  async getSinglePost(
    @Param('id') id:string,
    @Response() res
  ){
    const {singlePost} =  await this.postService.getSinglePost(id)
    res.status(200).json({
     singlePost
    })
  }

  @Post()
  @UseInterceptors(FileInterceptor('image',disk))
  @UseGuards(JwtGuard)
  async createPost(
    @Request() req,
    @Response() res,
    @UploadedFile() File,
    @Body() postDto: postDto,
    id:string
  ):Promise<any>{
    const decode = await this._jwt.decode(req.cookies['token'])
    id = decode.user;
    const createPost = await this.postService.createPost(postDto,id,File.filename)
    res.status(200).json({
      createPost
    })
  }

  @Patch('/update/:id')
  @UseGuards(JwtGuard)
  async updatePost(
    @Request() req,
    @Response() res,
    @Param('id') postId: string,
    @Body() updateDto: updateDto
  ): Promise<any> {
    try {
      const decoded = await this._jwt.decode(req.cookies['token']);
      const userId = decoded.user;
      const updatedPost = await this.postService.updatePost(postId, updateDto, userId);
      res.status(200).json({
        updatedPost
      });
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
}
