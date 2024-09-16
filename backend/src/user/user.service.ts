import { Injectable , HttpException, HttpStatus, BadRequestException, ConflictException} from '@nestjs/common';
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
  ) {}

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
      user_permission: '1',
    });

    await this.userRepository.save(newUser);
    return 'User registered';
  }
  

  async login(user_name: string, user_pass: string) {
    // Find user by user_name or user_email
    const user = await this.userRepository.findOne({
      where: [{ user_name }, { user_email: user_name }],
    });

    // Check if user exists
    if (!user) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    // Compare passwords
    const match = await bcrypt.compare(user_pass, user.user_pass);
    if (!match) {
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_name: user.user_name,
        user_permission: user.user_permission,
      },
      'itkmitl', // JWT secret key (same as Express)
      { expiresIn: '30d' }, // Token expiration (30 days)
    );

    // Return response in the same format as Express
    return {
      message: 'Login successful',
      userToken: token,
      name_user: user.user_name,
    };
  }

  async getUserProfile(token: string) {
    const decodedToken = jwt.verify(token, 'itkmitl') as any;

    return await this.userRepository.findOne({
      where: { user_name: decodedToken.user_name },
    });
  }

  async updateUser(id: string, data: any, userId: number, password: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const match = await bcrypt.compare(password, user.user_pass);

    if (!match) {
      throw new Error('Invalid password');
    }

    if (id === 'user_name' || id === 'user_email') {
      const column = id === 'user_name' ? 'user_name' : 'user_email';
      const existingUser = await this.userRepository.findOne({
        where: { [column]: data },
      });

      if (existingUser) {
        throw new Error(`${column === 'user_name' ? 'Username' : 'Email'} already exists`);
      }
    }

    if (id === 'user_pass') {
      data = await bcrypt.hash(data, 8);
    }

    await this.userRepository.update(userId, { [id]: data });

    const updatedUser = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    const token = jwt.sign(
      {
        user_id: updatedUser.user_id,
        user_name: updatedUser.user_name,
        user_permission: updatedUser.user_permission,
      },
      'itkmitl',
      { expiresIn: '30d' },
    );

    return { token, userName: updatedUser.user_name };
  }
  async validateToken(token: string) {
    try {
      const user = jwt.verify(token, 'itkmitl');
      
      // If successful, return the user's name and valid status
      return { valid: true, name: user.user_name };
    } catch (error) {
      // Return false if token is invalid
      return { valid: false, name: '' };
    }
  }
}
