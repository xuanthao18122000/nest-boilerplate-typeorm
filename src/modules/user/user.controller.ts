import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { SendResponse } from 'src/common/response/send-response';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './dto/user.dto';
import {
  ExistedCreateUserResponse,
  NotFoundDetailUserResponse,
  SuccessCreateUserResponse,
  SuccessDetailUserResponse,
  SuccessListUserResponse,
  SuccessUpdateUserResponse,
} from './response';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('3. Users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng' })
  @ApiOkResponse(SuccessCreateUserResponse)
  @ApiConflictResponse(ExistedCreateUserResponse)
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return SendResponse.success(user.serialize(), 'Create user successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng' })
  @ApiOkResponse(SuccessListUserResponse)
  async getAll(@Query() query: ListUserDto, @Res() response: Response) {
    const users = await this.userService.getAll(query);
    if (query.download) {
      const fileBuffer = await this.userService.exportUsers(users.list);
      return SendResponse.downloadExcel('users', fileBuffer, response);
    }
    return SendResponse.success(users, 'Get all users successful!', response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết người dùng' })
  @ApiOkResponse(SuccessDetailUserResponse)
  @ApiNotFoundResponse(NotFoundDetailUserResponse)
  async getOneUser(@Param('id') id: number) {
    const user = await this.userService.getOne(id);
    return SendResponse.success(user, 'Get detail user successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  @ApiOkResponse(SuccessUpdateUserResponse)
  @ApiNotFoundResponse(NotFoundDetailUserResponse)
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    const user = await this.userService.update(id, body);
    return SendResponse.success(user.serialize(), 'Update user successful!');
  }
}
