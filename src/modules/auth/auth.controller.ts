import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { IAzureExpressUser } from 'src/common/interfaces';
import { Public } from 'src/submodules/common/decorators/public.decorator';
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { ISuccessResponse } from 'src/submodules/common/interfaces';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import { AuthService } from './auth.service';
import {
  FireBaseDto,
  SignInDto,
  SignUpDto,
  UpdateProfileDto,
} from './dto/auth.dto';
import { AzureADGuard } from './strategies/azure-ad.strategy';

@ApiTags('2. Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in-email')
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  async signIn(@Body() body: SignInDto) {
    const data = await this.authService.signIn(body);
    return SendResponse.success(data, 'Sign in user successful!');
  }

  @Public()
  @Post('sign-in')
  @ApiBearerAuth()
  @UseGuards(AzureADGuard)
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  async signInAzure(@Req() req: Request) {
    const data = await this.authService.signInAzure(
      req.user as IAzureExpressUser,
    );
    return SendResponse.success(data, 'Sign in user successful!');
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Đăng ký người dùng' })
  async signUp(@Body() body: SignUpDto): Promise<ISuccessResponse<User>> {
    const user = await this.authService.signUp(body);
    return SendResponse.success(user.serialize(), 'Sign up user successful!');
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất người dùng' })
  async signOut(@GetUser() user: User): Promise<ISuccessResponse<[]>> {
    this.authService.signOut(user);
    return SendResponse.success([], 'Sign out user successful!');
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  async getProfile(@GetUser() visitor: User): Promise<ISuccessResponse<User>> {
    const user = await this.authService.getProfile(visitor.id);
    return SendResponse.success(user, 'Get profile user successful!');
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @GetUser() visitor: User,
  ): Promise<ISuccessResponse<User>> {
    const user = await this.authService.updateProfile(body, visitor.id);
    return SendResponse.success(user, 'Update profile user successful!');
  }

  @Put('firebase/register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng ký firebase token' })
  async registerFirebase(
    @Body() body: FireBaseDto,
    @GetUser() user: User,
  ): Promise<ISuccessResponse<[]>> {
    await this.authService.registerFirebase(body, user.id);
    return SendResponse.success([], 'Register firebase successful!');
  }

  @Put('firebase/logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất firebase token' })
  async logoutFirebase(@GetUser() user: User): Promise<ISuccessResponse<[]>> {
    await this.authService.logoutFirebase(user.id);
    return SendResponse.success([], 'Logout firebase successful!');
  }
}
