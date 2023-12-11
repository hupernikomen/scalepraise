import { useEffect, useState } from 'react';
import './estilo.css'
import moment from 'moment';
const escala = require('../utils/praisesList.json')

const praisesList = require('../utils/praisesList.json')

export default function CalendarItem({ data }) {

    const guitarists = ["André", "Thiago", "Warley", "Rhuan"]
    const [clicked, setClicked] = useState(false)
    const [guitarist, setGuitarist] = useState('')
    const [praisesGuitarist, setPraisesGuitarist] = useState([])
    const [typePraise, setTypePraise] = useState('')


    useEffect(() => {
        filterPraises(guitarist, typePraise)
    }, [guitarist, typePraise])


    const weekNumber = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
    if (moment(data.date).isBefore(moment(), 'day')) { return null }


    // Busca hino do cantor cristao com base no numero
    function getNameCC(num) {
        for (let i = 0; i < praisesList.length; i++) {
            if (praisesList[i]?.num === num) return praisesList[i].name;
        }
        return null; // caso não encontre, retorna null
    }


    // Busca o Tocador com base no tipo de louvor
    function filterPraises(guitar, type) {
        const filteredPraises = escala.filter(
            (praise) => praise.guitar?.includes(guitar) && praise.type === type
        );
        setPraisesGuitarist(filteredPraises.map(praise => praise.name));
    }



    return (
        <div className='container'>
            <div className='top'>
                <h1 className='title' style={{ color: data.cult === "PSH" ? "#795548" : '#00796B' }}>{data.cult}</h1>

                <div className='date'>
                    <span style={{ fontSize: 16, fontWeight: 600, color: data.cult === "PSH" ? "#795548" : '#00796B' }}>{weekNumber[moment(data.date).day()]}</span>
                    <span style={{ fontSize: 11, fontWeight: 400, marginTop: 1, marginRight: 2, color: "#00000070" }}>{moment(data.date).format('DD/MM')}</span>
                </div>

            </div>
            <div onClick={() => setClicked(!clicked)} style={{ display: 'grid', marginBottom: 12, gap: 2 }}>
                {data.praises.map((pray, index) => {
                    return <label key={index} style={{ fontSize: 15, fontWeight: 300 }}>- {pray} {index === 0 && data.cult === 'Louvor e Pregação' ? ' [ Prelúdio ]' : ''}</label>
                })}

                {data.hcc?.map((hcc, index) => {
                    return <label key={index} style={{ fontSize: 15, fontWeight: 300 }}>CC {hcc} - {getNameCC(hcc)} </label>
                })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', borderWidth: .5, borderTop: '1px solid #aaa', paddingTop: 12, gap: 6 }}>

                {data.vocals?.concat(data?.instrumentalists).map((musician, index) => {
                    return <strong key={index} style={{ fontSize: 15, fontWeight: 300 }}>{musician}</strong>
                })}

            </div>

            {clicked ? <div style={{ marginTop: 12 }}>
                <div style={{display:'flex',gap:12}}>

                    <select  style={{ height: 28,padding:'0px 6px', borderRadius: 6, backgroundColor: '#fff' }} onChange={(e) => setGuitarist(e.target.value)}>
                        {guitarists.map((guitarist) => (
                            <option>{guitarist}</option>
                        ))}
                    </select>

                    <select style={{ height: 28,padding:'0px 6px', borderRadius: 6, backgroundColor: '#fff' }} onChange={(e) => setTypePraise(e.target.value)}>
                        <option value={'prelude'}>Prelúdio</option>
                        <option value={'firstmoment'}>Primeiro Momento</option>
                        <option value={'communion'}>Comunhão</option>
                    </select>
                </div>

                <div style={{marginTop:12}}>
                    {praisesGuitarist.map((praise) => {
                        return (
                            <div style={{fontSize: 15, fontWeight: 300}}>- {praise}</div>
                        )
                    })}
                </div>
            </div> : null}
        </div>
    )
}