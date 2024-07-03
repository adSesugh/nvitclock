import { ActivityIndicator, KeyboardAvoidingView, NativeSyntheticEvent, Platform, StyleSheet, Text, TextInput, TextInputKeyPressEventData, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { primaryColor } from '@/constants/Colors'
import { Image } from 'expo-image'
import tw from 'twrnc'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { hideEmailCharacters, isValidEmail } from '@/utils/common'
import CountdownTimer from '@/components/TimerCountdown'
import { useDispatch } from 'react-redux'
import { codeVerification, resetError, resetLoader, setErrors, staffSignIn } from '@/store/auth'
import Toast from 'react-native-toast-message'
import { StatusBar } from 'expo-status-bar'

const VerificationScreen = ({ route }) => {
    const dispatch = useDispatch<useAppDispatch>()
    const { errors, loading, otp } = useSelector((state: RootState) => state.auth)
    const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '']);
  	const refs = useRef<Array<React.RefObject<TextInput>>>(Array.from({ length: 4 }, () => React.createRef<TextInput>()));
    const [timeRemaining, setTimeRemaining] = useState<number | undefined>()
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const param = route.params;

    useEffect(() => {
        dispatch(resetLoader())
    }, [dispatch])

      const handleCodeChange = (index: number, value: string) => {
		if (value.length > 1) {
		 	value = value.charAt(value.length - 1);
		}
	
		const updatedCode = [...verificationCode];
		updatedCode[index] = value;
		setVerificationCode(updatedCode);
	
		if (value && index < 5 && refs.current[index + 1]) {
		  	refs.current[index + 1].current?.focus();
		}
	};
	
	const handleKeyPress = (index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
		if (event.nativeEvent.key === 'Backspace' && index > 0 && !verificationCode[index]) {
			const updatedCode = [...verificationCode];
			updatedCode[index - 1] = '';
			setVerificationCode(updatedCode);
			refs.current[index - 1].current?.focus();
		}
	};
	
	const handleVerifyCode = () => {
		const formattedCode = verificationCode.join('');
        if(formattedCode !== undefined || formattedCode === ''){
            const newCode = Number(formattedCode)
            dispatch(codeVerification({email: param.email, code: newCode})).unwrap().then((res) => {
                if(res !== undefined && res?.error){
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: res.error
                    })
                }
            })
        }
        else {
            dispatch(setErrors('Enter Verification code!'))
        }
	};

    const onCountdownComplete = () => setTimeRemaining(0)

    const resendCode = () => {
        if(isValidEmail(param.email)) {
            dispatch(staffSignIn(param.email)) 
        }
    }

    const handleBlur = () => {
        setIsTyping(false);
    };

    const handleFocus = () => {
        dispatch(resetError())
        setIsTyping(true);
    };

    return (
        <SafeAreaView style={tw`flex-1 items-center w-full`}>
            <StatusBar style='dark' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={tw`flex-1 justify-center items-center w-full px-4`}
            >
                {/* <View style={tw`flex mt-[81px] items-center`}>
                    <Image source={require('assets/logo.png')} style={tw`h-[50px] w-[119px]`} />
                </View> */}
                <View style={tw`h-[91px] w-[250px]`}>
                    <Text style={[tw`text-[24px] text-center`, {fontFamily: 'Inter_600SemiBold'}]}>Verification!</Text>
                    <Text style={[tw`text-center text-[14px] font-normal mt-2 text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Enter the 4-digit code sent to {hideEmailCharacters(param.email)}</Text>
                </View>
                
                <View style={tw`mt-[35px] w-11/12`}>
                    <View style={tw`flex items-center`}>
                        <View style={tw`flex flex-row gap-2 mt-2`}>
                            {verificationCode.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    editable={!loading}
                                    ref={refs.current[index]}
                                    style={tw`h-[51px] w-[51px] text-center ${isTyping ? 'border-2 border-[#044666]' : 'border border-[#96A7AF]'} bg-white rounded-[16px]`}
                                    placeholder="•"
                                    maxLength={1}
                                    keyboardType="numeric"
                                    value={digit}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onChangeText={(value) => handleCodeChange(index, value)}
                                    onKeyPress={(event) => handleKeyPress(index, event)}
                                    placeholderTextColor={'#A0B6C1'}
                                />
                            ))}
                        </View>
                    </View>
                    {errors && (
                        <View style={tw`flex items-center py-2 w-full`}>
                            <Text style={[tw`text-[#E01010] text-[14px] text-center`, {fontFamily: 'Inter_400Regular'}]}>{errors}</Text>
                        </View>
                    )}
                    {otp && (
                        <View style={tw` py-1 w-full`}>
                            <Text style={[tw`text-slate-600 text-[14px]`, {fontFamily: 'Inter_400Regular'}]}>Your test verification code is: {otp}</Text>
                        </View>
                    )}
                    <View style={tw`flex flex-row gap-x-1 py-3 justify-center`}>
                        <Text style={[tw`text-[14px] text-[#424256]`, {fontFamily: 'Inter_400Regular'}]}>Didn't receive a code?</Text>
                        {timeRemaining === 0 ? (
                            <TouchableOpacity onPress={resendCode}>
                                <Text style={[tw`text-[14px] text-[#424256]`, {fontFamily: 'Inter_400Regular'}]}>send again</Text>
                            </TouchableOpacity>
                        ): (
                            <CountdownTimer totalSeconds={90} onCountdownComplete={onCountdownComplete} />
                        )}
                    </View>
                </View>
                <View style={tw`flex items-center justify-center w-5/6`}>
                    <TouchableOpacity disabled={loading} onPress={handleVerifyCode} style={tw`flex flex-row gap-x-3 h-[52px] bg-[${primaryColor}] justify-center items-center mt-3 rounded-[28px] w-full`}>
                        {loading && <ActivityIndicator color={'#fff'} size={'small'} />}
                        <Text style={[tw`text-white text-[16px]`, {fontFamily: 'Inter_500Medium'}]}>{loading ? 'Verifying...' : 'Verify Code'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default VerificationScreen

const styles = StyleSheet.create({
    codeContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 20,
	},
})