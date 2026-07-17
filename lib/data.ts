/** Retorna a data de hoje zerada (00:00:00) para usar como chave em RegistroPonto.data (@db.Date). */
export function hojeSemHora(): Date {
  const agora = new Date();
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
}

export function dataSemHora(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}
