import { StyleSheet, View } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import QRCodeScanner from '@/components/QRCodeScanner'
import { StatusBar } from 'expo-status-bar'

const ScannerScreen = () => {
    return (
        <View style={[tw`flex-1 relative`]}>
            <StatusBar style='light' />
            <QRCodeScanner />
        </View>
    )
}

export default ScannerScreen

const styles = StyleSheet.create({})