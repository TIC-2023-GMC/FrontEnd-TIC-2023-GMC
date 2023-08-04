import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
interface TimerContextProps {
	timerValue: { minutes: number; seconds: number };
	setTimerValue: React.Dispatch<
		React.SetStateAction<{
			minutes: number;
			seconds: number;
		}>
	>;
}

export default function GameTimer({ timerValue, setTimerValue }: TimerContextProps) {
	const { minutes, seconds } = timerValue;

	const handleTimer = () => {
		setTimerValue((prevValue) => {
			const newSeconds = prevValue.seconds + 1;
			if (newSeconds === 60) {
				return { minutes: prevValue.minutes + 1, seconds: 0 };
			} else {
				return { ...prevValue, seconds: newSeconds };
			}
		});
	};

	useEffect(() => {
		const timer = setInterval(handleTimer, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<View>
			<Text>
				{minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
			</Text>
		</View>
	);
}
