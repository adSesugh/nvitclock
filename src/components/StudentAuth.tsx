import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { backgroundColor, primaryColor } from '@/constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { resetError, setErrors, studentSignIn } from '@/store/auth'
import Toast from 'react-native-simple-toast'
import * as Device from 'expo-device'
import { useFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter'

const StudentAuth = ({ setIsTyping, isTyping }) => {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium
    });
    
    const dispatch = useDispatch<useAppDispatch>()
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const { errors, loading } = useSelector((state: RootState) => state.auth)

    const handleSubmit = () => {
        dispatch(resetError())
        if(phoneNumber !== '' && phoneNumber?.length >= 11) {
            const formData = {
                phone_number: phoneNumber,
                deviceId: Device.osBuildId
            }
            return dispatch(studentSignIn(formData)).unwrap().then((res) => {
                if(res !== undefined && res?.error){
                    Toast.show(res.error, Toast.TOP)
                }
            })
        } else {
            return dispatch(setErrors('Phone number is required'))
        }
        return
    }

    const handleBlur = () => {
        setIsTyping(false);
    };

    const handleFocus = () => {
        dispatch(resetError())
        setIsTyping(true);
    };

    return (
        <View style={tw`flex flex-col`}>
            <View style={tw`mt-2`}>
                <View style={tw`my-1`}>
                    <Text style={[tw`text-[16px] text-[#14191B] mb-1`, {fontFamily: 'Inter_400Regular'}]}>Phone number</Text>
                </View>
                <TextInput 
                    editable={!loading}
                    autoFocus={false}
                    clearTextOnFocus={true}
                    value={phoneNumber}
                    placeholder='Enter phone number'
                    placeholderTextColor={'#989D9F'}
                    onChangeText={(text) => setPhoneNumber(text)}
                    keyboardType='number-pad'
                    onKeyPress={() => dispatch(resetError())}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    maxLength={11}
                    style={tw`${isTyping || errors ? 'border-2 border-[#044666]' : 'border border-[#96A7AF]'} rounded-[8px] bg-white h-[51px] w-full px-2 text-lg`}
                />
            </View>
            {errors && (
                <View style={tw`pt-2 w-full`}>
                    <Text style={[tw`text-[#E01010] text-[14px]`, {fontFamily: 'Inter_400Regular'}]}>{errors}</Text>
                </View> 
            )}
            <TouchableOpacity 
                disabled={loading}
                onPress={() => handleSubmit()} 
                style={tw`flex flex-row gap-x-3 h-[52px] bg-[${primaryColor}] justify-center items-center w-full mt-6 rounded-[28px]`}
            >
                {loading && <ActivityIndicator color={'#fff'} size={'small'} />}
                <Text style={[tw`text-white text-[16px]`, {fontFamily: 'Inter_500Medium'}]}>{loading ? 'Please wait...' : 'Log In'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default StudentAuth

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor
    }
})