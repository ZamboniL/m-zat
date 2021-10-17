import { Injectable } from '@nestjs/common';
import { DomainException } from 'common/exception';
import { PrismaService } from 'prisma.service';

@Injectable()
export class SlugService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateSlug(title: string): Promise<{ slug: string }> {
    const slug = this.formatSuggestion(title);
    await this.checkIfAlreadyInUse(slug);

    return { slug };
  }

  async checkIfAlreadyInUse(slug: string): Promise<boolean> {
    const foundSlug = await this.prismaService.bucket.findUnique({
      where: { slug },
    });

    if (foundSlug) {
      throw new DomainException('Slug escolhida já esta em uso.', {
        suggestions: this.generateAlternatives(slug),
      });
    }

    return false;
  }

  private formatSuggestion(slug: string): string {
    return slug
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^A-Za-z-]+/g, '');
  }

  private generateAlternatives(slug: string): string[] {
    const alterinatives = [
      this.appendRandomTag(slug),
      this.appendRandomTag(slug),
      this.appendRandomTag(slug),
    ];

    return alterinatives;
  }

  private appendRandomTag(slug: string): string {
    return slug + '-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
  }
}
