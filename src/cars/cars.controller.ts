import { Body, ConflictException, Controller, HttpException, Post, UseGuards } from "@nestjs/common";
import { CarsService } from "./cars.service";
import { CreateCarDTO } from "./dto/create-car.dto";
import { UserEmailActiveGuard } from "src/guards/user/user-email-active.guard";

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(UserEmailActiveGuard)
  create(@Body() createCarDto: CreateCarDTO) {
     return this.carsService.create(createCarDto);
  } 
}