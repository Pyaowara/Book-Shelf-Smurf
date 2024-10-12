import { Injectable, HttpException, HttpStatus, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async register(userDetails: Partial<User>) {
    const { user_email, user_name, user_pass, user_phone } = userDetails;

    if (!user_email || !user_name || !user_pass || !user_phone) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { user_name },
        { user_email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const passwordHash = await bcrypt.hash(user_pass, 8);
    const newUser = this.userRepository.create({
      ...userDetails,
      user_pass: passwordHash,
      user_permission: '3',
      user_image: 'https://i.imgur.com/tdrsXyg.jpeg',
    });

    await this.userRepository.save(newUser);
    return 'User registered';
  }

  async login(user_name: string, user_pass: string) {
    const user = await this.userRepository.findOne({
      where: [{ user_name }, { user_email: user_name }],
    });

    if (!user) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(user_pass, user.user_pass);
    if (!match) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_name: user.user_name,
        user_permission: user.user_permission,
      },
      'itkmitl', // JWT secret key (same as Express)
      { expiresIn: '30d' }, // Token expiration (30 days)
    );

    return {
      message: 'Login successful',
      userToken: token,
      name_user: user.user_name,
    };
  }

  async getUserProfile(token: string) {
    try {
      if (token != '') {
        const decodedToken = jwt.verify(token, 'itkmitl') as any;
        if (!decodedToken.user_name) {
          throw new UnauthorizedException('Invalid token');
        }
        const user = await this.userRepository.findOne({
          where: { user_name: decodedToken.user_name },
        });
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        return user;
      }
      return;
    } catch (error) {
      console.error('Error in getUserProfile:', error.message, error.stack);

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token is malformed or invalid');
      }

      throw new UnauthorizedException('Failed to get user profile');
    }
  }

  async getUserProfileById(userName: string) {
    const user = await this.userRepository.findOne({ where: { user_name: userName } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUser(id: string, data: any, userId: number, password: string) {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const match = await bcrypt.compare(password, user.user_pass);
    if (!match) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    if (id === 'user_name' || id === 'user_email') {
      const column = id === 'user_name' ? 'user_name' : 'user_email';
      const existingUser = await this.userRepository.findOne({ where: { [column]: data } });

      if (existingUser) {
        throw new HttpException(
          `${column === 'user_name' ? 'Username' : 'Email'} already exists`,
          HttpStatus.CONFLICT,
        );
      }
    }
    if (id === 'user_pass') {
      data = await bcrypt.hash(data, 8);
    }

    await this.userRepository.update(userId, { [id]: data });

    const updatedUser = await this.userRepository.findOne({ where: { user_id: userId } });

    const token = jwt.sign(
      {
        user_id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        user_permission: updatedUser.user_permission,
      },
      'itkmitl',
      { expiresIn: '30d' },
    );

    return {
      message: 'User information updated successfully',
      userToken: token,
      name_user: updatedUser.user_name,
    };
  }

  async validateToken(token: string) {
    try {
      const user = jwt.verify(token, 'itkmitl');

      return { valid: true, name: user.user_name };
    } catch (error) {
      return { valid: false, name: '' };
    }
  }

  async getUserId(token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    try {
      const decoded = jwt.verify(token, 'itkmitl') as any;
      return { userId: decoded.user_id };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
