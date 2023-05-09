import { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError, AxiosInstance } from "axios";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { baseURL } from "../Constants/urls";
import Pagination from "../Components/Pagination";

interface Coupon {
  category: string;
  code: string;
  created_at: Date;
  deleted_at: Date | null;
  discount: number;
  end_date: Date;
  name: string;
  start_date: Date;
  type: string;
}

interface Page {
  currentPage: number;
  currentLimit: number;
  totalPages: number | null;
  total: number | null;
  previous: {
    page: number;
    limit: number;
  } | null;
  next: {
    page: number;
    limit: number;
  } | null;
}

const Home = () => {
  const [couponList, setCouponList] = useState<Array<Coupon>>([]);
  const memoizedCouponList = useMemo(() => couponList, [couponList]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState<Page>({
    currentPage: 1,
    currentLimit: 10,
    total: null,
    totalPages: null,
    previous: null,
    next: null,
  });

  const fetchCoupons = useCallback(async () => {
    try {
      const currPage = searchParams.get("page") || 1;
      const currLimit = searchParams.get("limit") || 10;

      const url = `${baseURL}/coupon?page=${
        parseInt(currPage.toString()) || 1
      }&limit=${parseInt(currLimit.toString()) || 10}`;

      const response = await axios.get(url);
      const data = response.data;
      if (data) {
        setPage(data.result);
        setCouponList(data.result.couponsList);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError?.response) {
        console.log("Error in fetching coupons:", axiosError?.response?.data);
        const data: any = axiosError?.response?.data;
        if (data.msg) {
          toast.error(data.msg);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const deleteCoupon = async (code: string) => {
    try {
      const url = `${baseURL}/coupon/${code}`;
      const response = await axios.delete(url);
      const data = response.data;
      if (data) {
        if (data.msg) {
          toast.success(data?.msg);
        }
        fetchCoupons();
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError?.response) {
        console.log("Error in deleting coupons:", axiosError?.response?.data);
      }
    }
  };

  return (
    <div className="w-full sm:w-[70%] lg:w-[60%] flex flex-col items-center justify-center mx-auto px-4">
      <h3 className="text-center mt-20 text-3xl leading-8 text-black font-bold tracking-wide">
        Admin Panel for Coupons
      </h3>
      <div className="w-full flex flex-row justify-around mt-10">
        <h5 className="text-gray-900 font-bold text-xl">Coupon Listing</h5>
        <Link to="/coupon/create">
          <button className="bg-green-400 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-plus-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span className="pl-2">Create Coupon</span>
          </button>
        </Link>
        <Link to="/user/apply_coupon">
          <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-plus-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <span className="pl-2">Apply Coupon</span>
          </button>
        </Link>
      </div>
      <div className="mt-10 w-full">
        {memoizedCouponList.map((coupon: Coupon) => (
          <div
            className="flex items-center bg-gray-100 mb-10 shadow"
            key={coupon.code}
          >
            <Link
              to={`/coupon/${coupon.code}`}
              className="flex-auto text-left px-4 py-2 m-2"
            >
              <p className="text-gray-900 leading-none">{coupon.name}</p>
              <p className="text-gray-600">{coupon.type}</p>
              <span className="inline-block text-sm font-semibold mt-1">
                {coupon.code}
              </span>
            </Link>
            <div className="flex-auto text-right px-4 py-2 m-2">
              <Link to={`/coupon/update/${coupon.code}`}>
                <button
                  title="Edit"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold mr-3 py-2 px-4 rounded-full inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-edit"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </Link>
              <button
                title="Remove"
                onClick={() => {
                  deleteCoupon(coupon.code);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-trash-2"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentLimit={page.currentLimit}
        totalPages={page.totalPages}
        isNext={page.next ? true : false}
        isPrevious={page.previous ? true : false}
        currentPage={page.currentPage}
        onNext={() => {
          setSearchParams({
            page: (page.currentPage + 1).toString(),
            limit: page.currentLimit.toString(),
          });
        }}
        onPrevious={() => {
          setSearchParams({
            page: (page.currentPage - 1).toString(),
            limit: page.currentLimit.toString(),
          });
        }}
        onClickIndex={(index: number) => {
          setSearchParams({
            page: index.toString(),
            limit: page.currentLimit.toString(),
          });
        }}
      />
    </div>
  );
};

export default Home;
