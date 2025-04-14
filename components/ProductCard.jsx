import React, { useState } from 'react'
import { toast } from 'react-toastify';

const ProductCard = ({ url, name, price, quantity,id, onAddToCart }) => {
    const [qty, setQty] = useState(0);
    const handleChange = (e) => {
        setQty(Number(e.target.value));
    };
    const handleClick = () => {
        if (qty > 0) {
            onAddToCart({
                name,
                price,
                url,
                quantity: qty,
                id:id
            });
            toast.success("Product added successfully!")
            setQty(0);
        }
    };
    return (
        <div className='flex flex-col w-full border-2 gap-1 border-black rounded-lg items-center justify-between'>
            <div className='flex flex-col w-full px-3 flex-1 py-3 rounded-lg bg-blue-50 min-h-[200px] items-center gap-2'>
                <img src={url || "https://www.pngitem.com/pimgs/m/325-3256246_fa-fa-product-icon-transparent-cartoons-fa-fa.png"} alt={name} className='h-[131px]' />
                <div className='flex items-center mt-2 w-[80%] justify-between'>
                    <h1 className='text-lg'>{name.toUpperCase()}</h1>
                    <h1 className='text-lg'>₹{price}</h1>
                </div>
                <div className='flex items-center mt-2 w-[80%] justify-between'>
                    <h1 className='text-lg'>Available Quantity</h1>
                    <h1 className='text-lg'>{quantity}</h1>
                </div>
            </div>
            <div className='flex flex-col mt-1 items-center justify-between'>
                <input type="number" onChange={handleChange} min="0" max={quantity} placeholder={qty} className='px-2 no-spinner py-1 w-[90%] md:w-full bg-white border-2 border-black rounded-md' />
                <div className='flex py-2 px-1 md:px-0 items-center gap-2 w-full justify-between'>
                    <button className='px-2 py-3 text-center flex items-center text-sm md:text-md justify-center cursor-pointer hover:scale-105 duration-200 text-white h-10 border bg-indigo-500 rounded-md'>
                        <h1>Add to Dukaan</h1>
                    </button>
                    <button onClick={handleClick} className='px-2 py-3 text-center text-sm md:text-md flex items-center justify-center cursor-pointer hover:scale-105 duration-200 text-white h-10 border bg-indigo-500 rounded-md'>
                        <h1>Add to Cart</h1>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
