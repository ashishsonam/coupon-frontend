import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CouponCategory, CouponType } from "../Constants/enums";
import { AgeGroup } from "./CreateCoupon";
import moment from "moment";
import { toast } from "react-toastify";
import { baseURL } from "../Constants/urls";

interface Coupon {
  name: string | null;
  code: string | null;
  type: keyof typeof CouponType | null;
  discount: number | null;
  start_date: Date | null;
  end_date: Date | null;
  category: keyof typeof CouponCategory | null;
  age_groups: Array<AgeGroup> | null;
  dfs: Array<number> | null;
}

const ViewCoupon = () => {
  const [coupon, setCoupon] = useState<Coupon>({
    name: null,
    code: null,
    type: null,
    discount: null,
    start_date: null,
    end_date: null,
    category: null,
    age_groups: null,
    dfs: null,
  });

  const params = useParams();
  const code = params.code;
  const navigate = useNavigate();

  const fetchCoupon = useCallback(async () => {
    try {
      const url = `${baseURL}/coupon/${code}`;

      const response = await axios.get(url);

      const data = response.data;

      if (data) {
        const couponData = data.coupon;
        setCoupon(couponData);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError?.response) {
        console.log("Error in fetch coupon:", axiosError?.response?.data);
        const data: any = axiosError?.response?.data;
        if (data.msg) {
          toast.error(data.msg);
        }
        navigate("/404", { replace: true });
      }
    }
  }, [code]);

  useEffect(() => {
    fetchCoupon();
  }, [fetchCoupon]);

  return (
    <div className="w-full max-w-sm container mt-20 mb-10  mx-auto px-4">
      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="name"
        >
          Name of coupon
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:text-gray-600"
          name="name"
          value={coupon.name ? coupon.name : ""}
          disabled={true}
          type="text"
          placeholder="Enter name"
        />
      </div>
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
          value={coupon.code ? coupon.code : ""}
          disabled={true}
          type="text"
          placeholder="Enter code"
        />
      </div>
      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="type"
        >
          Type
        </label>
        <div className="flex flex-row">
          <div className={`bg-white shadow-md px-4 py-2 ml-4`}>
            {coupon.type}
          </div>
        </div>
      </div>
      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="discount"
        >
          Discount
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:text-gray-600"
          name="discount"
          value={coupon.discount ? coupon.discount : ""}
          disabled={true}
          type="text"
          placeholder="Enter discount"
        />
      </div>

      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="start_date"
        >
          Start Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:text-gray-600"
          name="start_date"
          value={
            coupon.start_date
              ? moment(coupon.start_date.toString()).format("DD-MM-YYYY")
              : "NULL"
          }
          disabled={true}
          type="text"
          placeholder="Enter start date"
        />
      </div>

      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="end_date"
        >
          End Date (Optional)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:text-gray-600"
          name="end_date"
          value={
            coupon.end_date
              ? moment(coupon.end_date.toString()).format("DD-MM-YYYY")
              : "NULL"
          }
          disabled={true}
          type="text"
          placeholder="Enter end date"
        />
      </div>

      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="category"
        >
          Category
        </label>
        <div className="flex flex-row">
          <div className={`bg-white shadow-md px-4 py-2 ml-4`}>
            {coupon.category}
          </div>
        </div>
      </div>

      {coupon.category && coupon.category === CouponCategory.AGE_GROUP && (
        <div className="w-full mb-5">
          <label
            htmlFor="age group"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Age Group
          </label>
          <div className="flex flex-row">
            {coupon.age_groups &&
              coupon.age_groups.map((age_group: AgeGroup, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white shadow-md px-4 py-2 ml-4"
                  >
                    {age_group.start_age} - {age_group.end_age}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {coupon.category && coupon.category === CouponCategory.DFS && (
        <div className="w-full mb-5">
          <label
            htmlFor="dfs"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            DFS
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline"
            name="dfs"
            value={coupon.dfs ? coupon.dfs.toString() : "NULL"}
            disabled={true}
            type="text"
            placeholder="Enter code"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          to={`/coupon/update/${code}`}
          className="mt-5 bg-green-400 w-full hover:bg-green-500 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Edit Coupon
        </Link>
      </div>
    </div>
  );
};

export default ViewCoupon;
