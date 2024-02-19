import { startOfISOWeek, format } from 'date-fns';
import CalendarItem from './CalendarItem';
import { useEffect, useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { proximo, numeroDaSemana, numeroDeDomingosMes, converteData } from './functions';

const listaLouvores = require('./utils/louvores.json');
const versiculos = require('./utils/versiculos.json');
const hinos = require('./utils/selecaohinos.json');

export default function App() {
  const [louvoresPorTocador, setLouvoresPorTocador] = useState([]);
  const [selecaoTipo, setSelecaoTipo] = useState('');
  const [selecaoTocador, setSelecaoTocador] = useState('');
  const [sorteioVersiculo, setSorteioVersiculo] = useState(Math.floor(Math.random() * versiculos.length));

  const tocadores = ['Andre', 'Thiago', 'Warley', 'Rhuan'];
  const [obs, setObs] = useState([]);

  const moment = require('moment');
  const hoje = new Date();
  const contSemana = format(startOfISOWeek(hoje), 'ww');
  const contSemana2 = moment(proximo(5)).startOf('isoWeek').format('ww');

  let tocadorIbav = null;

  useEffect(() => {
    buscaTocador(selecaoTocador, selecaoTipo);
  }, [selecaoTocador, selecaoTipo]);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * versiculos.length);
      setSorteioVersiculo(index);
    }, 8000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Musicos
  const musicos = {
    instrumentistas: {
      sexta: ['Wesley', 'Andre'],
      ebd: ['Annes', 'Andre', 'Wesley']
    },
    vocalistas: {
      oracaoedoutrina: ['Lidiane', 'Duda', 'Edvan'],
      psh: [
        ['Edmilson', 'Fernanda'],
        ['Lidiane', 'Laís', 'Edvan'],
        ['Kelviane', 'Fernanda'],
        ['Wilson', 'Paulinha'],
        ['Convite', 'Convite']
      ],
      ebd: ['Fernanda', 'Paulinha']
    }
  };
  if (contSemana % 2) {
    tocadorIbav = 'Thiago';
  } else {
    tocadorIbav = 'Andre';
  }

  const buscaLouvores = (tipo, tocador, numDaSemanaNoAno) => {
    const listaTipo = listaLouvores.filter((item) => item.tipo === tipo);
    const listatocador = listaTipo.filter((item) => item.tocadores?.indexOf(tocador) > -1);
    const posicao = (numDaSemanaNoAno - 1) % listatocador.length;

    return listatocador[posicao] || 'Maranata';
  };

  const tocadorPSH = 'Rhuan';
  const escalas = [
    {
      culto: 'Doutrina / Oração',
      data: proximo(5),
      louvores: [buscaLouvores('preludio', 'Andre', contSemana), buscaLouvores('comunhao', 'Andre', contSemana + 1)],
      vocalistas: musicos.vocalistas.oracaoedoutrina,
      instrumentistas: musicos.instrumentistas.sexta,
      status: moment(proximo(5)).startOf('isoWeek').format('ww') === contSemana
    },
    {
      data: proximo(0),
      culto: numeroDeDomingosMes() === numeroDaSemana() ? 'EBD com Ceia' : 'EBD',
      louvores: ['CC 132 - Rude Cruz', 'Corpo e Familia', 'Porque Ele Vive'],
      vocalistas: musicos.vocalistas.ebd,
      instrumentistas: musicos.instrumentistas.ebd,
      status: moment(proximo(0)).startOf('isoWeek').format('ww') === contSemana
    },
    {
      culto: 'Louvor e Pregação',
      data: proximo(0),
      louvores: [buscaLouvores('preludio', tocadorIbav, contSemana + 2), buscaLouvores('primeiromomento', tocadorIbav, contSemana + 3), buscaLouvores('comunhao', tocadorIbav, contSemana + 4)],
      hcc: hinos[parseInt(contSemana)],
      vocalistas: ['Edmilson', 'Edvan', ...VozesFemininas()],
      instrumentistas: ['Wesley', 'Annes', tocadorIbav],
      status: moment(proximo(0)).startOf('isoWeek').format('ww') === contSemana
    },
    {
      culto: 'PSH',
      data: proximo(6),
      louvores: [
        buscaLouvores('preludio', tocadorPSH, contSemana),
        buscaLouvores('primeiromomento', tocadorPSH, contSemana + 1),
        buscaLouvores('comunhao', tocadorPSH, contSemana + 2),
        buscaLouvores('comunhao', tocadorPSH, contSemana + 3)
      ],
      vocalistas: musicos.vocalistas.psh[0], // ALTERAR INDICE
      instrumentistas: [tocadorPSH, 'Annes'], // ALTERAR NOMES
      status: moment(proximo(6)).startOf('isoWeek').format('ww') === contSemana
    },
    // ________________________________________

    {
      data: converteData('10/3/2024'),
      culto: 'Culto das Mulheres - EBD',
      louvores: ['Te agradeço - (Diante do Trono)', 'Poder Pra Salvar'],
      vocalistas: ['Fernanda', 'Kelviane'],
      instrumentistas: ['Annes', 'André', 'Wesley']
    }
    // {
    //   data: converteData('20/1/2024'),
    //   culto: 'PSH',
    //   louvores: [buscaLouvores('preludio', 'Andre', contSemana + 1), buscaLouvores('primeiromomento', 'Andre', contSemana + 1), buscaLouvores('comunhao', 'Andre', contSemana + 12)],
    //   vocalistas: ['Fernanda', 'Kelviane'],
    //   instrumentistas: ['Andre']
    // }
  ];

  // Busca o Tocador com base no tipo de louvor
  function buscaTocador(tocador, tipo) {
    const louvores = listaLouvores.filter((louvor) => louvor.tocadores?.includes(tocador) && louvor.tipo === tipo);
    setLouvoresPorTocador(louvores);
  }

  // Coloca as datas em ordem cronologica
  const ordenaEscala = escalas.sort((a, b) => {
    return moment(a.data) - moment(b.data);
  });

  // Seleção de vozes femininas para louvor e pregação
  function VozesFemininas() {
    const voz1 = ['Lais', 'Paulinha', 'Kelviane', 'Fernanda', 'Lidiane'];
    const voz2 = ['Lais', 'Lidiane', 'Kelviane'];

    let i1 = (contSemana - 1) % voz1.length;
    let i2 = (contSemana - 1) % voz2.length;

    // Impede repetição de vozes
    if (voz1[i1] === voz2[i2]) {
      i1++;
    }

    let vozList = [voz1[i1], voz2[i2]];

    if (vozList.indexOf('Paulinha') === -1) {
      vozList.push('Paulinha');
    }

    return vozList;
  }

  function SorteiaVersiculo() {
    return (
      <div style={{ padding: 18, background: '#58731e' }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
          <FiBookOpen size={16} color="#FFF" />
          <label style={{ fontSize: 20, fontWeight: 600, color: '#FFF', marginLeft: 12 }}>{versiculos[sorteioVersiculo].ref}</label>
        </div>
        <label style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: '#FFF' }}>{versiculos[sorteioVersiculo].texto}</label>
      </div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      {obs.length > 0 ? (
        <div style={{ position: 'fixed', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
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

      <div
        style={{
          position: 'sticky',
          top: 0,
          boxShadow: '1px 0px 5px #00000070',
          backgroundColor: '#ffffff99',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 75
        }}
      >
        <div style={{ width: '100vw', height: 75, background: '#fff', opacity: 0.7 }} />
        <div style={{ position: 'absolute' }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#000', margin: 0 }}>ESCALA DE LOUVOR #{contSemana}</h1>
          <span style={{ fontWeight: 300, fontSize: 12, marginTop: 3 }}>IGREJA BATISTA ÁRVORE DA VIDA</span>
        </div>
      </div>

      <div>{SorteiaVersiculo()}</div>

      <div style={{ padding: 18, marginTop: 20 }}>
        <div style={{ fontWeight: 300, fontSize: 15, marginBottom: 6, marginLeft: 12 }}>Busque Louvores:</div>
        <div style={{ marginBottom: 30, background: '#f1f1f1', padding: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <select
              style={{ fontWeight: 300, fontSize: 15, width: '45%', background: '#fff', height: 40, padding: '0 12px', borderRadius: 6, outline: 'none' }}
              onChange={(e) => setSelecaoTocador(e.target.value)}
            >
              <option>Quem tocará?</option>
              {tocadores.map((tocador, index) => (
                <option key={index}>{tocador}</option>
              ))}
            </select>

            {selecaoTocador ? (
              <select
                style={{ fontWeight: 300, fontSize: 15, width: '55%', background: '#fff', padding: '0 12px', height: 40, borderRadius: 6, outline: 'none' }}
                onChange={(e) => setSelecaoTipo(e.target.value)}
              >
                <option>Qual momento?</option>
                <option value={'preludio'}>Prelúdio</option>
                <option value={'primeiromomento'}>Primeiro Momento</option>
                <option value={'comunhao'}>Comunhão</option>
                <option value={'ceia'}>Ceia</option>
              </select>
            ) : null}
          </div>

          <div style={{ margin: 18 }}>
            {louvoresPorTocador.map((louvor, index) => {
              return (
                <div key={index} style={{ fontWeight: 300, alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                  - {louvor?.louvor}
                  {louvor?.tom ? <span style={{ fontWeight: 300, marginLeft: 20, color: '#795548' }}> ♪ {louvor?.tom}</span> : null}
                </div>
              );
            })}
          </div>
        </div>

        {ordenaEscala.map((scale, index) => {
          return <CalendarItem key={index} data={scale} />;
        })}

        <p style={{ textAlign: 'center', marginTop: 50, fontWeight: 300 }}>Ministério de Louvor Adonai</p>
      </div>
    </div>
  );
}
