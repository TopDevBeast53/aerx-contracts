import { useState, useRef } from 'react';
import { reset, setClick, setLongPress } from '../store/slices/chargePostEventsSlice';
import { useDispatch } from '../store/store';

export default function useLongPress() {
    const [action, setAction] = useState('click');
    const dispatch = useDispatch();
  
    const timerRef: any = useRef();
    const isLongPress: any = useRef();
  
    function startPressTimer() {
      isLongPress.current = false;
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        setAction('longpress');
      }, 500)
    }
  
    function handleOnClick(e:any) {
      console.log('handleOnClick');
      if (isLongPress.current ) {
        // alert(action)
        console.log('Is long press - not continuing.');
        dispatch(setLongPress())
        setAction('click');
        return;
      }
      else{
        dispatch(setClick())
      }
      setAction('click')
      setTimeout(() => {
        dispatch(reset())
      },300)
    }
  
    function handleOnMouseDown() {
      console.log('handleOnMouseDown');
      startPressTimer();
    }
  
    function handleOnMouseUp() {
      console.log('handleOnMouseUp');
      clearTimeout(timerRef.current);
    }
  
    function handleOnTouchStart() {
      console.log('handleOnTouchStart');
      startPressTimer();
    }
  
    function handleOnTouchEnd() {
      if ( action === 'longpress' ) return;
      console.log('handleOnTouchEnd');
      clearTimeout(timerRef.current);
    }
  
    return {
      action,
      handlers: {
        onClick: handleOnClick,
        onMouseDown: handleOnMouseDown,
        onMouseUp: handleOnMouseUp,
        onTouchStart: handleOnTouchStart,
        onTouchEnd: handleOnTouchEnd
      }
    }
  }