import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { baseURL } from "../Constants/urls";

interface Product {
  code: string | null;
  product_price: number | null;
  user_id: number | null;
}
const ApplyCoupon = () => {
  const [product, setProduct] = useState<Product>({
    code: null,
    product_price: null,
    user_id: null,
  });

  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [error, setError] = useState({
    code: null,
    product_price: null,
    user_id: null,
  });

  const submitData = async () => {
    try {
      const url = `${baseURL}/user/apply_coupon`;
      const body = {
        code: product.code,
        product_price: product.product_price,
        user_id: product.user_id,
      };

      const response = await axios.post(url, body);

      const data = response.data;

      if (data) {
        if (data.msg) {
          toast.success(data?.msg);
        }
        setNewPrice(data.discountPrice);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError?.response) {
        console.log("Error in apply coupon:", axiosError?.response?.data);
        const data: any = axiosError?.response?.data;
        if (data.msg) {
          toast.error(data.msg);
        }
      }
    }
  };

  const validateData = (event: any) => {
    event.preventDefault();

    setError({
      code: null,
      product_price: null,
      user_id: null,
    });

    var valid = true;

    if (!product.code || product.code.trim().length === 0) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          code: "code cannot be empty",
        };
      });
    }

    if (!product.product_price) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          product_price: "Product price cannot be empty",
        };
      });
    }
    if (!product.user_id) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          user_id: "User id cannot be empty",
        };
      });
    }

    if (!valid) {
      return;
    }

    submitData();
  };

  const inputEvent = (event: any) => {
    const { name, value } = event.target;
    setProduct((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  return (
    <form
      className="w-full max-w-sm container mt-20 mx-auto"
      onSubmit={validateData}
    >
      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="code"
        >
          Code
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline"
          name="code"
          value={product.code ? product.code : ""}
          onChange={inputEvent}
          type="text"
          placeholder="Enter code"
        />
        {error.code && (
          <div className=" text-red-900 text-xs mt-2">{error.code}</div>
        )}
      </div>

      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="product_price"
        >
          Product Price
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline"
          name="product_price"
          value={product.product_price ? product.product_price : ""}
          onChange={inputEvent}
          type="text"
          placeholder="Enter product price"
        />
        {error.product_price && (
          <div className=" text-red-900 text-xs mt-2">
            {error.product_price}
          </div>
        )}
      </div>

      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="user_id"
        >
          User ID
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline"
          name="user_id"
          value={product.user_id ? product.user_id : ""}
          onChange={inputEvent}
          type="text"
          placeholder="Enter User ID"
        />
        {error.user_id && (
          <div className=" text-red-900 text-xs mt-2">{error.user_id}</div>
        )}
      </div>

      {newPrice && (
        <div className="w-full mb-5">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="new_price"
          >
            New Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline"
            name="new_price"
            value={newPrice}
            disabled={true}
            type="text"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <button className="mt-5 bg-green-400 w-full hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Apply Coupon
        </button>
      </div>
      <div className="text-center mt-4 text-gray-500">
        <Link to="/">Cancel</Link>
      </div>
    </form>
  );
};

export default ApplyCoupon;
