/*import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Importe o serviço que acessa o banco de dados

@Injectable()
export class OrderNotFoundGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orderId = Number(request.params.id); // Obtém o id do pedido da URL (request.params.id)

    // Verifica se o pedido existe no banco de dados
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId }, // A consulta verifica se o pedido existe com esse ID
    });

    if (!order) {
      throw new NotFoundException('Order not found'); // Lança uma exceção se o pedido não for encontrado
    }

    return true; // Permite que a requisição prossiga se o pedido for encontrado
  }
}*/