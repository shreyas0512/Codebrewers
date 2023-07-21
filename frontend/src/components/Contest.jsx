import React from 'react'

function Contest() {
  return (
    <div className='flex flex-col items-center w-screen h-screen'>
        <h2 className='text-white font-medium mt-12 text-3xl'>Join a Contest</h2>
        <div className='flex w-screen items-center justify-center mt-8 '>
        <input className='bg-[#353535] h-10 px-1 w-1/2 rounded-md shadow-lg outline-none pl-2' type='text' placeholder='Enter Contest Code' />
        <button className='ml-4'>Join</button>
        
        </div>
        <h3 className='text-5xl mt-12 font-bold'>Or</h3>
        <div className='w-1/2 h-1/2 mt-8 shadow-lg rounded-md bg-[#353535] flex flex-col items-center'>
            <h4 className='text-center mt-2 text-3xl font-medium pt-3'>Create Your Own Contest</h4>
            <select className='bg-[#232323] h-10 px-1 w-1/2 rounded-md shadow-lg text-center outline-none pl-2 mt-8'>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
            </select>
            <select className='bg-[#232323] h-10 px-1 w-1/2 rounded-md shadow-lg text-center outline-none pl-2 mt-8'>
                <option>30s</option>
                <option>60s</option>
                <option>120s</option>
            </select>
            <button className='mt-12 text-2xl font-bold bg-[#232323]'>+ Create</button>
        </div>
    </div>
  )
}

export default Contest