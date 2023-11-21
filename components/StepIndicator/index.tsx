import React from 'react'

const  StepIndicator: React.FC<{bg?: string}> = ({bg}) => {
    return (
        <div className={`rounded-full p-[5px] bg-${bg ? bg : 'white'} w-[10px] h-[10px]`} 
        style={{
            opacity : !bg ? '15%' : '100%',
            }}>

        </div>
    )
}
export default StepIndicator;
