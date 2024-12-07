/*import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import axios from 'axios'; // ou qualquer outra biblioteca para fazer requisições HTTP
import { Observable } from 'rxjs';

@Injectable()
export class CepValidationGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    const cep = request.body.cep; // Recupera o CEP do corpo da requisição (request.body)

    if (!cep) {
      return true; // Caso o CEP não seja fornecido, permite continuar a requisição
    }

    // Valida o CEP com a API do ViaCEP
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (response.data.erro) {
        throw new BadRequestException('CEP inválido');
      }

      // Atualiza os campos UF, Cidade e Taxa de locação conforme a API do ViaCEP
      request.body.uf = response.data.uf;
      request.body.cidade = response.data.localidade;

      // (Suponha que você tenha uma lógica para atualizar a "taxa de locação" com base no CEP)

      return true;
    } catch (error) {
      throw new BadRequestException('Erro ao validar o CEP');
    }
  }
}
*/