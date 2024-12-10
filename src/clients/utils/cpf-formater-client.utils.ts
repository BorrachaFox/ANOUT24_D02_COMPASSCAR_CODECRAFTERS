export class CPFDocumentUtils {
  static formatCPF(CPF: string): string {
    return CPF.replace(/\D/g, '');
  }
}
