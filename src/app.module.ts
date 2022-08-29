import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { GymClassModule } from './gym-class/gym-class.module';
import { WorkoutGoalModule } from './workout-goal/workout-goal.module';
import { ClubsModule } from './clubs/clubs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TrainingModule } from './training/training.module';
import { PrismaModule } from './prisma/prisma.module';
import { TrainingPlanModule } from './training-plan/training-plan.module';
import { ControlAuthModule } from './guards/control-auth.module';
import { WorkDayActivityModule } from './work-day-activity/work-day-activity.module';
import { MemberEntryProcessModule } from './member-entry-process/member-entry-process.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    MembersModule,
    GymClassModule,
    WorkoutGoalModule,
    ClubsModule,
    NotificationsModule,
    TrainingModule,
    PrismaModule,
    TrainingPlanModule,
    ControlAuthModule,
    WorkDayActivityModule,
    MemberEntryProcessModule,
  ],
  exports: [ControlAuthModule],
})
export class AppModule {}
