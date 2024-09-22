import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Polyline, Marker, Tooltip, Circle } from 'react-leaflet';
import styles from './MapLeaflet.module.scss';
import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import Recenter from './Plugins/MapRecenter';
import { difOptions, areaOptions, blueOptions, circleIcon, purpleOptions, circleIconBlue, circleSmallIcon, baseArmyIcon, baseAirforceIcon, baseNavyIcon, reservationOptions } from './MapLeaflet.options';
import ClearIcon from '../../assets/icon/clear.svg?react';
import CursorCoordinates from './Plugins/CursorCoordinates/CursorCoordinates';
import LeafletRuler from './Plugins/PolylineMeasure/LeafletRuler';
import { useStore } from '../../store/store';
import { Coordinate } from '../../@types/Coordinate.type';
import MapView from './Plugins/MapView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { polygon } from '@turf/helpers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import turfBooleanWithin from '@turf/boolean-within';
//===========================================================================================================
const MAP_CENTER = { lat: 22.0, lng: -80.00 };
//===========================================================================================================

export default function MapLeaflet() {
    const { fligthCoords, notamCoords, firCoords, areaCoords, basesCoords, missilesCoords, reservationsCoords, reset } = useStore();
    const [dataIntersect, setDataIntersect] = React.useState<Coordinate[][] | null>(null);
    const [viewCoords, setViewCoords] = React.useState<Coordinate[]>([[51, -126], [51, -33], [-14, -33], [-14, -126], [51, -126]]);

    const isNotEmpty = notamCoords.length > 0 || fligthCoords.length > 0 || firCoords || basesCoords.length > 0 || missilesCoords.length > 0;

    const getRecenter = () => {
        if (notamCoords.length > 0) return { lat: notamCoords[0].polygon[0][0][0], lng: notamCoords[0].polygon[0][0][1] };
        if (fligthCoords.length > 0) return { lat: fligthCoords[0].coords[0], lng: fligthCoords[0].coords[1] };
        if (areaCoords.area.length > 0) return { lat: areaCoords.area[0][0][0], lng: areaCoords.area[0][0][1] };
        if (firCoords && firCoords.center.length > 0) return { lat: firCoords.center[0], lng: firCoords.center[1] };
        return MAP_CENTER;
    };

    const getBaseIcon = (type: 'navalBase' | 'airBase' | 'armyBase') => {
        if (type === 'armyBase') return baseArmyIcon;
        if (type === 'airBase') return baseAirforceIcon;
        if (type === 'navalBase') return baseNavyIcon;
    };

    const clearMap = () => {
        reset();
        setDataIntersect(null);
    };

    return (
        <div className={styles.map}>
            <MapContainer center={MAP_CENTER} zoom={4} scrollWheelZoom={true} worldCopyJump >
                <TileLayer url="/map-tiles/{z}/{x}/{y}.png" />
                <Recenter lat={getRecenter().lat} lng={getRecenter().lng} />
                <MapView setViewCoords={setViewCoords} />

                {notamCoords.length > 0 && notamCoords
                    .filter(item => {
                        if (notamCoords.length < 20) {
                            return true;
                        }

                        const poly1 = polygon(item.polygon);
                        const poly2 = polygon([viewCoords]);
                        return turfBooleanWithin(poly1, poly2);
                    })
                    .map(item => (
                        <Polygon
                            key={item.text}
                            pathOptions={purpleOptions}
                            positions={item.polygon.map(obj => obj)}
                        >
                            <Popup children={item.text} />
                            {item.polygon.flat().map((obj, index) =>
                                <Marker key={index} position={obj} icon={circleIcon} />)}
                        </Polygon>))}

                <Polyline pathOptions={blueOptions} positions={fligthCoords.map(obj => [obj.coords[0], obj.coords[1]])} />
                {fligthCoords.length > 0 && fligthCoords.map((obj, index) =>
                    <Marker
                        key={index}
                        position={[obj.coords[0], obj.coords[1]]}
                        icon={(index === 0) || (index === fligthCoords.length - 1) ? circleIcon : circleIconBlue}
                    >
                        <Popup children={`Точка: ${obj.ident}`} />
                    </Marker>)}

                {areaCoords.area.length > 0 &&
                    areaCoords.area.map((item, index) => {
                        if (item.length === 1) {
                            return (
                                <Circle
                                    key={`${index}${item[0]}`}
                                    center={[item[0][0], item[0][1]]}
                                    radius={item[0][2]}
                                    pathOptions={areaOptions}
                                >
                                    <Tooltip sticky>{areaCoords.name}</Tooltip>
                                </Circle>
                            )
                        } else {
                            return (
                                <Polygon
                                    key={`${index}${item[0]}`}
                                    pathOptions={areaOptions}
                                    positions={item.map(obj => obj)}
                                >
                                    <Tooltip sticky>{areaCoords.name}</Tooltip>
                                </Polygon>)
                        }
                    })}

                {reservationsCoords.length > 0 &&
                    reservationsCoords.map((it, index) => {
                        return (
                            it.area.map(item => {
                                if (item.length === 1) {
                                    return (
                                        <Circle
                                            key={`${index}${item[0]}`}
                                            center={[item[0][0], item[0][1]]}
                                            radius={item[0][2]}
                                            pathOptions={reservationOptions}
                                        >
                                            <Tooltip sticky>{it.name}</Tooltip>
                                        </Circle>
                                    )
                                } else {
                                    return (
                                        <Polygon
                                            key={`${index}${item[0]}`}
                                            pathOptions={reservationOptions}
                                            positions={item.map(obj => obj)}
                                        >
                                            <Tooltip sticky>{it.name}</Tooltip>
                                        </Polygon>)
                                }

                            })
                        )
                    })}

                {dataIntersect &&
                    <Polygon
                        pathOptions={difOptions}
                        positions={dataIntersect[0].map(item => ([item[0], item[1]]))}
                    >
                    </Polygon>}

                {firCoords && firCoords.area.length > 0 && firCoords.area
                    .map((item, index) => (
                        <Polygon
                            key={`${index} ${item[0]} ${item[1]}`}
                            pathOptions={areaOptions}
                            positions={item.map(obj => ([obj[0], obj[1]]))}
                        >
                            <Tooltip sticky>{firCoords.icao} - {firCoords.name} ({firCoords.country})</Tooltip>
                        </Polygon>))}

                {basesCoords.length > 0 && basesCoords.map(obj =>
                    <Marker
                        key={obj.ident}
                        position={[obj.coords[0], obj.coords[1]]}
                        icon={getBaseIcon(obj.datatype)}
                    >
                        <Popup children={obj.name} />
                    </Marker>)}

                {missilesCoords.length > 0 && missilesCoords.map(obj =>
                    <Marker
                        key={obj.ident}
                        position={[obj.coords[0], obj.coords[1]]}
                        icon={circleSmallIcon}
                    >
                        <Popup children={`${obj.unit} - ${obj.point}`} />
                    </Marker>)}
                <CursorCoordinates />
                <LeafletRuler />
            </MapContainer>
            {isNotEmpty &&
                <span className={styles.clear} title='Clear All'>
                    <ClearIcon className={styles.icon} onClick={clearMap} />
                </span>}
        </div >
    );
}
