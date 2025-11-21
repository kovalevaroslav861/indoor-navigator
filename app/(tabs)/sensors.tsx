import { useState, useEffect } from "react";
import { Accelerometer, Magnetometer } from 'expo-sensors';
import { EventSubscription } from "expo-modules-core";
import { StyleSheet } from "react-native";

import { Link } from 'expo-router';

import { View } from "@/components/ui/view";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import Animated from "react-native-reanimated";
import { ScrollView } from "@/components/ui/scroll-view";

const INIT_VALUE = { x: 0, y: 0, z: 0, timestamp: 0 }
Accelerometer.setUpdateInterval(20);
Magnetometer.setUpdateInterval(20);

export default function Sensors() {
    const [accel, setAccel] = useState(INIT_VALUE);
    const [mag, setMag] = useState(INIT_VALUE);
    const [grav, setGrav] = useState(INIT_VALUE);
    const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 })
    const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
    const [lastStamp, setLastStamp] = useState(0);
    const [heading, setHeading] = useState(0);

    const [started, setStarted] = useState(false);

    const [accelSub, setAccelSub] = useState<EventSubscription>();
    const [magSub, setMagSub] = useState<EventSubscription>();

    const askPermissions = async () => {
        await Accelerometer.requestPermissionsAsync();
        await Magnetometer.requestPermissionsAsync();

        const isAccel = await Accelerometer.isAvailableAsync();
        const isMag = await Magnetometer.isAvailableAsync();

        if (isAccel) {
            setAccelSub(Accelerometer.addListener(data => setAccel(data)));
        }
        if (isMag) {
            setMagSub(Magnetometer.addListener(data => setMag(data)));
        }
    }

    const remove = () => {
        if(accelSub) accelSub.remove();
        if(magSub) magSub.remove();
    }

    useEffect(() => {
        if ( lastStamp === 0 ) return;

        let angle = 90 - Math.atan2(mag.y, mag.x) * (180 / Math.PI);
        setHeading( angle < 0 ? angle + 360 : angle);
        setGrav(accel);
    }, [mag.x, mag.y, mag.z]);

    useEffect(() => {
        if (lastStamp === 0) {
            setGrav(accel);
            setLastStamp(accel.timestamp);
            return;
        }

        const deltaT = (accel.timestamp - lastStamp);
        setLastStamp(accel.timestamp);

        let vX = velocity.x + (accel.x - grav.x) * deltaT;
        let vY = velocity.y + (accel.y - grav.y) * deltaT;
        let vZ = velocity.z + (accel.z - grav.z) * deltaT;

        if (Math.abs(vX - velocity.x) < 1e-6) {
            vX = 0;
        }
        if (Math.abs(vY - velocity.y) < 1e-6) {
            vY = 0;
        }
        if (Math.abs(vZ - velocity.z) < 1e-6) {
            vZ = 0;
        }
        setVelocity({ x: vX, y: vY, z: vZ })

        let deltaX = vX * deltaT;
        let deltaY = vY * deltaT;
        let deltaZ = vZ * deltaT;

        setPos(prev => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY,
            z: prev.z + deltaZ
        }));
    }, [accel])


    // handlers for buttons

    const onClickReset = () => {
        setStarted(prev => !prev);
        remove();
        setLastStamp(0);
        setAccel(INIT_VALUE);
        setGrav(INIT_VALUE);
        setMag(INIT_VALUE);
        setHeading(0);
        setPos({x: 0, y: 0, z: 0});
    }

    const onClickStart = () => {
        setStarted(prev => !prev);
        askPermissions();
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={{margin: 5}}> </Text>
            <Animated.Image style={{margin: 'auto', transform: [{ rotate: `${heading}deg`}]}} source={require('@/assets/images/compass.png')}/>
            <Text> Accelerometer: {JSON.stringify(accel, null, 2)}</Text>
            <Text> Magnetometer: {JSON.stringify(mag, null, 2)}</Text>
            <Text> Heading: {heading}</Text>
            <Text> Position: {JSON.stringify(pos, null, 2)}</Text>

            <View style={styles.button_panel} >
                <Button variant='success' disabled={started} style={styles.btn} onPress={onClickStart}>Start</Button>
                <Button variant='destructive' disabled={!started} style={styles.btn} onPress={onClickReset}>Reset</Button>
            </View>
        </ScrollView>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        marginTop: 30
    },
    button_panel: {
        flex: 1,
        display: 'flex'
    },
    btn: {
        margin: 10
    }
})