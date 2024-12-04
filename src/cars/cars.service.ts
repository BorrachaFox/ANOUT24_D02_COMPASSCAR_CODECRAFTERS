import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCarDTO } from "./dto/create-car.dto";

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarDto: CreateCarDTO) {
    const existingCar = await this.prisma.car.findFirst({
        where: {
          plate: createCarDto.plate,
          status: 'ACTIVE',
        },
      });

    if (existingCar) {
      throw new ConflictException('There is already a car with that same license plate.');
    }
    return await this.prisma.car.create({ data: createCarDto });
  }
}