import React , {useState} from 'react'
import { Form, Input, message, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { logInStart, logInFailure, logInSuccess } from '../../redux/user/userSlice';
import { LoadingOutlined } from '@ant-design/icons';
// import "./Login.css";
import "./Checkout.css";
import { checkoutFailure, checkoutSuccess, doingCheckout } from '../../redux/checkout/checkoutSlice';
import { makeCartEmpty } from '../../redux/cart/cartSlice';

const Checkout = () => {
    const { loading, error, currentUser } = useSelector((state) => state.user);
    const { cartData } = useSelector((state) => state.cart);
    const { checkoutLoading, checkoutError } = useSelector((state) => state.checkoutProducts);

    const [checkoutInputData, setCheckoutInputData] = useState({
        shippingAddress: "",
        CardNumber: ""
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCheckoutInputData({
            ...checkoutInputData,
            [name]: value
        });
    };

    const handleCheckout = async() =>{
        try {
            dispatch(doingCheckout());
            const res = await axios.post(`/api/order/checkoutOrder`, {
                userId: currentUser._id,
                shippingAddress: checkoutInputData.shippingAddress,
                CardNumber: checkoutInputData.CardNumber
            });
            console.log(res);

            if(res.data.success){
                dispatch(makeCartEmpty());
                dispatch(checkoutSuccess());
                message.success("Checkout successful");
                navigate("/");
            } else{
                dispatch(checkoutFailure(res.data.message));
                message.error(res.data.message);
            }


        } catch (error) {
            dispatch(checkoutFailure());
            console.log(error);
            message.error("Something went wrong!");
        }
        
    }

  return (
    <>
    <Header />
    {
        cartData?.items?.length === 0 && navigate("/")
    }

    {
        checkoutLoading ? <Spin className='spin-loader' indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}/> :
        <div className="checkout-main-container">
        <div className='checkout-products-outer-container'>
            <div className='checkout-products-inner-container'>
            {cartData && cartData?.items.map((cartItem) => (
                        <div className='drawer-product'>
                        <img
                            src={cartItem?.imagesrc}
                            className="drawer-product-image"
                            alt="..."
                        />
                        <div className="">
                            <h6 className="long-word">{cartItem?.name}</h6>
                            <span>Qty: {cartItem?.quantity}</span>
                            {/* <span>{cartItem?.CartQuantity}</span> */}
                            <h6 className="">&#8377; {cartItem?.price * cartItem?.quantity}</h6>
                        </div>
                        </div>
                        
                    ))}
            </div>
            <span style={{ fontWeight: "bold" }}>{cartData?.items?.length > 0 ? <div className='checkout-Total-Products'>Total: &#8377; {cartData?.bill}</div> : <div>"You dont have any products in cart"</div>}</span>
        
        </div>
        <div className="my-form-outer-main-container">

        
        <div className='my-form-outer-container'> 

        
        <div className="my-form-container">
            <h3 className="">Checkout</h3>

            <form
            // onFinish={handleCheckout}
            onSubmit={handleCheckout}
            className='checkOutregisterForm'
            >
                
                <div className='form-inputs'>
                    <label htmlFor="name">Name: </label>
                    <input type='text' name="name" value={currentUser.name} required />
                </div>
                
                

                <div className='form-inputs'> 
                <label htmlFor="email">Email: </label>
                <input type='email' name="email" value={currentUser.email} required />
                </div>
                    
                

                <div className='form-inputs'>
                <label htmlFor="Address">Address: </label>
                <textarea name="shippingAddress" value={checkoutInputData.shippingAddress} onChange={handleInputChange} required  id="" cols="10" rows="5"></textarea>
                {/* <input type='text' required name="shippingAddress" value={checkoutInputData.shippingAddress} onChange={handleInputChange}/> */}
                </div>
                    
               

                <div className='form-inputs'>
                <label htmlFor="Card Number">Card Number: </label>
                <input type='number' required name="CardNumber" value={checkoutInputData.CardNumber} onChange={handleInputChange} />
                </div>
                    
                

                {cartData?.items?.length > 0  ? <button className='btn btn-primary' type='submit'>Checkout</button> : ""}
            </form>
        </div>
        </div>
        </div>
    </div>
    }
    
    <Footer isBottom={true}/>
    </>
  )
}

export default Checkout
