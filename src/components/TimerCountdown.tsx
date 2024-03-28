import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc'

interface TimerCountdownProps {
    totalSeconds: number;
    onCountdownComplete ?: () => void;
}

const TimerCountdown = ({ totalSeconds, onCountdownComplete }: TimerCountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);

    useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(prevTimeLeft => {
                if (prevTimeLeft <= 0) {
                    clearInterval(timer);
                    onCountdownComplete()
                    return 0;
                }
                return prevTimeLeft - 1;
            });
        }, 1000);


        return () => clearInterval(timer);
    }, [totalSeconds]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${'0'+mins}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <View>
            <Text style={tw`text-[14px] text-[#424256]`}>{formatTime(timeLeft)}</Text>
        </View>
    );
}

export default TimerCountdown;
