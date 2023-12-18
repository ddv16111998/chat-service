import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../entities/mysql/user.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3307,
            username: 'docker',
            password: 'secret',
            database: 'database',
            synchronize: false,
            autoLoadEntities: false,
            entities: [User]
        }),
    ],
    exports: [TypeOrmModule],
})
export class MysqlModule {}