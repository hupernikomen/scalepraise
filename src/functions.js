// Encontre o próximo dia que seja sexta-feira
export function proximo(num) {
  let now = new Date();
  let nextDay = new Date(now.getTime());

  while (nextDay.getDay() !== num) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
}

export function numeroDaSemana() {
  // Retorna o número da semana com base na data atual
  let today = new Date();
  let primeiroDiaDoMes = new Date(today.getFullYear(), today.getMonth(), 1);
  let diasPassadosDoMes = today.getDate() - 1;
  let numeroDaSemana = Math.ceil((diasPassadosDoMes + primeiroDiaDoMes.getDay() + 1) / 7);
  return numeroDaSemana;
}

export function numeroDeDomingosMes() {
  // Retorna o número de domingos em um mês específico
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let domingos = 0;

  for (let day = 1; day <= 31; day++) {
    let data = new Date(year, month, day);
    if (data.getMonth() === month && data.getDay() === 0) {
      domingos++;
    }
  }

  return domingos;
}

//Converte data String em data Date
export function converteData(dt) {
  // Divide a string da data em dia, mês e ano
  const [day, month, year] = dt.split('/');

  return new Date(year, month - 1, day);
}
