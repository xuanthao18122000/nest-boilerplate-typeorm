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
import { UserService } from './user.service';
import {
  SuccessCreateUserResponse,
  ExistedCreateUserResponse,
  SuccessListUserResponse,
  SuccessDetailUserResponse,
  NotFoundDetailUserResponse,
  SuccessUpdateUserResponse,
} from './response';

@ApiBearerAuth()
@ApiTags('3. Users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiOkResponse(SuccessCreateUserResponse)
  @ApiConflictResponse(ExistedCreateUserResponse)
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return SendResponse.success(user.serialize(), 'Create user successful!');
  }

  @Get()
  @ApiOperation({ summary: 'List Users' })
  @ApiOkResponse(SuccessListUserResponse)
  async getAll(@Query() query: ListUserDto, @Res() response: Response) {
    const users = await this.userService.getAll(query);
    return SendResponse.success(users, 'Get all users successful!', response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Details User' })
  @ApiOkResponse(SuccessDetailUserResponse)
  @ApiNotFoundResponse(NotFoundDetailUserResponse)
  async getOneUser(@Param('id') id: number) {
    const user = await this.userService.getOne(id);
    return SendResponse.success(user, 'Get detail user successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiOkResponse(SuccessUpdateUserResponse)
  @ApiNotFoundResponse(NotFoundDetailUserResponse)
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    const user = await this.userService.update(id, body);
    return SendResponse.success(user.serialize(), 'Update user successful!');
  }
}
