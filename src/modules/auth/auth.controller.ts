import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/user.decorator';
import { SendResponse } from 'src/common/response/send-response';
import { User } from 'src/database/entities';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UpdateProfileDto } from './dto/auth.dto';
import {
  ExistedRegisterResponse,
  NotFoundLoginResponse,
  SuccessGetProfileResponse,
  SuccessLoginResponse,
  SuccessLogoutResponse,
  SuccessRegisterResponse,
  SuccessUpdateProfileResponse,
  WrongPasswordLoginResponse,
} from './response';

@ApiTags('2. Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @ApiOkResponse(SuccessLoginResponse)
  @ApiNotFoundResponse(NotFoundLoginResponse)
  @ApiBadRequestResponse(WrongPasswordLoginResponse)
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  async signIn(@Body() body: SignInDto) {
    const data = await this.authService.signIn(body);
    return SendResponse.success(data, 'Sign in user successful!');
  }

  @Public()
  @Post('sign-up')
  @ApiOkResponse(SuccessRegisterResponse)
  @ApiConflictResponse(ExistedRegisterResponse)
  @ApiOperation({ summary: 'Đăng ký người dùng' })
  async signUp(@Body() body: SignUpDto) {
    const user = await this.authService.signUp(body);
    return SendResponse.success(user.serialize(), 'Sign up user successful!');
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất người dùng' })
  @ApiOkResponse(SuccessLogoutResponse)
  async signOut(@GetUser() user: User) {
    this.authService.signOut(user);
    return SendResponse.success([], 'Sign out user successful!');
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse(SuccessGetProfileResponse)
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  async getProfile(@GetUser() user: User) {
    return SendResponse.success(
      user.serialize(),
      'Get profile user successful!',
    );
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOkResponse(SuccessUpdateProfileResponse)
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  async updateProfile(@Body() body: UpdateProfileDto, @GetUser() user: User) {
    const updatedUser = await this.authService.updateProfile(body, user);
    return SendResponse.success(
      updatedUser.serialize(),
      'Update profile user successful!',
    );
  }
}
