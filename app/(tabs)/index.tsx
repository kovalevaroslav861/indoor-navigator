import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Input } from '@/components/ui/input'
import { View } from '@/components/ui/view'
import { StyleSheet, TextInputChangeEvent } from "react-native"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ProfileState, profileSlice } from "@/store/profileSlice"
import { AppDispatch, RootState } from "@/store"

const { actions } = profileSlice;

export default function Settings({ }) {

  const profile = useSelector<RootState, ProfileState>( store => store.profile, shallowEqual);
  const dispatch = useDispatch<AppDispatch>();

  const { x, y, scale, angle } = profile;

  const onChangeX = (text: string) => {
    let newX = Number.parseFloat(text);
    dispatch(actions.move({x: newX, y}));
  }

  const onChangeY = (text: string) => {
    let newY = Number.parseFloat(text);
    dispatch(actions.move({y: newY, x}));
  }

  const onChangeScale = (text: string) => {
    let newScale = Number.parseFloat(text);
    dispatch(actions.zoom({ scale: newScale }));
  }

  const onChangeAngle = (text: string) => {
    let newAngle = Number.parseFloat(text);    
    dispatch(actions.rotate({ angle:  newAngle}));
  }

  return (
    <View style={styles.container}>
      <Text>Enter your initial position.</Text>
      <Input label='X' placeholder='' value={x.toFixed(2)} onChangeText={onChangeX}/>
      <Input label='Y' placeholder='' value={y.toFixed(2)} onChangeText={onChangeY}/>

      <Text>Enter your rate between digital map and real one.</Text>
      <Input label='Scale' placeholder='' inputMode='decimal' value={scale.toFixed(2)} onChangeText={onChangeScale}/>

      <Text>Enter your pan.</Text>
      <Input label='Angle' placeholder='' value={angle.toFixed(2)} onChangeText={onChangeAngle}/>
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 40,
    display: 'flex',
    gap: 10
  }
});