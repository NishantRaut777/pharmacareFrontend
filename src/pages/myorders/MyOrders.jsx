import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import "./MyOrders.css";
import { fetchedMyOrders, gettingMyOrders } from '../../redux/myorders/myordersSlice';

const MyOrders = () => {

    const [orders, setOrders] = useState([]);
    const { loading, currentUser } = useSelector((state) => state.user);
    const {  loadingMyOrders } = useSelector((state) => state.myOrdersSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        const getMyOrders = async() =>{
            dispatch(gettingMyOrders())
            const res = await axios.post(`/api/order/getOrders`,{
                userid: currentUser?._id
            });
            dispatch(fetchedMyOrders());
            setOrders(res.data);
        }
        
        console.log(orders);
        getMyOrders();
    }, [currentUser?._id]);

  return (
    <>
        <Header />
        {
            loadingMyOrders ? (
                <Spin
            className="spin-loader"
            indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          />
            ) :
            (
                <>
                {
            orders.length > 0 ? (
                <div className='products-table-outer-container'>
            <h3>Your orders</h3>
            <div className='products-table-container'>
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                    { orders.map((order) => (
                        order.items.map((item) =>(
                            <tr>
                                <td><img src={item.imagesrc}></img></td>
                                <td className='product-table-name'>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{order.date_added}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price * item.quantity}</td>
                            </tr>
                        ))
                    )) }
                    
                </table>
            </div>
            
           
        </div>
            ) : 
            <div className='zero-orders-container'>
                <h3>Your orders</h3>
                <p>You dont have any orders yet</p>
            </div>
            
        }
                </>
            )

        }

        <Footer />
        
    </>
    
  )
}

export default MyOrders
