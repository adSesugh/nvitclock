import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScanBarcode } from 'iconsax-react-native'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { getDashboard } from '@/store/staff/actions'
import { useFocusEffect } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'

const StaffHome = ({ navigation }) => {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold
    });
    
    const dispatch = useDispatch<useAppDispatch>()
    const {stats} = useSelector((state: RootState) => state.staff)

    const handleFocus = useCallback(() => {
        dispatch(getDashboard())
    }, [dispatch]);

    useFocusEffect(handleFocus);

    if (!fontsLoaded && !fontError) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size={'small'} color={'#F6F9F7'} />
            </View>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1`}>
            <StatusBar style='dark' />
            <View style={tw`w-full items-center mt-[68px]`}>
                <Text style={[tw`text-center text-[20px] text-[#021F2C]`, {fontFamily: 'Inter_500Medium'}]}>Dashboard</Text>
            </View>
            <View style={tw`items-center mt-[100px] h-[99px]`}>
                <Text style={[tw`text-[64px] text-[#021F2C]`, {fontFamily: 'Inter_600SemiBold'}]}>{stats?.attendance_percentage || 0}%</Text>
                <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Attendance captured today</Text>
            </View>
            <View style={tw`flex items-center w-full`}>
                <View style={tw`flex flex-row justify-between items-center h-[48px] mt-10 px-4 w-11/12`}>
                    <View style={tw`items-center`}>
                        <Text style={[tw`text-[24px] text-[#021F2C]`, {fontFamily: 'Inter_500Medium'}]}>{stats?.attendance || 0}</Text>
                        <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Captured</Text>
                    </View>
                    <View style={tw`items-center`}>
                        <Text style={[tw`text-[24px] text-[#021F2C]`, {fontFamily: 'Inter_500Medium'}]}>{(stats?.student_total || 0 - stats?.attendance || 0) || 0}</Text>
                        <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Students left</Text>
                    </View>
                    <View style={tw`items-center`}>
                        <Text style={[tw`text-[24px] text-[#021F2C]`, {fontFamily: 'Inter_500Medium'}]}>{stats?.student_total || 0}</Text>
                        <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Total students</Text>
                    </View>
                </View>
            </View>
            <View style={tw`items-center mt-24`}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('scanner')}
                    style={tw`items-center justify-center bg-[#EDF0EE] w-[267px] py-2.5 rounded-[100px]`}
                >
                    <View style={tw`flex flex-row gap-x-3 py-1`}>
                        <ScanBarcode size={20} color='#021F2C' variant='Bold' />
                        <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_500Medium'}]}>Scan</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default StaffHome

const styles = StyleSheet.create({})