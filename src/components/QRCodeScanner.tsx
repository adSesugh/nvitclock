import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Image } from 'expo-image'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { RootState, useAppDispatch } from '@/store'
import { useSelector } from 'react-redux'
import { getLearner } from '@/store/student/actions'
import BottomSheet from '@gorhom/bottom-sheet'
import BarcodeMask, {} from 'react-native-barcode-mask'
import { resetLearner, resetStatus } from '@/store/student'
import NonePointerCustomBackdrop from './NonePointerCustomBackDrop'
import { Audio } from 'expo-av'
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'


const { width, height } = Dimensions.get('screen')

const QRCodeScanner = ({ navigation }) => {
    let [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold
    });

    const dispatch = useDispatch<useAppDispatch>()
    const [permission, requestPermission] = useCameraPermissions();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [barcodeDetected, setBarcodeDetected] = useState(false);
    const [isCameraPaused, setCameraPaused] = useState(false);
    const region = { x: 100, y: 100, width: 130, height: 130 }
    const { learner, status } = useSelector((state: RootState) => state.student)
    const closeModal = useSelector((state: RootState) => state.modal.closeModal);
    

    const snapPoints = useMemo(() => ['44%', '44%'], []);
    const errorSnapPoints = useMemo(() => ['44%', '55%'], []);

    useEffect(() => {
        (async () => {
            const { status } = await requestPermission();
            if(status !== 'granted') {
                return await requestPermission();
            }
        })();
        dispatch(resetStatus(undefined))
    }, []);

    const handleLayoutMeasured = (event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
    }

    const handleBarcodeDetected = (result) => {
        const { boundingBox, data } = result
        
        if(barcodeDetected || data.length != 11) return;

        if (boundingBox.origin.x >= region.x &&
            boundingBox.origin.y >= region.y
        ) {
            setBarcodeDetected(true);
            dispatch(resetLearner())

            if(closeModal){
                closeModal()
            }
            dispatch(getLearner(data)).unwrap().then(async (res) => {
                if(res?.learner){
                    if(res.learner.status){
                        const { sound } = await Audio.Sound.createAsync(require('assets/sound/granted.mp3'))
                        await sound.playAsync()
                    }
                    else {
                        const { sound } = await Audio.Sound.createAsync(require('assets/sound/denied.mp3'))
                        await sound.playAsync()
                    }
                    setBarcodeDetected(false)
                    setCameraPaused(true)
                    dispatch(resetStatus(res.learner.status ? 'successful' : 'unsuccessful'))
                } else {
                    setBarcodeDetected(false)
                    setCameraPaused(true)
                    dispatch(resetStatus('error'))
                }
            })
        }
    };

    setTimeout(() => {
        setCameraPaused(false)
        dispatch(resetLearner())
        dispatch(resetStatus(undefined))
    }, 9000)

    return (
        <View style={styles.container}>
            <View style={{ height: (status === 'unsuccessful' || status === 'error') ? height/2 : height/2 + 80}}>
                {isCameraPaused ? (
                    <Fragment>
                        <TouchableOpacity 
                            style={tw`flex right-4 justify-end items-end top-10`}
                            onPress={() => {
                                dispatch(resetLearner())
                                dispatch(resetStatus({payload: undefined}))
                                return navigation.goBack()
                            }}
                        >
                            <Image source={require('assets/cancel-circle.svg')} style={{ width: 40, height: 40}} />
                        </TouchableOpacity>
                    </Fragment>
                ): (
                    <CameraView
                        facing='back'
                        style={styles.camera}
                        onBarcodeScanned={((result) => handleBarcodeDetected(result))}
                    >
                        <TouchableOpacity 
                            style={tw`flex right-4 justify-end items-end top-12 bg-red-300 p-1 w-16 rounded-full`}
                            onPress={() => {
                                dispatch(resetLearner())
                                dispatch(resetStatus(undefined))
                                return navigation.goBack()
                            }}
                        >
                            <Image source={require('assets/cancel-circle.svg')} style={{ width: 40, height: 40}} />
                        </TouchableOpacity>

                        <BarcodeMask 
                            showAnimatedLine={true}
                            width={230}
                            height={230} 
                            edgeRadius={25}
                            edgeBorderWidth={12}
                            edgeHeight={35}
                            edgeWidth={35}
                            backgroundColor='#c0c0c0'
                            outerMaskOpacity={.6}
                        />
                    </CameraView>
                )}
            </View>
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={status === 'unsuccessful' ? errorSnapPoints : snapPoints}
                handleIndicatorStyle={{
                    display: 'none'
                }}
                backdropComponent={NonePointerCustomBackdrop}
                style={tw`rounded-t-[25px]`}
            >
                <View style={tw`flex flex-col items-center relative`}>
                    {status !== undefined && (
                        <View style={tw`items-center mb-6`}>
                            <Text style={[tw`text-[18px]`, {fontFamily: 'Inter_500Medium'}]}>Student details</Text>
                        </View>
                    )}
                    {status !== undefined ? (
                        <Fragment>
                            {status === 'error' ? (
                                <Fragment>
                                    <View style={tw`flex justify-center items-center h-full -mt-2`}>
                                        <Image source={require('assets/info-circle.svg')} style={{ width: 281, height: 200}} />
                                        <Text style={tw`py-3 px-8`}>No Record found!</Text>
                                    </View>
                                </Fragment>
                            ):(
                                <Fragment>
                                    <View style={tw`flex flex-col items-center gap-2 mb-2`}>
                                        <Image source={learner?.photo ? { uri: learner?.photo } : require('assets/1.png')} style={tw`h-[80px] w-[80px] rounded-[100px] inset-0`} />
                                    </View>
                                    <Text style={[tw`text-[18px]`, {fontFamily: 'Inter_600SemiBold'}]}>{learner?.full_name}</Text>
                                    <View style={tw`flex flex-row justify-center items-center w-full px-4 py-1`}>
                                        <View>
                                            <Text style={[tw`text-[12px] text-[#1F0E1C]`, {fontFamily: 'Inter_500Medium'}]}>{learner?.studentId}</Text>
                                        </View>
                                        <View style={tw`h-1.5 w-1.5 mx-2 bg-[#D9D9D9] rounded-[100px]`} />
                                        <View>
                                            <Text style={[tw`text-[12px] text-[#2F4551] text-center`, {fontFamily: 'Inter_400Regular'}]}>{learner?.course}</Text>
                                        </View>
                                    </View>
                                    <View style={tw`flex justify-center items-center h-[48px] w-[226px] ${status === 'unsuccessful' ? 'bg-[#FCE6E6]' : 'bg-[#E1F7E8]' } rounded-[100px] mt-4`}>
                                        <View style={tw`flex flex-row gap-x-2 justify-center items-center`}>
                                            <Image source={status === 'unsuccessful' ? require('assets/info-circle.svg') : require('assets/tick-circle.svg')} style={{height: 24, width: 24}} />
                                            <Text style={[tw`text-[16px] ${status === 'unsuccessful' ? 'text-[#D70F0F]' : 'text-[#107D35]'}`, {fontFamily: 'Inter_500Medium'}]}>{learner?.msg}</Text>
                                        </View>
                                    </View>
                                    {status === 'unsuccessful' && (
                                        <View style={tw`flex items-center px-4 py-2.5`}>
                                                <View style={tw``}>
                                                    <Text style={[tw`text-[#D70F0F] text-[14px] text-center`, {fontFamily: 'Inter_400Regular'}]}>Attendance capture failed due to a disparity in the student allotted class time.</Text>
                                                </View>
                                                <View style={tw`flex items-center`}>
                                                    <Text style={[tw`py-3 text-[14px] text-[#2F4551]`, {fontFamily: 'Inter_400Regular'}]}>Allotted Class time</Text>
                                                    <Text style={[tw`text-[24px] text-[#1F0E1C] py-2`, {fontFamily: 'Inter_500Medium'}]}>{learner?.session}</Text>
                                                </View>
                                        </View>
                                    )}
                                </Fragment>
                            )}
                        </Fragment>
                    ):(
                        <Fragment>
                            <View style={tw`flex justify-center items-center h-full -mt-2`}>
                                <Image source={require('assets/notice.svg')} style={{ width: 281, height: 200}} />
                            </View>
                        </Fragment>
                    )}
                </View>
            </BottomSheet>
        </View>
    )
}

export default QRCodeScanner

const styles = StyleSheet.create({
    container: {
        flex: 1
    }, 
    camera: {
        width: width,
        height: '100%',
    },
    button: {
        height: 50,
        borderRadius: 25,
        aspectRatio: 1,
        backgroundColor: 'orange',
        opacity: 0.6,
    },
})