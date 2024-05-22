import React from 'react';
import styles from './TabMissiles.module.scss';
import { IBase } from '../../@types/IBase.interface';
import { useStore } from '../../store/store';
import { IMissile } from '../../@types/IMissile.interface';
//=========================================================================================================================

function TabMissiles() {
    const { setMissileCoords, deleteMissileCoord, setMissiles, missilesCoords } = useStore();

    const [output, setOutput] = React.useState<IMissile[]>([]);

    const handleChange = (checked: boolean, obj: IMissile) => {
        if (checked) {
            setMissileCoords(obj)
        } else {
            deleteMissileCoord(obj.ident)
        }
    }

    const onFilter = (type: '90th Missile Wing' | '91th Missile Wing' | '341th Missile Wing' | '') => {
        if (type === '') setMissiles(output);
        if (type !== '') setMissiles(output.filter(obj => obj.unit === type));
    }

    React.useEffect(() => {
        const getOutput = async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/missiles`);
            const data = await response.json();
            setOutput(data)
        }
        getOutput();
    }, [])

    return (
        <div className={styles.box}>
            <div className={styles.head}>
                <button className={`${styles.button} ${styles.all}`} onClick={() => onFilter('')}>ВСЕ</button>
                <button className={styles.button} onClick={() => onFilter('90th Missile Wing')}>90 крыло МБР</button>
                <button className={styles.button} onClick={() => onFilter('91th Missile Wing')}>91 крыло МБР</button>
                <button className={styles.button} onClick={() => onFilter('341th Missile Wing')}>341 крыло МБР</button>
            </div>
            <div className={styles.body}  >
                {output.map(obj => (
                    <div key={obj.ident} className={`${styles.item}`}>
                        <input type='checkbox' checked={Boolean(missilesCoords.find(item => item.ident === obj.ident))} onChange={(e) => handleChange(e.target.checked, obj)} />
                        <span className={styles.type}>{obj.unit} - </span>
                        <span className={styles.name}>{obj.point}</span>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default TabMissiles;
