import CalendarItem from './CalendarItem';
import { useEffect, useState } from 'react';

import { FiBookOpen } from 'react-icons/fi';

const listaLouvores = require('./utils/louvores.json');
const versiculos = require('./utils/versiculos.json');
const hinos = require('./utils/selecaohinos.json');

export default function App() {
  const [louvoresTocador, setLouvoresTocador] = useState([]);
  const [tipoLouvor, setTipoLouvor] = useState('');
  const tocadores = ['Andre', 'Thiago', 'Warley', 'Rhuan'];
  const [tocador, setTocador] = useState('');
  const [obs, setObs] = useState([]);

  var moment = require('moment');
  var data_hora_atual = new Date();

  const numDaSemanaNoAno = moment(data_hora_atual).startOf('isoWeek').format('ww');

  useEffect(() => {
    buscaTocador(tocador, tipoLouvor);
  }, [tocador, tipoLouvor]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setObs([
  //       {
  //         titulo: 'Reunião',
  //         mensagem: 'No domingo do dia 07/01, após o culto, teremos uma reunião para tratarmos do ano de 2024 '
  //       }
  //     ]);
  //   }, 7000);
  // }, []);

  // Musicos
  const musicos = {
    instrumentistas: {
      sexta: ['Wesley', 'Warley'],
      psh: ['Thiago', 'Rhuan', 'Thiago', 'Rhuan', 'Thiago'], // COM CHUVA,
      // psh: ['Thiago', 'Andre', 'Warley', 'Rhuan', '[ Escolher ]'], // SEM CHUVA
      ebd: ['Annes']
    },

    vocalistas: {
      oracaoedoutrina: ['Lidiane', 'Laís', 'Edvan'],
      psh: [
        ['Fernanda', 'Thabata'],
        ['Fernanda', 'Thabata'],
        ['Fernanda', 'Thabata'],
        ['Fernanda', 'Thabata'],
        ['Fernanda', 'Thabata']
      ], // COM CHUVA
      // psh: [['Wilson', 'Paulinha'], ['Kelviane', 'Fernanda'], ['Edmilson', 'Fernanda'], ['Lidiane', 'Duda', 'Laís'], [('Fernanda', 'Paulinha')]], // SEM CHUVA
      ebd: ['Wilson', 'Paulinha']
    }
  };

  // Revesamento do guitarrista com base no numero da semana
  // Revesamento de guitarrista para o domingo a noite
  const tocadorPSH = musicos.instrumentistas.psh[numeroDaSemana() - 1];
  const tocadorIbav = numeroDaSemana() % 2 === 0 ? 'Andre' : 'Thiago';

  const buscaLouvores = (tipo, tocador, numDaSemanaNoAno) => {
    const index = numDaSemanaNoAno - 1;
    const listaTipo = listaLouvores.filter((item) => item.tipo === tipo);
    const listatocador = listaTipo.filter((item) => item.tocadores?.indexOf(tocador) > -1);

    // const posicao = index - Math.floor(index / listatocador.length) * listatocador.length;
    const posicao = (numDaSemanaNoAno - 1) % listatocador.length;
    return listatocador[posicao] || '[ Livre Escolha ]';
  };

  const escalas = [
    // Doutrina / Oração
    {
      status: true, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximaSexta(),
      culto: 'Doutrina / Oração',
      louvores: [buscaLouvores('preludio', 'Warley', numDaSemanaNoAno), buscaLouvores('primeiromomento', 'Warley', numDaSemanaNoAno)],
      vocalistas: musicos.vocalistas.oracaoedoutrina,
      instrumentistas: musicos.instrumentistas.sexta
    },

    // EBD
    {
      status: false, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximoDomingo(),
      culto: numeroDeDomingosMes() === numeroDaSemana() ? 'EBD com Ceia' : 'EBD',
      louvores: [],
      vocalistas: musicos.vocalistas.ebd,
      instrumentistas: musicos.instrumentistas.ebd
    },

    // Culto de Louvor e Pregação
    {
      status: true, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximoDomingo(),
      culto: 'Louvor e Pregação',
      louvores: [buscaLouvores('preludio', tocadorIbav, numDaSemanaNoAno), buscaLouvores('primeiromomento', tocadorIbav, numDaSemanaNoAno), buscaLouvores('comunhao', tocadorIbav, numDaSemanaNoAno)],
      hcc: hinos[numDaSemanaNoAno],
      vocalistas: ['Edmilson', 'Edvan', ...VozesFemininas()],
      instrumentistas: ['Wesley', 'Annes', tocadorIbav]
    },

    // Culto PSH
    {
      status: true, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximoSabado(),
      culto: 'PSH',
      louvores: [
        buscaLouvores('preludio', tocadorPSH, numDaSemanaNoAno),
        buscaLouvores('primeiromomento', tocadorPSH, numDaSemanaNoAno + 1),
        buscaLouvores('comunhao', tocadorPSH, numDaSemanaNoAno + 2)
      ],
      vocalistas: musicos.vocalistas.psh[numeroDaSemana() - 1],
      instrumentistas: musicos.instrumentistas.psh[numeroDaSemana() - 1]
    },
    // ________________________________________

    {
      data: converteData('29/12/2023'),
      culto: 'Culto Oração Especial',
      louvores: [''],
      vocalistas: ['Edvan', 'Laís', 'Lidiane'],
      instrumentistas: ['Wesley', 'Warley']
    },
    {
      data: converteData('24/12/2023'),
      culto: 'Culto Especial Natal',
      louvores: ['Bom estarmos aqui', 'Isaias 9', 'Nada além do sangue', 'Agnus Dei', 'CC 30 - Noite de paz'],
      vocalistas: ['Edmilson', 'Edvan', 'Fernanda', 'Laís', 'Paulinha'],
      instrumentistas: ['Wesley', 'Warley', 'Andre', 'Annes']
    },
    {
      data: converteData('31/12/2023'),
      culto: 'Culto Especial Ano Novo',
      louvores: ['Renova-me', 'Nada além do sangue', 'Agnus Dei', 'CC 560 - Ano Novo', 'CC 456 - O Estandarte'],
      vocalistas: ['Wilson', 'Kelviane', 'Duda', 'Lidiane', 'Paulinha'],
      instrumentistas: ['Wesley', 'Andre', 'Thiago', 'Annes']
    }
  ];

  // Seleção de vozes femininas para louvor e pregação
  function VozesFemininas() {
    const vozes = ['Fernanda', 'Paulinha', 'Lais', 'Kelviane', 'Lidiane', 'Thabata'];
    const sequencia = [
      [0, 2],
      [1, 4],
      [2, 1],
      [3, 5],
      [4, 0],
      [5, 3]
    ];

    const posicao = (numDaSemanaNoAno - 1) % sequencia.length;
    const selecao = sequencia[posicao].map((index) => vozes[index]);
    return selecao;
  }

  //Converte data String em data Date
  function converteData(inData) {
    // Divide a string da data em dia, mês e ano
    const [day, month, year] = inData.split('/');

    // Criar um objeto de data JavaScript com o dia, mês e ano
    const data = new Date(year, month - 1, day);
    return data;
  }

  // Encontre o próximo dia que seja sexta-feira
  function proximaSexta() {
    let now = new Date();
    let nextFriday = new Date(now.getTime());
    while (nextFriday.getDay() !== 5) {
      nextFriday.setDate(nextFriday.getDate() + 1);
    }
    return nextFriday;
  }

  // Encontre o próximo dia que seja sexta-feira
  function proximoSabado() {
    let now = new Date();
    let nextFriday = new Date(now.getTime());
    while (nextFriday.getDay() !== 6) {
      nextFriday.setDate(nextFriday.getDate() + 1);
    }

    return nextFriday;
  }

  // Encontre o próximo dia que seja domingo
  function proximoDomingo() {
    let now = new Date();
    let nextSunday = new Date(now.getTime());
    while (nextSunday.getDay() !== 0) {
      nextSunday.setDate(nextSunday.getDate() + 1);
    }
    return nextSunday;
  }

  function numeroDaSemana() {
    // Retorna o número da semana com base na data atual
    let today = new Date();
    let primeiroDiaDoMes = new Date(today.getFullYear(), today.getMonth(), 1);
    let diasPassadosDoMes = today.getDate() - 1;
    let numeroDaSemana = Math.ceil((diasPassadosDoMes + primeiroDiaDoMes.getDay() + 1) / 7);
    return numeroDaSemana;
  }

  function numeroDeDomingosMes() {
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

  // Coloca as datas em ordem cronologica
  const ordenaEscala = escalas.sort((a, b) => {
    return moment(a.data) - moment(b.data);
  });

  // Busca o Tocador com base no tipo de louvor
  function buscaTocador(tocador, tipo) {
    const louvorEncontrado = listaLouvores.filter((louvor) => louvor.tocadores?.includes(tocador) && louvor.tipo === tipo);
    setLouvoresTocador(louvorEncontrado);
  }

  function SorteiaVersiculo() {
    const index = Math.floor(Math.random() * versiculos.length);

    return (
      <div style={{ padding: 18, background: '#f9f9f9', borderRadius: 12 }}>
        <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center' }}>
          <FiBookOpen size={24} />
          <label style={{ fontStyle: 'italic', fontWeight: 300, color: '#000', marginLeft: 12 }}>{versiculos[index].ref}</label>
        </div>
        <label style={{ fontStyle: 'italic', fontWeight: 300, color: '#000' }}>{versiculos[index].texto}</label>
      </div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      {obs.length > 0 ? (
        <div style={{ position: 'fixed', background: '#00000099', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ width: '75%', background: '#fff', borderRadius: 6, padding: '18px 18px 50px 18px' }}>
            {obs.map((item, index) => {
              return (
                <div key={index} style={{ margin: '18px 0' }}>
                  <div style={{ textAlign: 'center', fontWeight: 400, fontSize: 20 }}>{item.titulo}</div>
                  <div style={{ fontWeight: 300, textAlign: 'center', margin: 10, fontSize: 16 }}>{item.mensagem}</div>
                </div>
              );
            })}
          </div>

          <div
            onClick={() => setObs([])}
            style={{
              borderRadius: 99,
              background: '#58731e',
              padding: '15px',
              marginTop: -25,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
              fontFamily: 'monospace'
            }}
          >
            FECHAR
          </div>
        </div>
      ) : null}

      <div style={{ marginBottom: 20, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#000', margin: 0 }}>
          ESCALA DE LOUVOR<span style={{ fontSize: 24, color: '#ddd', fontWeight: 800 }}> #S{numDaSemanaNoAno}</span>
        </h1>
        <span style={{ fontWeight: 300, fontSize: 12 }}>IGREJA BATISTA ÁRVORE DA VIDA</span>
      </div>

      <div style={{ padding: '0 18px' }}>{SorteiaVersiculo()}</div>

      <div style={{ padding: 18, marginTop: 20 }}>
        <div style={{ marginBottom: 50 }}>
          <label style={{ margin: '10px' }}>Encontre Louvores</label>
          <div style={{ display: 'flex', margin: '6px 0', gap: 6 }}>
            <select style={{ fontSize: 15, width: '50%', background: '#fff', height: 40, padding: '0 18px', borderRadius: 6, outline: 'none' }} onChange={(e) => setTocador(e.target.value)}>
              <option>Tocador</option>
              {tocadores.map((tocador, index) => (
                <option key={index}>{tocador}</option>
              ))}
            </select>

            {tocador ? (
              <select style={{ fontSize: 15, width: '50%', background: '#fff', padding: '0 18px', height: 40, borderRadius: 6, outline: 'none' }} onChange={(e) => setTipoLouvor(e.target.value)}>
                <option>Momento</option>
                <option value={'preludio'}>Prelúdio</option>
                <option value={'primeiromomento'}>Primeiro Momento</option>
                <option value={'comunhao'}>Comunhão</option>
                <option value={'ceia'}>Ceia</option>
              </select>
            ) : null}
          </div>

          <div style={{ margin: 18 }}>
            {louvoresTocador.map((louvor, index) => {
              return (
                <div key={index} style={{ fontSize: 15, fontWeight: 300, alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                  - {louvor?.louvor}
                  {louvor?.tom ? <span style={{ fontWeight: 600, marginLeft: 20, color: '#795548' }}> ♪ {louvor?.tom}</span> : null}
                </div>
              );
            })}
          </div>
        </div>

        {ordenaEscala.map((scale, index) => (
          <CalendarItem key={index} data={scale} />
        ))}

        <p style={{ textAlign: 'center', marginTop: 50, fontWeight: 300 }}>Ministério de Louvor Adonai</p>
      </div>
    </div>
  );
}
