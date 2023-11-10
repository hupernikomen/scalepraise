import moment from 'moment';
const cantor = require('../utils/cantorCristao.json')

export default function CalendarItem({ data }) {

    if (moment(data.date).isBefore(moment(), 'day')) {
        return null;
    }

    function getName(n) {
        for (let i = 0; i < cantor.length; i++) {
            if (cantor[i].n === n) return cantor[i].name;

        }
        return null; // caso não encontre, retorna null
    }


    function Edition() {

    }

    return (
        <div onClick={() => Edition()} style={{ background: '#fff', margin: 12, padding: 18, paddingBottom: 25, borderRadius: 6, boxShadow: '0px 0px 3px #00000015' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -6, flexWrap: 'wrap' }}>

                <h1 style={{ fontSize: 20 }}>{data.cult}</h1>
                <span style={{ fontSize: 14 }}>{moment(data.date).format('DD/MM')}</span>

            </div>
            <div style={{ display: 'grid', marginBottom: 12, gap: 2 }}>

                {data.praises?.map((pray, index) => {
                    return <label key={index} style={{ fontSize: 15 }}>- {pray} {index === 0 && data.cult === 'Louvor e Pregação' ? ' [ Prelúdio ]' : ''}</label>

                })}
                {data.hcc?.map((hcc, index) => {
                    return <label key={index} style={{ fontSize: 15 }}>CC {hcc} - {getName(hcc)} </label>

                })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                {data.vocals.map((vocal, index) => {
                    return <strong key={index} style={{ fontSize: 15, fontWeight: 300, paddingRight: 6 }}>{vocal}</strong>

                })}
            </div>
        </div>
    )
}