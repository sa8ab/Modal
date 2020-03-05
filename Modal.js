import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, Button, Animated, Dimensions } from 'react-native';
import { TapGestureHandler, PanGestureHandler, LongPressGestureHandler, State, TouchableOpacity } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Modal = (props) => {
    const [pointerEvents, setPEvents] = useState('none')

    useEffect(() => {
        if (props.isOpen) {
            openModal();
            props.open(false);
        }
    }, [props.isOpen])

    const tranX = useMemo(() => new Animated.Value(0), [])
    const tranY = useMemo(() => new Animated.Value(-100), [])


    const onhandler = ({ nativeEvent }) => {
        const { state, translationX, oldState, velocityX } = nativeEvent;
        if (state === State.ACTIVE) {
            tranX.setValue(translationX)
        } else if (oldState === State.ACTIVE) {

            const valueNumber = tranX._value

            if (valueNumber > 0 && velocityX > 100) {
                setPEvents('none')
                Animated.spring(tranX, {
                    toValue: SCREEN_WIDTH * 1.1,
                    velocity: velocityX,
                    useNativeDriver: true
                }).start(dismiss)
            } else if (valueNumber < 0 && velocityX < -100) {
                setPEvents('none')
                Animated.spring(tranX, {
                    toValue: -SCREEN_WIDTH * 1.1,
                    velocity: velocityX,
                    useNativeDriver: true
                }).start(dismiss)
            } else {
                Animated.spring(tranX, {
                    toValue: 0,
                    velocity: velocityX,
                    useNativeDriver: true
                }).start()
            }

        }
    }
    const dismiss = () => {
        console.log('dismissed Completely!');
    }
    const openModal = () => {
        setPEvents('auto');
        console.log('Opening!');
        tranY.setValue(-100);
        tranX.setValue(0);
        Animated.spring(tranY, {
            toValue: 0,
            stiffness: 150,
            damping: 13,
            useNativeDriver: true
        }).start();
    }

    const rotate = tranX.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: ['-30deg', '0deg', '30deg']
    })
    const opacityY = tranY.interpolate({
        inputRange: [-100, -20, 0],
        outputRange: [0, 1, 1]
    })



    return (
        <View style={[styles.panCN, props.containerStyle]} pointerEvents={pointerEvents}>
            <PanGestureHandler
                onHandlerStateChange={onhandler} onGestureEvent={onhandler}>
                <Animated.View style={[
                    styles.animate,
                    props.panStyle,
                    {
                        transform: [{ translateX: tranX, translateY: tranY, rotate }],
                        opacity: opacityY
                    }
                ]}>
                    {props.children}
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

export default Modal;

Modal.defaultProps = {
    containerStyle: {},
    panStyle: {},
    onOpen: () => null
}

const styles = StyleSheet.create({
    panCN: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10,
    },
    animate: {
        width: 300,
        height: 240,
        backgroundColor: '#2bcbba',
        borderRadius: 10,
        elevation: 100
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
