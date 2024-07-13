import React, { useEffect, useState } from 'react';
import { message, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import axios from "axios";
import "./Singleproduct.css";
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, addToCartFailure, addingToCart} from '../../redux/cart/cartSlice';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoToTop from '../../components/GoToTop';

const Singleproduct = () => {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    // console.log(path);
    const [product, setProduct] = useState();
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { cartData, loading } = useSelector((state) => state.cart);

    useEffect(() => {
      const getProduct = async() => {
        const res = await axios.get('/api/product/' + path);
        setProduct(res.data);
      };

      getProduct();
    },[path]);

    const handleAddToCart = async() => {
      try {
        if(!currentUser){
          message.error("Please login to buy products");
          return;
        }
        dispatch(addingToCart());
        const res = await axios.post(`/api/cart/addCartItem/${currentUser._id}`, {
          productId: product?._id,
          quantity: quantity
        });
        // console.log(res.data);
        dispatch(addToCart(res.data));
        message.success("Item added successfully");

      } catch (error) {
        dispatch(addToCartFailure(error));
        message.error("Something went wrong!");
      }
  }

  return (
    <>
    <Header />
    { loading ? <Spin className='spin-loader' indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}/> :
      <section className='single-product-section'>
      <div className="single-product-container">
        <img src={product?.imagesrc} alt="" />
        <div>
          <h3>{product?.name}</h3>
          <span>{product?.rating} <i class="fa-solid fa-star" style={{ color: "#FFD43B"}}></i></span>
          <h4>&#8377; {product?.price}</h4>
          <p>{product?.description}</p>
          <ul>
          { product?.features.map((feature) => (
            <li>
              {feature}
            </li>
          ))
          }
          </ul>
          <div className="add-to-cart-container">
            <button className="my-link btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
            <div className='quantity-container'>
              <i class="fa-solid fa-minus" style={{color: "#ef0b2d"}} onClick={() => {quantity === 1 ? setQuantity(1) : setQuantity(quantity-1)}} ></i>
              <span>{quantity}</span>
              <i class="fa-solid fa-plus" style={{color: "#2adf3f"}} onClick={() => setQuantity(quantity + 1)}></i>
            </div>
          </div>
          </div>
        </div>
    </section>}
    <GoToTop />
    <Footer />
    </>
  )
}

export default Singleproduct
