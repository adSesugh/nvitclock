import { Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import StudentAuth from '@/components/StudentAuth'
import StaffAuth from '@/components/StaffAuth'
import { useDispatch } from 'react-redux'
import { useAppDispatch } from '@/store'
import { resetError, resetLoader } from '@/store/auth'
import { StatusBar } from 'expo-status-bar'
import { SCREEN_WIDTH } from '@/constants/Common'


const LoginScreenV1 = ({ navigation }) => {
    const dispatch = useDispatch<useAppDispatch>()
    const [userType, setUserType] = useState<string | undefined>('student')
    const [isTyping, setIsTyping] = useState<boolean>(false);

    useEffect(()=> {
        dispatch(resetError())
    }, [isTyping])

    const switchUserType = (userGroup: string) => {
        dispatch(resetLoader())
        dispatch(resetError())
        setIsTyping(false)
        setUserType(userGroup)
    }

    return (
        <SafeAreaView style={tw`flex-1 items-center`}>
            <StatusBar style='dark' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1 justify-center items-center`}
            >
                <View style={[tw`flex items-center ${isTyping ? '' : '-mt-20'} px-4`, {width: SCREEN_WIDTH}]}>
                    <View style={tw``}>
                        <Text style={[tw`text-[32px] text-center`, {fontFamily: 'Inter_600SemiBold'}]}>Welcome back!</Text>
                    </View>       
                    <View style={tw`flex flex-row bg-[#044666]/10 w-[233px] h-[39px] rounded-[100px] justify-between items-center px-[5px] mt-[69px]`}>
                        <TouchableOpacity onPress={() => switchUserType('student')} style={tw`flex flex-row gap-x-2 ${userType === 'student' ? 'bg-white shadow-2xl': ''} h-[29px] w-[111px] rounded-[100px] items-center justify-center`}>
                            <Image source={require('assets/graduate-male.svg')} style={[tw`h-[18px] w-[18px]`, { height: 18, width: 18}]} />
                            <Text style={[tw`text-[13px] ${userType === 'student' ? 'text-[#192125]' : 'text-[#40484C]'}`, {fontFamily: 'Inter_400Regular'}]}>Student</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => switchUserType('staff')} style={tw`flex flex-row gap-x-2 ${userType === 'staff' ? 'bg-white shadow-2xl': ''} h-[29px] w-[111px] rounded-[100px] items-center justify-center`}>
                            <Image source={require('assets/user.svg')} style={[tw`h-[18px] w-[18px]`, { height: 18, width: 18}]} />
                            <Text style={[tw`text-[13px] ${userType === 'staff' ? 'text-[#192125]' : 'text-[#40484C]'}`, {fontFamily: 'Inter_400Regular'}]}>Staff</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={tw`mt-[5px] w-[233px] mb-6`}>
                        {userType === 'student' ? (
                            <Text style={[tw`text-center text-[14px] mt-2 text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Log in with the phone number you used during registration.</Text>
                        ):(
                            <Text style={[tw`text-center text-[14px] mt-2 text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Log in with your official email to start taking attendance.</Text>
                        )}
                    </View>
                    
                    <View style={tw`w-full w-5/6`}>
                        {userType === 'student' ? (
                            <StudentAuth setIsTyping={setIsTyping} isTyping={isTyping} />
                        ): (
                            <StaffAuth navigation={navigation} setIsTyping={setIsTyping} isTyping={isTyping} />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default LoginScreenV1