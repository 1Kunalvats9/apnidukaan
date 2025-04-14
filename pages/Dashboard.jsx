import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LineChart from "../components/LineChart";
import DashboardCard from '../components/DashboardCard';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setproducts] = useState([]);
  const [openAddProduct, setopenAddProduct] = useState(false);
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [category, setcategory] = useState('');
  const [quantity, setquantity] = useState(0);
  const [searchFor, setsearchFor] = useState("");
  const [isSearching, setisSearching] = useState(false);
  const [retailPrice, setretailPrice] = useState(0);
  const [wholesalePrice, setwholesalePrice] = useState(0);
  const [url, seturl] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalIncome, settotalIncome] = useState(0)
  const [profit, setprofit] = useState(0)
  const [cart, setcart] = useState([])
  const [itemAddEffect, setitemAddEffect] = useState(false)
  

  const navigate = useNavigate();

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/upload/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Upload error:", errorData.error);
        toast.error("Image upload failed ❌");
        setLoading(false);
        return;
      }

      const data = await res.json();
      seturl(data.url);
      toast.success("Image uploaded ✅");
    } catch (err) {
      console.error("❌ Upload failed:", err.message);
      toast.error("Image upload error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      navigate('/');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) setemail(email);
    refreshProducts(email);
    const cartItem = localStorage.getItem('cart');
    let cartIfAvailable = [];
    if (cartItem) {
      try {
        cartIfAvailable = JSON.parse(cartItem);
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
    if (cartIfAvailable.length > 0) {
      setcart(cartIfAvailable);
    }
  }, []);

  const refreshProducts = async (userEmail) => {
    try {
      const res = await fetch("http://localhost:3000/api/inventory/inventoryget", {
        method: "POST",
        body: JSON.stringify({ email: userEmail }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setproducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (loading) {
      toast.error("Image is still uploading, please wait...");
      return;
    }

    try {
      const email = localStorage.getItem("email");
      setemail(email);
      const res = await fetch("http://localhost:3000/api/inventory/inventoryput", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, category, quantity, retailPrice, wholesalePrice, url }),
      }); 

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add product");
      }

      const data = await res.json();
      toast.success("Product added Successfully ✅");
      setopenAddProduct(false);
      refreshProducts(email); // <--- Refresh the product list here
    } catch (err) {
      console.error("❌ Error adding product:", err.message);
      toast.error("Failed to add product");
    }
  }

  const handleAddToCart = (product) => {
    setitemAddEffect(true)
    setcart(prev => [...prev, product]);
    setTimeout(() => {
      setitemAddEffect(false)
    }, 1000);
  };
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  return (
    <div className='bg-blue-50 min-h-[100vh]'>
      {/*Add product popup */}
      {
        openAddProduct &&
        <div className='w-full fixed z-150 h-full bg-white/30 backdrop-blur-2xl flex items-center justify-center'>
          <div className="bg-white relative rounded-lg border-2 border-gray-300 px-12 py-7 max-w-md w-full">
            <div className='w-6 h-6 cursor-pointer absolute top-3 right-3' onClick={() => {
              setopenAddProduct(!openAddProduct)
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-3xl font-medium text-white bg-indigo-700 px-3 py-2 rounded-md mb-4">Add New Product <div className='text-sm mt-3'>or scan barcode</div></h3>
            <form onSubmit={handleClick}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-md font-medium text-gray-700">Product Name</label>
                  <input type="text" id="name" placeholder='Name' className="mt-1 block w-full rounded-sm border-2 border-gray-300 focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                    setname(e.target.value)
                  }} />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select id="category" className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                    setcategory(e.target.value)
                  }} >
                    <option value="Furniture">Furniture</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Home and Kitchen">Home and Kitchen</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Food">Food</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="number" id="quantity" placeholder='Quantity' className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                    setquantity(Number(e.target.value.trim()))
                  }} />
                </div>
                <div>
                  <label htmlFor="retailPrice" className="block text-sm font-medium text-gray-700">Retail Price (₹)</label>
                  <input type="number" id="retailPrice" placeholder='Retail price' className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                    setretailPrice(Number(e.target.value.trim()))
                  }} />
                </div>
                <div>
                  <label htmlFor="wholesalePrice" className="block text-sm font-medium text-gray-700">Wholesale Price (₹)</label>
                  <input type="number" id="wholesalePrice" placeholder='Wholesale Price' className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                    setwholesalePrice(Number(e.target.value.trim()))
                  }} />
                </div>
                <div>
                  <input type="file" placeholder='Upload Image' className='px-3 py-1 border-2 rounded-md w-full border-gray-200 cursor-pointer' onChange={handleUpload} />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {
                  setopenAddProduct(false)
                }}>Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{loading ? 'Uploading...' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      }

      <Navbar isLoggedIn={isLoggedIn}  setcart={setcart} cartProducts={cart.length} itemAddEffect = {itemAddEffect}/>

      <div className='w-[100vw] mt-[69px] bg-blue-50 h-auto flex flex-col gap-5 md:flex-row items-start px-5 md:px-10 py-4'>
        <div className='w-full md:w-[60%] h-[30vh] md:h-[60vh]'>
          <LineChart />
        </div>
        <div className='grid w-full md:w-[40%] gap-4 mt-10 md:mt-0 grid-cols-1 place-items-center'>
          <DashboardCard
            title="Total Products"
            value={products.length || 0}
            icon="https://icons.veryicon.com/png/o/miscellaneous/fu-jia-intranet/product-29.png"
            style=""
          />
          <DashboardCard
            title="Total Income"
            value={totalIncome}
            icon="https://cdn-icons-png.flaticon.com/512/25/25473.png"
            style="text-yellow-500"
          />
          <DashboardCard
            title="Profit"
            value={profit}
            icon="https://cdn-icons-png.flaticon.com/512/1421/1421335.png"
            style="text-green-600"
          />
        </div>
      </div>

      <div className='w-[90%] mx-auto bg-white rounded-xl py-10'>
        <h1 className='text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-5xl font-bold'>Apni Dukaan</h1>
        <div className='flex items-center justify-between gap-2 px-6 py-3 mt-5'>
          <div className='w-[75%] md:w-[85%]'>
            <div className="flex items-center border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-sm gap-2 px-3 rounded-full">
              <input className="py-3 px-2 w-full duration-200 bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search Products" onClick={() => setisSearching(!isSearching)} onChange={(e) => { setsearchFor(e.target.value) }} />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <button onClick={() => setopenAddProduct(!openAddProduct)} type="button" className="w-40 cursor-pointer hover:scale-105 duration-200 py-3 active:scale-95 transition text-sm px-2 text-white rounded-full bg-indigo-500 hover:bg-indigo-600">
            <div className="mb-0.5 flex items-center justify-center gap-2">
              <div className='h-full flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 448 512">
                  <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                </svg>
              </div>
              Add Products
            </div>
          </button>
        </div>
        <div className='w-full grid gap-3 md:gap-5 grid-cols-2 md:grid-cols-4 px-2 md:px-7 py-3'>
          {
            products.length > 0 ?
              products
                .filter(ele => ele.name?.toLowerCase().startsWith(searchFor.toLowerCase()))
                .map((item, idx) => (
                  <ProductCard key={idx} name={item.name} price={item.retailPrice} url={item.url} quantity={item.quantity} id={item._id} onAddToCart={handleAddToCart} />
                )) : <h1>Inventory is empty.</h1>
          }
        </div>
      </div>
    </div>
  );
};

export default Page;
