import {
  ParseIntPipe,
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe
  implements PipeTransform<string, Promise<number | undefined>>
{
  private readonly parseIntPipe = new ParseIntPipe();

  async transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Promise<number | undefined> {
    if (value === undefined || value === '') {
      return undefined;
    }

    try {
      return await this.parseIntPipe.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Validation failed (numeric string is expected)',
        );
      }
      throw error;
    }
  }
}
