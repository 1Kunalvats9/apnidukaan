import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Cart = () => {
    const [showAddress, setShowAddress] = useState(false)
    const [cart, setcart] = useState([])
    const [totalAmount, settotalAmount] = useState(0)
    const [customerPhone, setcustomerPhone] = useState("")
    useEffect(() => {
        const localCart = JSON.parse(localStorage.getItem("cart")) || []
        setcart(localCart)
    }, [])
    useEffect(() => {
        let price = 0
        cart.forEach((item, idx) => {
            price += item.price
            console.log(price)
        })
        settotalAmount(price)
    }, [cart])
    const navigate = useNavigate();

    const sendBill = async () => {
        const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const formattedProducts = cart
            .map(item => `${item.quantity} x ${item.name}`)
            .join('\n');

        const billDetails = `
    Product: \n${formattedProducts}
    Total: ₹${totalPrice}
    Thank you for shopping with us!
        `;

        try {
            const res = await fetch('https://apnidukaankaserver.onrender.com/api/sms/send', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: customerPhone, billDetails }),
            });

            let data = {};
            try {
                data = await res.json();
            } catch (e) {
                console.error("❌ Failed to parse JSON from sendBill response", e.message);
            }

            if (res.ok && data.success) {
                toast.success("E-bill sent successfully ✅");
            } else {
                toast.error("Failed to send e-bill ❌");
            }
        } catch (error) {
            console.error("❌ sendBill failed:", error.message);
            toast.error("Could not send bill");
        }
    };


    const handleCheckout = async () => {
        try {
            customerPhone && await sendBill();
            const res = await fetch("https://apnidukaankaserver.onrender.com/api/checkout/checkout-product", {
                method: "POST",
                body: JSON.stringify({ cart }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Checkout Successful!");
                setcart([]);
                localStorage.removeItem('cart')
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Checkout Failed:", error);
        }
    };


    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-indigo-500">3 Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                </div>

                {
                    cart.length > 0 ?
                        cart.map((product, index) => (
                            <div key={index} className="grid grid-cols-[2fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                                <div className="flex items-center md:gap-6 gap-3">
                                    <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                        <img className="max-w-full h-full object-cover" src={product.url} alt={product.name} />
                                    </div>
                                    <div>
                                        <p className="hidden md:block font-semibold">{product.name}</p>
                                        <div className="font-normal text-gray-500/70">
                                            <p>Size: <span>{product.size || "N/A"}</span></p>
                                            <div className='flex items-center'>
                                                <p>Qty: {product.quantity}</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center">₹{product.price * product.quantity}</p>
                            </div>)
                        ) : <h1>No products in Cart</h1>}

                <button onClick={() => { navigate("/dashboard") }} className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#615fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to Dashboard
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>₹{totalAmount}</span>
                    </p>
                </div>

                <input type="text" placeholder="Phone number" className="border border-black rounded-md px-3 mt-3 w-full outline-none py-2" onChange={(e)=>{
                    setcustomerPhone(e.target.value)
                }} />

                <button className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition rounded-md" onClick={handleCheckout}>
                    Checkout
                </button>
                <button className="w-full rounded-md text-white bg-red-500 py-3 mt-6 cursor-pointer font-medium  hover:bg-red-600 duration-200" onClick={() => {
                    localStorage.removeItem('cart')
                    setcart([])
                }}>
                    Empty Cart
                </button>
            </div>
        </div>
    )
}

export default Cart