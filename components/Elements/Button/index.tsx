import React from 'react'

interface IProps {
    icon?: string,
    label: string,
    onClick?: () => void,
}
const Button: React.FC<IProps> = ({icon, label, onClick}) => {
    return (
        <button className='bg-purple hover:opacity-[80%] w-full rounded-[10px] flex justify-around py-3' 
         onClick={onClick}
        >
            <div className='flex gap-2'>
            {icon && <img src={icon} alt="icon" width={15} height={15} />}
            <label className='text-white text-[14px]' style={{fontWeight: 'bold'}}>{label}</label>
            </div>
        </button>
    )
}

export default Button;