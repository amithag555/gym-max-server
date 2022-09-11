import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { EnumRole } from '@prisma/client';
import { AuthorizableOriginParameter } from 'src/auth/authorizable-origin-parameter.enum';
import { PrismaService } from 'src/prisma/prisma.service';

export const AUTHORIZE_CONTEXT = 'authorizeContext';
const adminRoles = [EnumRole.ADMIN, EnumRole.RECEPTION, EnumRole.TRAINER];

@Injectable()
export class ControlAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super();
  }

  /**
   * Returns whether the request is authorized to activate the handler
   */

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check context with AuthGuard
    if (!(await super.canActivate(context))) {
      return false;
    }

    const req = this.getRequest(context);
    const handler = context.getHandler();
    const currentUser = req.user;

    const isAdminRoles = adminRoles.includes(currentUser.role);
    const canActivate = this.canActivateRoles(handler, currentUser);

    console.log(currentUser);

    if (!isAdminRoles) {
      return (
        canActivate &&
        (await this.authorizeContext(handler, req.params, currentUser))
      );
    }

    return canActivate;
  }

  // This method is required for the interface - do not delete it.
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private getExpectedRoles(handler: Function): EnumRole[] {
    return this.reflector.get('roles', handler);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  canActivateRoles(handler: Function, currentUser: any): boolean {
    const expectedRoles = this.getExpectedRoles(handler);

    if (expectedRoles) {
      // return expectedRoles.some((role) => currentUser.role.includes(role));
      return expectedRoles.includes(currentUser.role);
    }

    return true;
  }

  private getAuthorizeContextParameter(
    // eslint-disable-next-line @typescript-eslint/ban-types
    handler: Function,
  ): AuthorizableOriginParameter {
    return this.reflector.get('authorizationContext', handler);
  }

  async authorizeContext(
    /* eslint-disable-next-line @typescript-eslint/ban-types */
    handler: Function,
    parameterValue: number,
    user: any,
  ): Promise<boolean> {
    const parameterType = this.getAuthorizeContextParameter(handler);

    if (parameterType === undefined) {
      return true;
    }

    return await this.validateAccess(user, parameterType, parameterValue);
  }

  private async validateAccess(
    user: any,
    parameterType: AuthorizableOriginParameter,
    params: any,
  ): Promise<boolean> {
    let matchCount = 0;

    switch (parameterType) {
      case AuthorizableOriginParameter.TrainingPlanId:
        matchCount = await this.prisma.trainingPlan.count({
          where: {
            id: Number(params.id),
            memberId: user.id,
          },
        });
        break;

      case AuthorizableOriginParameter.GymClassId:
        matchCount = await this.prisma.gymClass.count({
          where: {
            id: Number(params.gymClassId),
            members: {
              some: {
                id: user.id,
              },
            },
          },
        });
        break;

      case AuthorizableOriginParameter.MemberId:
        matchCount = Number(params.memberId || params.id) === user.id ? 1 : 0;
        break;

      case AuthorizableOriginParameter.PlanItemId:
        matchCount = await this.prisma.trainingPlan.count({
          where: {
            memberId: user.id,
            plainItems: {
              some: {
                id: Number(params.id),
              },
            },
          },
        });
        break;

      case AuthorizableOriginParameter.ExerciseId:
        matchCount = await this.prisma.trainingPlan.count({
          where: {
            memberId: user.id,
            plainItems: {
              some: {
                exercises: {
                  some: {
                    id: Number(params.id),
                  },
                },
              },
            },
          },
        });
        break;

      case AuthorizableOriginParameter.WorkoutGoalId:
        matchCount = await this.prisma.workoutGoal.count({
          where: {
            id: Number(params.id),
            memberId: user.id,
          },
        });
        break;

      default:
        break;
    }

    return matchCount === 1;
  }
}
