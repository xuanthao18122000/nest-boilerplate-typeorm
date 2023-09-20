import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendResponse } from 'src/common/response/send-response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/database/entities';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/auth.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('2. Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() body: SignInDto) {
    const data = await this.authService.signIn(body);
    return SendResponse.success(data, 'Sign in user successful!');
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    const user = await this.authService.signUp(body);
    return SendResponse.success(user.serialize(), 'Sign up user successful!');
  }

  @Post('sign-out')
  @ApiBearerAuth()
  async signOut(@GetUser() user: User) {
    this.authService.signOut(user);
    return SendResponse.success([], 'Sign out user successful!');
  }

  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@GetUser() user: User) {
    return SendResponse.success(
      user.serialize(),
      'Get profile user successful!',
    );
  }

  @Put('profile')
  @ApiBearerAuth()
  async updateProfile(@Body() body: UpdateProfileDto, @GetUser() user: User) {
    const updatedUser = await this.authService.updateProfile(body, user);
    return SendResponse.success(
      updatedUser.serialize(),
      'Update profile user successful!',
    );
  }
}
