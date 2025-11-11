import { useState, useEffect } from "react";
import { Accelerometer, Magnetometer, DeviceMotion } from 'expo-sensors';
import { StyleSheet } from "react-native"; 
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from "@/components/themed-text";

const INIT_VALUE = { x: 0, y: 0, z: 0, timestamp: 0 }

export default function Sensors() {
    const [accel, setAccel] = useState(INIT_VALUE);
    const [mag, setMag] = useState(INIT_VALUE);
    const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 })
    const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
    const [lastStamp, setLastStamp] = useState(0);
    const [heading, setHeading] = useState(0);

    useEffect(() => {

        let accelSub: any, magSub: any;
        const askPermissions = async () => {
            await Accelerometer.requestPermissionsAsync();
            await Magnetometer.requestPermissionsAsync();

            const isAccel = await Accelerometer.isAvailableAsync();
            const isMag = await Magnetometer.isAvailableAsync();

            if ( isAccel ) accelSub = Accelerometer.addListener(data => setAccel(data));
            if ( isMag ) magSub = Magnetometer.addListener(data => setMag(data));
        }

        askPermissions();

        return () => {
            if ( accelSub ) accelSub.remove();
            if ( magSub ) magSub.remove();
        }
    }, []);

    useEffect(() => {
        setHeading(Math.atan2(mag.y, mag.x) * (180 / Math.PI));
    }, [mag.x, mag.y, mag.z]);


    useEffect(() => {

        

        // if (lastStamp === 0) {
        //     setLastStamp(accel.timestamp);
        //     return;
        // }

        // const deltaT = (accel.timestamp - lastStamp) / 1000;
        // setLastStamp(accel.timestamp);

        // let vX = velocity.x + (accel.x - grav.x) * deltaT;
        // let vY = velocity.y + (accel.y - grav.y) * deltaT;
        // let vZ = velocity.z + (accel.z - grav.z) * deltaT;

        // if (Math.abs(vX - velocity.x) < 1e-3) {
        //     vX = 0;
        // }
        // if (Math.abs(vY - velocity.y) < 1e-3) {
        //     vY = 0;
        // }
        // if (Math.abs(vZ - velocity.z) < 1e-3) {
        //     vZ = 0;
        // }
        // setVelocity({ x: vX, y: vY, z: vZ })

        // let deltaX = vX * deltaT;
        // let deltaY = vY * deltaT;
        // let deltaZ = vZ * deltaT;

        // setPos(prev => ({
        //     x: prev.x + deltaX,
        //     y: prev.y + deltaY,
        //     z: prev.z + deltaZ
        // }));


    }, [accel])

    return (
        <ThemedView style={styles.container}>

            <ThemedText> Accel: {JSON.stringify(accel, null, 2)}</ThemedText>
            <ThemedText> Mag: {JSON.stringify(mag, null, 2)}</ThemedText>
            <ThemedText> Heading: {heading}</ThemedText>
            <ThemedText> Pos: {JSON.stringify(pos, null, 2)}</ThemedText>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});