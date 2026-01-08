import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.product.count({ where: { available: true }}),
      this.prisma.product.findMany({
        skip: Math.max(0, skip),
        take: limit,
        orderBy: { id: 'asc' },
      }),
    ]);
    const lastPage = Math.ceil(total / limit);

    return {
      data: await this.prisma.product.findMany({
        skip: Math.max(0, (page - 1) * limit),
        take: limit,
        where: {
          available: true
        },
        // Ordenamos en forma ascendente
        orderBy: {
          id: 'asc',
        },
      }),
      meta: {
        total: total,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: id , available: true},
    });
    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
