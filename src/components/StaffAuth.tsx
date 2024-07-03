import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { backgroundColor, primaryColor } from '@/constants/Colors'
import tw from 'twrnc'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { resetError, resetLoader, setErrors, staffSignIn } from '@/store/auth'
import { isValidEmail } from '@/utils/common'
//import Toast from 'react-native-simple-toast'
import { useFonts, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter'
import Toast from 'react-native-toast-message'

const StaffAuth = ({ navigation, setIsTyping, isTyping }) => {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium
    });
    
    const dispatch = useDispatch<useAppDispatch>()
    const [email, setEmail] = useState<string>('')
    const { errors, loading } = useSelector((state: RootState) => state.auth)

    const onSubmit = () => {
        dispatch(resetError())
        if(isValidEmail(email)) {
            dispatch(staffSignIn(email)).unwrap().then((res) => {
                console.log(res)
                if(res !== undefined && res?.success){
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Please check your email for verification code!'
                    })
                    return navigation.replace('verifier', {email: email})
                }
                else if(res?.error) {
                    dispatch(setErrors(res.error))
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: res.error
                    })
                    return
                }
                else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Network error'
                    })
                    return
                }
            }) 
        } else {
            return dispatch(setErrors('Email Address is required!'))
        }
        return
    }

    const handleBlur = () => {
        setIsTyping(false)
    }

    const handleFocus = () => {
        dispatch(resetError())
        setIsTyping(true);
    };
    
    return (
        <View style={tw`flex flex-col`}>
            <View style={tw`mt-2`}>
                <View style={tw`my-1`}>
                    <Text style={[tw`text-[16px] text-[#14191B] mb-1`, {fontFamily: 'Inter_400Regular'}]}>Email Address</Text>
                </View>
                <TextInput 
                    editable={!loading}
                    autoFocus={false}
                    clearTextOnFocus={true}
                    value={email.toLowerCase()}
                    placeholder='Enter email address'
                    placeholderTextColor={'#989D9F'}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType='email-address'
                    inlineImageLeft={''}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onKeyPress={() => dispatch(resetError())}
                    style={tw`${isTyping || errors ? 'border-2 border-[#044666]' : 'border border-[#96A7AF]'} rounded-[16px] bg-white px-3 h-[51px] w-full`}
                />
                {errors && (
                    <View style={tw`flex pt-2 w-full`}>
                        <Text style={[tw`text-[#E01010] text-[14px]`, {fontFamily: 'Inter_400Regular'}]}>{errors}</Text>
                    </View> 
                )}
            </View>
            <View style={tw`w-full`}>
                <TouchableOpacity 
                    onPress={() => onSubmit()} 
                    disabled={loading}
                    style={tw`flex flex-row gap-x-3 h-[52px] bg-[${primaryColor}] justify-center items-center w-full mt-6 rounded-[28px]`}
                >
                    {loading && <ActivityIndicator color={'#fff'} size={'small'} />}
                    <Text style={[tw`text-white text-[16px]`, {fontFamily: 'Inter_500Medium'}]}>{loading ? 'Please wait...' : 'Log In'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default StaffAuth

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor
    }
})