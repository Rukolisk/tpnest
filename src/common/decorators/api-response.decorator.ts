import { applyDecorators, HttpCode, SetMetadata } from '@nestjs/common';

export function ApiCreated() {
  return applyDecorators(
    HttpCode(201),
    SetMetadata('response_message', 'Resource created successfully'),
  );
}

export function ApiNoContent() {
  return applyDecorators(
    HttpCode(204),
    SetMetadata('response_message', 'Resource deleted successfully'),
  );
}
