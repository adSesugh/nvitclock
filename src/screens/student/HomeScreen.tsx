import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { actualAttendance, cancelButton, defaultStokeColor, errorColor, expectedAttendance } from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Easing } from 'react-native-reanimated'
import { BottomSheetModal, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet'
import CircularProgress from 'react-native-circular-progress-indicator'
import tw from 'twrnc'
import CustomBackdrop from '@/components/CustomBackDrop'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { Image } from 'expo-image';
import { getProfile, userQrCode } from '@/store/common'
import { studentDashboard } from '@/store/student/actions'
import { useFocusEffect } from '@react-navigation/native'
import Attendance from '@/components/Attendance'
import { setCloseModal } from '@/store/reducers/actions/modal'
import { StatusBar } from 'expo-status-bar'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'

const HomeScreen = () => {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold
    });
    
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '64%'], []);
    const qrCodesnapPoints = useMemo(() => ['50%', '50%'], []);
    const [action, setAction] = useState<string|undefined>(undefined)
    const { dashboard } = useSelector((state: RootState) => state.student)
    const { photo } = useSelector((state: RootState) => state.auth)
    const { profile, qrCode, loading } = useSelector((state: RootState) => state.common)
    const dispatch = useDispatch<useAppDispatch>()

    const handleFocus = useCallback(() => {
        dispatch(studentDashboard())
    }, [dispatch]);

    useFocusEffect(handleFocus);

    const handleClosePress = () => bottomSheetModalRef.current.close()

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 250,
        easing: Easing.exp,
    });

    const handlePresentModal = useCallback(() => {
        // dispatch(setCloseModal(handleClosePress))
        bottomSheetModalRef.current?.present();
    }, []);

  
    const handleProfile = () => {
        setAction('profile')
        dispatch(getProfile()).unwrap().then((res) => {
            if(res){
                handlePresentModal()
            }
        })
    }

    const handleQrCode = () => {
        setAction('qrCode')
        dispatch(userQrCode()).unwrap().then((res) => {
            if(res){
                handlePresentModal()
            }
        })
    }

    if (!fontsLoaded && !fontError) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size={'small'} color={'#F6F9F7'} />
            </View>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 w-full`}>
            <StatusBar style='dark' />
            <View style={tw`flex flex-row justify-between items-center px-3 mt-[25px] h-[36px]`}>
                <TouchableOpacity onPress={handleProfile}>
                    <Image source={photo ? { uri: photo } : require('assets/avatar.svg')} style={[tw`rounded-[25]`, {height: 40, width: 40}]} />
                </TouchableOpacity>
                <View>
                    <Text style={[tw`text-[20px]`, {fontFamily: 'Inter_500Medium'}]}>Dashboard</Text>
                </View>
                <TouchableOpacity onPress={handleQrCode}>
                    <Image source={require('assets/qrcode.svg')} style={[{width: 40, height: 40}]} />
                </TouchableOpacity>
            </View>
            <View style={tw`flex justify-center items-center w-full mt-16 relative`}>
                <CircularProgress
                    value={dashboard?.attendance_performance ?? 0}
                    radius={115}
                    progressValueColor={'#000'}
                    activeStrokeColor={dashboard?.attendance_performance >= 70 ? actualAttendance : errorColor}
                    inActiveStrokeColor={defaultStokeColor}
                    inActiveStrokeOpacity={0.8}
                    inActiveStrokeWidth={20}
                    activeStrokeWidth={20}
                    valueSuffix='%'
                    progressValueFontSize={40} 
                    progressValueStyle={{
                        marginTop: -25
                    }} 
                />
                <View style={tw`flex absolute top-33 justify-center items-center`}>
                    <Text style={[tw`text-[14px] ${dashboard?.attendance_performance >= 70 ? 'text-['+actualAttendance+']' : 'text-['+errorColor+']'}`, {fontFamily: 'Inter_400Regular'}]}>{dashboard?.attendance_performance >= 70 ? 'Excellence Rate' : 'Danger Rate'}</Text>
                </View>
            </View>
            <View style={tw`flex flex-row justify-between items-center px-10 h-[46px] my-6`}>
                <View>
                    <View style={tw`flex flex-row justify-center items-center`}>
                        <View style={tw`h-[10px] w-[10px] bg-[${actualAttendance}] mr-2 rounded-lg`} />
                        <Text style={[tw`text-[24px] text-[#021F2C]`, {fontFamily: 'Inter_500Medium'}]}>{dashboard?.actual_attendance ?? 0}</Text>
                    </View>
                    <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Actual Attendance</Text>
                </View>
                <View>
                    <View style={tw`flex flex-row justify-center items-center`}>
                        <View style={tw`h-[10px] w-[10px] bg-[${expectedAttendance}] mr-2 rounded-lg`} />
                        <Text style={[tw`text-[24px] text-[#021F2C]`, {fontFamily: 'Inter_500Medium'}]}>{dashboard?.expected_attendance ?? 0}</Text>
                    </View>
                    <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Expected Attendance</Text>
                </View>
            </View>
            {/* <View>
                <Image source={qrCode} style={{ flex: 1}} />
            </View> */}
            <View style={tw`flex-1 bg-white mt-6 rounded-t-[25px] px-3 shadow-2xl`}>
                <View style={tw`py-4 px-1`}>
                    <Text style={[tw`text-[16px] text-[#192125]`, {fontFamily: 'Inter_400Regular'}]}>Recent attendance</Text>
                </View>
                <View style={tw`px-1`}>
                    <View style={tw`flex flex-row justify-between py-2`}>
                        <View style={tw`w-1/12 mr-3`}>
                            <Text style={[tw`text-[#192125] text-[14px]`, {fontFamily: 'Inter_600SemiBold'}]}>S/n</Text>
                        </View>
                        <View style={tw`w-4/12`}>
                            <Text style={[tw`text-[#192125] text-[14px]`, {fontFamily: 'Inter_600SemiBold'}]}>Date</Text>
                        </View>
                        <View style={tw`w-4/12`}>
                            <Text style={[tw`text-[#192125] text-[14px]`, {fontFamily: 'Inter_600SemiBold'}]}>Time in</Text>
                        </View>
                        <View style={tw`w-3/12`}>
                            <Text style={[tw`text-[#192125] text-[14px]`, {fontFamily: 'Inter_600SemiBold'}]}>Status</Text>
                        </View>
                    </View>
                    {dashboard?.attendances?.length > 0 ? (
                        <Fragment>
                            <Attendance attendances={dashboard?.attendances} />
                        </Fragment>
                        
                    ):(
                        <View style={tw`flex flex-row justify-center items-center h-full py-3`}>
                            <View style={tw`flex items-center`}>
                                <Text style={[tw`text-[16px] -mt-20 italic`, {fontFamily: 'Inter_400Regular'}]}>No Attendance found</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={action === 'profile' ? 2 : 1}
                    snapPoints={action === 'profile' ? snapPoints :  qrCodesnapPoints}
                    animationConfigs={animationConfigs}
                    onDismiss={() => setAction(null)}
                    style={tw`shadow-2xl w-full`}
                    backdropComponent={CustomBackdrop}
                    handleIndicatorStyle={{
                        display: 'none'
                    }}
                >
                    <View style={tw`flex flex-row justify-between relative`}>
                        {action === 'profile' ? (
                            <Fragment>
                                <View style={tw`flex w-full justify-center items-center`}>
                                    <Text style={[tw`text-[18px]`, {fontFamily: 'Inter_500Medium'}]}>Profile</Text>
                                </View>
                            </Fragment>
                        ): action === 'qrCode' ? (
                            <Fragment>
                                <View style={tw`flex w-full justify-center items-center`}>
                                    <Text style={[tw`text-[18px]`, {fontFamily: 'Inter_500Medium'}]}>Scan QR Code to check in</Text>
                                </View>
                            </Fragment>
                        ): null}
                        <View style={tw`absolute right-2 -top-1`}>
                            <TouchableOpacity onPress={() => {
                                dispatch(studentDashboard())
                                handleClosePress()
                            }}>
                                <Image 
                                    source={require('assets/close-circle.svg')} 
                                    style={{width: 40, height: 40}} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {action === 'profile' ? (
                        <Fragment>
                            <View style={tw`flex flex-col items-center py-6 w-full h-full`}>
                                {loading ? (
                                    <Fragment>
                                        <View style={tw`flex h-full w-full justify-center items-center`}>
                                            <ActivityIndicator size={32} color={expectedAttendance} />
                                        </View>
                                    </Fragment>
                                ) : (
                                    <View style={tw`flex flex-col items-center gap-2`}>
                                        <Image source={photo ? { uri: photo } : require('assets/1.png')} style={tw`h-[96px] w-[96px] rounded-[50px] inset-0`} />
                                        <Text style={[tw`text-[18px]`, {fontFamily: 'Inter_600SemiBold'}]}>{profile?.full_name}</Text>
                                        <Text style={[tw`text-[12px] w-80 text-center -mt-1 mb-1`, {fontFamily: 'Inter_400Regular'}]}>{profile?.course}</Text>
                                        <View style={tw`${profile?.status ? "bg-[#E1F7E8]" : 'bg-red-200'} rounded-[100px] px-7 py-1.5`}>
                                            <View style={tw`flex justify-center items-center w-full pb-1`}>
                                                <Text style={[tw`text-[14px] ${profile?.status ? "text-[#107D35]" : 'text-red-500'} text-center`, {fontFamily: 'Inter_400Regular'}]}>Active</Text>
                                            </View>
                                        </View>
                                        <View style={tw`flex-1 w-[360px] px-3 py-4`}>
                                            <View style={tw`flex flex-row justify-between items-center px-2 h-[46px] border-t border-l border-r rounded-t-[8px] border-[#D4D3D1]`}>
                                                <View>
                                                    <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Student ID</Text>
                                                </View>
                                                <View>
                                                    <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_500Medium'}]}>{profile?.studentId}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex flex-row justify-between items-center px-2 h-[46px] border-t border-l border-r border-[#D4D3D1]`}>
                                                <View>
                                                    <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Class time:</Text>
                                                </View>
                                                <View>
                                                    <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_500Medium'}]}>{profile?.session}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex flex-row justify-between items-center px-2 h-[46px] border-t border-l border-r border-[#D4D3D1]`}>
                                                <View>
                                                    <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Phone:</Text>
                                                </View>
                                                <View>
                                                    <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_500Medium'}]}>{profile?.phone}</Text>
                                                </View>
                                            </View>
                                            <View style={tw`flex flex-row justify-between items-center px-2 h-[46px] border border-[#D4D3D1] rounded-b-[8px]`}>
                                                <View>
                                                    <Text style={[tw`text-[12px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Email:</Text>
                                                </View>
                                                <View>
                                                    <Text style={[tw`text-[14px]`, {fontFamily: 'Inter_500Medium'}]}>{profile?.email}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </Fragment>
                    ): action === 'qrCode' ? (
                        <Fragment>
                            {loading ? (
                                <Fragment>
                                    <View style={tw`flex h-full w-full justify-center items-center`}>
                                        <ActivityIndicator size={32} color={expectedAttendance} />
                                    </View>
                                </Fragment>
                            ):(
                                <View style={tw`flex flex-col items-center `}>
                                    <View style={tw`flex justify-center items-center my-8 w-full`}>
                                        <Image 
                                            source={{ uri: qrCode.replace('http', 'https')}} 
                                            style={[styles.image, tw`h-[240px] w-[240px]`]} 
                                        />
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            dispatch(studentDashboard())
                                            handleClosePress()
                                        }}
                                        style={tw`flex justify-center items-center rounded-[100px] bg-[${cancelButton}] h-[51px] w-[190px] -mt-6`}
                                    >
                                        <Text style={[tw`text-[14px] text-[#021F2C]`, {fontFamily: 'Inter_500Medium'}]}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Fragment>
                    ): undefined}
                </BottomSheetModal>

        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 250
    }
})