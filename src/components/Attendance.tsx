import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { format } from 'date-fns'

const Attendance = ({ attendances }: {attendances: []}) => {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold
    });
    
    const AttendanceItem = ({ attendance }: Record<string, any>) => {
        return (
            <View key={attendance.id} style={tw`flex flex-row justify-between py-2`}>
                <View style={tw`flex w-1/12 mr-3 items-center`}>
                    <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_400Regular'}]}>{attendance.id}</Text>
                </View>
                <View style={tw`w-4/12`}>
                    <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_400Regular'}]}>{format(attendance.checkin, 'MM/dd/yyyy')}</Text>
                </View>
                <View style={tw`w-4/12`}>
                    <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_400Regular'}]}>{attendance.status ? format(attendance.checkin, 'h:mma') : 'N/A'}</Text>
                </View>
                <View style={tw`w-3/12`}>
                    {attendance.status ? (
                        <Text style={[tw`text-[14px] text-[#079649]`, {fontFamily: 'Inter_400Regular'}]}>Present</Text>
                    ) : (
                        <Text style={[tw`text-[14px] text-[#D70F0F]`, {fontFamily: 'Inter_400Regular'}]}>Absent</Text>
                    )}
                </View>
            </View>
        )
    }
    return (
        <FlatList 
            data={attendances} 
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => <AttendanceItem attendance={item} key={index} />} 
        /> 
    )
}

export default Attendance

const styles = StyleSheet.create({})