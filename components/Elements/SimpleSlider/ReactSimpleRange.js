/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    checkValidity,
    clampValue,
    EVENT_TYPES,
    getEventType,
    getRatio,
    isArrowKey,
} from "./utils";
import SliderThumb from "./SliderThumb";
import SliderLabel from "./SliderLabel";
import SliderTrack from "./SliderTrack";
import { nearStore } from "../../../store/near";

function noOp() {}

const ReactSimpleRange = (props) => {
    const sliderRef = useRef(null);
    const [value, setValue] = useState(props.defaultValue || props.value || 0);
    const [ratio, setRatio] = useState(getRatio(value, props.min, props.max));
    const thumbSize =
        props.thumbSize || props.disableThumb ? 0 : props.sliderSize * 2;
    const [drag, setDrag] = useState(false);
    const [displayLabel, setDisplayLabel] = useState(false);

    checkValidity(props);

    const didInitialMount = useRef(false);
    const previousValue = useRef(value);

    useEffect(() => {
        const valueChanged = value !== previousValue.current;
        if (valueChanged) {
            props.onChange && props.onChange({ value, ratio }, props.id);
            previousValue.current = value;
        }
    }, [value]);

    useEffect(() => {
        if (didInitialMount.current === false) {
            didInitialMount.current = true;
            return;
        }
        if (drag === false) {
            props.onChangeComplete({ value, ratio }, props.id);
        }
    }, [drag]);

    const handleInteractionStart = (event) => {
        const eventType = getEventType(event);
        const leftMouseButton = 0;
        if (eventType === EVENT_TYPES.MOUSE && event.button !== leftMouseButton)
            return;
        updateSliderValue(event, eventType);
        addEvents(eventType);
        setDrag(true);
        setDisplayLabel(true);
    };

    const handleInteractionEnd = () => {
        setDrag(false);
        setDisplayLabel(false);
        removeEvents();
    };

    const onMouseOrTouchMove = (event) => {
        const eventType = getEventType(event);
        updateSliderValue(event, eventType);
        event.preventDefault();
        event.stopPropagation();
    };

    const getSliderInfo = () => {
        const sl = sliderRef.current;
        return {
            bounds: sl.getBoundingClientRect(),
            length: sl.clientWidth,
            height: sl.clientHeight,
        };
    };

    const addEvents = (type) => {
        switch (type) {
            case EVENT_TYPES.MOUSE: {
                document.addEventListener("mousemove", onMouseOrTouchMove);
                document.addEventListener("mouseup", handleInteractionEnd);
                break;
            }
            case EVENT_TYPES.TOUCH: {
                document.addEventListener("touchmove", onMouseOrTouchMove, {
                    passive: false,
                });
                document.addEventListener("touchend", handleInteractionEnd);
                break;
            }
            default: // keyboard events handled separately
        }
    };

    const removeEvents = () => {
        document.removeEventListener("mousemove", onMouseOrTouchMove);
        document.removeEventListener("mouseup", handleInteractionEnd);
        document.removeEventListener("touchmove", onMouseOrTouchMove, {
            passive: false,
        });
        document.removeEventListener("touchend", handleInteractionEnd);
    };

    const nearState = nearStore((state) => state);

    const updateSliderValue = (event, eventType) => {
        const { max, min, vertical } = props;
        const xCoords =
            (eventType !== EVENT_TYPES.TOUCH
                ? event.pageX
                : event.touches[0].pageX) - window.pageXOffset;
        const yCoords =
            (eventType !== EVENT_TYPES.TOUCH
                ? event.pageY
                : event.touches[0].pageY) - window.pageYOffset;
        // compare position to slider length to get percentage
        let position;
        let lengthOrHeight;
        if (!vertical) {
            position = xCoords - getSliderInfo().bounds.left;
            lengthOrHeight = getSliderInfo().length;
        } else {
            lengthOrHeight = getSliderInfo().height;
            position = lengthOrHeight - (yCoords - getSliderInfo().bounds.top);
        }
        const percent = clampValue(
            +(position / lengthOrHeight).toFixed(2),
            0,
            1
        );

        // convert percentage -> value then match value to notch as per props/state.step
        const rawValue = valueFromPercent(percent);
        const value = calculateMatchingNotch(rawValue);
        setValue(value);
        setRatio(getRatio(value, min, max));
    };

    const valueFromPercent = (percentage) => {
        const range = props.max - props.min;
        return range * percentage + props.min;
    };

    const calculateMatchingNotch = (value) => {
        const { step, max, min } = props;
        const values = [];
        for (let i = min; i <= max; i++) {
            values.push(i);
        }
        const notches = [];
        // find how many entries in values are divisible by step (+min,+max)
        for (const s of values) {
            if (s === min || s === max || s % step === 0) {
                notches.push(s);
            }
        }
        // reduce over the potential notches and find which is the closest
        return notches.reduce((prev, curr) => {
            if (Math.abs(curr - value) < Math.abs(prev - value)) {
                return curr;
            }
            return prev;
        });
    };

    const {
        vertical,
        sliderSize,
        disableThumb,
        disableTrack,
        customThumb,
        label,
        trackColor,
        thumbColor,
        verticalSliderHeight,
        eventWrapperPadding,
    } = props;
    const eventWrapperStyle = {
        height: "100%",
        position: "relative",
        cursor: "pointer",
        margin: "0 auto",
        get padding() {
            return !vertical
                ? `${eventWrapperPadding}px 0`
                : `0 ${eventWrapperPadding}px`;
        },
        get width() {
            return !vertical ? "auto" : `${sliderSize}px`;
        },
    };

    const sliderStyle = {
        backgroundColor: props.sliderColor,
        position: "relative",
        overflow: "visible",
        get height() {
            return !vertical ? `${sliderSize}px` : verticalSliderHeight;
        },
        get width() {
            return !vertical ? "100%" : `${sliderSize}px`;
        },
    };

    const handleKeyDownEvent = (event) => {
        if (isArrowKey(event.keyCode) === false) return;
        setDrag(true);
        setDisplayLabel(true);
        event.preventDefault();
        const isPositiveKey = event.keyCode === 38 || event.keyCode === 39;
        const isNegativeKey = event.keyCode === 37 || event.keyCode === 40;
        if (isPositiveKey) {
            incrementValueByStep();
        } else if (isNegativeKey) {
            decrementValueByStep();
        }
    };

    const incrementValueByStep = () => {
        const { min, max, step } = props;
        const newValue = clampValue(value + step, min, max);
        setValue(newValue);
        setRatio(getRatio(newValue, min, max));
    };

    const decrementValueByStep = () => {
        const { max, min, step } = props;
        const newValue = clampValue(value - step, min, max);
        setValue(newValue);
        setRatio(getRatio(newValue, min, max));
    };

    const handleKeyUpEvent = (event) => {
        if (isArrowKey(event.keyCode)) {
            setDrag(false);
            setDisplayLabel(false);
        }
    };

    return (
        <div
            style={eventWrapperStyle}
            onMouseDown={handleInteractionStart}
            onTouchStart={handleInteractionStart}
            onKeyDown={handleKeyDownEvent}
            onKeyUp={handleKeyUpEvent}
            tabIndex="0"
            data-testid="wrapper-events"
        >
            <div
                data-testid="wrapper-slider"
                ref={sliderRef}
                style={{...sliderStyle, borderRadius:"10px", backgroundColor:'#252525'}}
                
            >
                {disableTrack === false ? (
                    <SliderTrack
                        trackLength={ratio}
                        color={trackColor}
                        vertical={vertical}
                    />
                ) : null}
                {label && displayLabel ? (
                    <SliderLabel
                        position={ratio}
                        vertical={vertical}
                        color={trackColor}
                        value={value}
                        sliderSize={sliderSize}
                        thumbSize={thumbSize}
                    />
                ) : null}
                {disableThumb === false && (
                    <SliderThumb
                        position={ratio}
                        vertical={vertical}
                        customThumb={customThumb}
                        thumbSize={thumbSize}
                        sliderSize={sliderSize}
                        color={thumbColor}
                        disableThumb={disableThumb}
                        value={value}
                    />
                )}
            </div>
        </div>
    );
};

ReactSimpleRange.propTypes = {
    children: PropTypes.element,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func,
    onChangeComplete: PropTypes.func,
    vertical: PropTypes.bool,
    verticalSliderHeight: PropTypes.string,
    eventWrapperPadding: PropTypes.number,
    label: PropTypes.bool,
    disableTrack: PropTypes.bool,
    disableThumb: PropTypes.bool,
    sliderColor: PropTypes.string,
    trackColor: PropTypes.string,
    thumbColor: PropTypes.string,
    sliderSize: PropTypes.number,
    thumbSize: PropTypes.number,
    id: PropTypes.string,
};
ReactSimpleRange.defaultProps = {
    min: 0,
    max: 10,
    step: 1,
    onChange: noOp,
    onChangeComplete: noOp,
    vertical: false,
    verticalSliderHeight: "100px",
    eventWrapperPadding: 8,
    label: false,
    disableTrack: false,
    disableThumb: false,
    sliderColor: "#B9B9B9",
    trackColor: "#009688",
    thumbColor: "#009688",
    sliderSize: 4,
    id: "",
};

export default ReactSimpleRange;
