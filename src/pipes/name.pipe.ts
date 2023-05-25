import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

interface UserInfo {
  name: string;
  age: number;
}

@Injectable()
export class UserTransFromPipe implements PipeTransform {
  /**
   * 管道接口，可以对数据进行转换和验证
   * @param value 对应
   * @param metadata
   * @returns
   */
  transform(value: UserInfo, metadata: ArgumentMetadata) {
    console.log('传入', value);

    return this.parseUserInfo(value);
  }

  /**
   * 转换 age 为整形
   * @param user
   * @returns
   */
  private parseUserInfo(user: UserInfo) {
    const newsAge = Number(user.age);
    if (isNaN(newsAge)) throw new Error('age is not number');
    return {
      ...user,
      age: Number(user.age),
    };
  }
}
