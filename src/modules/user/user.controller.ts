import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SendResponse } from 'src/common/response/send-response';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Query() query: any) {
    const users = await this.userService.getAll(query);
    return SendResponse.success(users, 'Get all users successful');
  }

  @Get(':id')
  async getOneUser(@Param('id') id: number) {
    const user = await this.userService.getOne(id);
    return SendResponse.success(user, 'Get detail user successful');
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return SendResponse.success([], 'Create user successful');
  }

  @Put()
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    const user = await this.userService.update(id, body);
    return SendResponse.success([], 'Update user successful');
  }
}
