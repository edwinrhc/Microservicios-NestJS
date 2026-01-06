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
      this.prisma.product.count(),
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
      where: { id: id },
    });
    if(!product){
      throw new NotFoundException(`Product with id #${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
