import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/Header';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Product from '../../components/Product';
import "./Search.css";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { getProductsFailure, getProductsStart, getProductsSuccess } from '../../redux/products/productsSlice';

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [productFilters, setProductfilters] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.StProducts);
  const [filters, setFilters] = useState({
    brands: [],
    categories: []
  });

  // this useref makes sure that filter api doesnt get called on first webpage render 
  const initialRender = useRef(true);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilter = prevFilters[filterType].includes(value) ? prevFilters[filterType].filter((item) => item !== value) : [...prevFilters[filterType], value];

      return {
        ...prevFilters,
        [filterType]: updatedFilter
      };
    });
  };
  
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return; // Skip the initial render
    }

    const updatedSearchResults = async() => {
      const res = await axios.post(`/api/product//search/filteredProduct`,{
        brands: filters.brands,
        categories: filters.categories
      });

      setFilteredProducts(res.data);
    }

    updatedSearchResults();

  }, [filters]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    // whenever search url changes set searchTerm
    setSearchValue(searchTermFromUrl);

    const getproductFilters = async() => {
      try {
        const res = await axios.get(`/api/product/searchfilters/getProductFilters`);
        setProductfilters(res.data)

      } catch (error) {
        console.log(error);
      }
    }

    const getFilteredProducts = async() => {
      const searchQuery = urlParams.toString();
      try {
        if(searchQuery !== ""){
          dispatch(getProductsStart());
          const res = await axios.get(`/api/product/search/searchedProduct?${searchQuery}`);
          setFilteredProducts(res.data);
          dispatch(getProductsSuccess());
          // console.log(filteredProducts);
          // console.log(res.data);
        }
      } catch (error) {
        dispatch(getProductsFailure(error.message));
        console.log(error);
      }
      
    };

    getproductFilters();
    getFilteredProducts();

  }, [location.search]);


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const urlParams = new URLSearchParams(); 
  //   urlParams.set("searchTerm", searchValue);

  //   const searchQuery = urlParams.toString();
  //   navigate(`/productSearch?${searchQuery}`);
  // }

  return (
    <>
      <Header />
      {
        loading ? <Spin className='spin-loader' indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}/> :
        <div className='search-container'>
        <div className='search-inner-container-left'>
          <div className='filtersheading'>
              FILTERS
          </div>
          <div className='brand-box'>
            <div className='brandsheading common-heading'>
                BRANDS
            </div>
            {
              productFilters?.brand?.map((brand) => (
                <ul>
                  <li>
                    <input type="checkbox" id={`brand-${brand}`} name="brand" value={brand} checked={filters.brands.includes(brand)} onChange={() => handleFilterChange('brands', brand)} />
                    <label htmlFor={`brand-${brand}`}>{brand}</label>
                  </li>
                </ul>
              ))
            }
          </div>
          
          <div className='categories-box'>
            <div className='categoriessheading common-heading'>
                  Categories
              </div>
            {
              productFilters?.category?.map((category) =>(
                <ul>
                  <li>
                    <input type="checkbox" id={`category-${category}`} name="category" value={category}  checked={filters.categories.includes(category)}
                  onChange={() => handleFilterChange('categories', category)}/>
                    <label htmlFor={`category-${category}`}>{category}</label>
                  </li>
                </ul>
              ) )
            }
          </div>
          
        </div>
        <div className="search-inner-container-right">
        {
          filteredProducts.length > 0 ?
          filteredProducts.map(product => (
          <Product productkey={product._id} productid={product._id} imagesrc = {product.imagesrc} name = {product.name} price = {product.price} rating={product.rating} hasMargin={true}/>
        )) : 
        <span>No Products found</span>
        }
        </div>
        
      </div>
      }
     

    </>
    
  )
}

export default Search
