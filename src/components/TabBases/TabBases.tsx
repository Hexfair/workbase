import React from 'react';
import styles from './TabBases.module.scss';
import { IBase } from '../../@types/IBase.interface';
import { useStore } from '../../store/store';
//=========================================================================================================================

function TabBases() {
    const { setBaseCoords, deleteBaseCoord, setBases, basesCoords } = useStore();

    const [output, setOutput] = React.useState<IBase[]>([]);

    const handleChange = (checked: boolean, obj: IBase) => {
        if (checked) {
            setBaseCoords(obj)
        } else {
            deleteBaseCoord(obj.ident)
        }
    }

    const getTypeBase = (type: 'navalBase' | 'airBase' | 'armyBase') => {
        if (type === 'airBase') return 'ВВС США -'
        if (type === 'navalBase') return 'ВМС США -'
        if (type === 'armyBase') return 'СВ США -'
    }

    const onFilter = (type: 'navalBase' | 'airBase' | 'armyBase' | '') => {
        if (type === '') setBases(output);
        if (type !== '') setBases(output.filter(obj => obj.datatype === type));
    }

    React.useEffect(() => {
        const getOutput = async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bases`);
            const data = await response.json();
            setOutput(data)
        }
        getOutput();
    }, [])

    return (
        <div className={styles.box}>
            <div className={styles.head}>
                <button className={`${styles.button} ${styles.all}`} onClick={() => onFilter('')}>ВСЕ</button>
                <button className={styles.button} onClick={() => onFilter('armyBase')}>СВ США</button>
                <button className={styles.button} onClick={() => onFilter('airBase')}>ВВС США</button>
                <button className={styles.button} onClick={() => onFilter('navalBase')}>ВМС США</button>
            </div>
            <div className={styles.body}  >
                {output.map(obj => (
                    <div key={obj.ident} className={`${styles.item}`}>
                        <input type='checkbox' checked={Boolean(basesCoords.find(item => item.ident === obj.ident))} onChange={(e) => handleChange(e.target.checked, obj)} />
                        <span className={styles.type}>{getTypeBase(obj.datatype)}</span>
                        <span className={styles.name}>{obj.name}</span>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default TabBases;
