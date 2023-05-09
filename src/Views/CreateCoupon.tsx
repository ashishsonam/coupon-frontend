import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CouponCategory, CouponType } from "../Constants/enums";
import NewAgeGroup from "../Components/NewAgeGroup";
import axios, { AxiosError } from "axios";
import Delete from "../Assets/Icons/Delete";
import { toast } from "react-toastify";
import { baseURL } from "../Constants/urls";
import moment from "moment";

export interface AgeGroup {
  start_age: number | null;
  end_age: number | null;
}

export interface Coupon {
  name: string | null;
  code: string | null;
  type: keyof typeof CouponType | null;
  discount: number | null;
  start_date: Date | null;
  end_date: Date | null;
  category: keyof typeof CouponCategory | null;
  age_groups: Array<AgeGroup>;
  dfs: string | null;
}

const CreateCoupon = () => {
  const [coupon, setCoupon] = useState<Coupon>({
    name: null,
    code: null,
    type: null,
    discount: null,
    start_date: null,
    end_date: null,
    category: null,
    age_groups: [],
    dfs: null,
  });

  const [error, setError] = useState({
    name: null,
    code: null,
    type: null,
    discount: null,
    start_date: null,
    category: null,
    dfs: null,
    age_groups: null,
  });

  const navigate = useNavigate();

  const validateCoupon = (event: any) => {
    event.preventDefault();

    setError({
      name: null,
      code: null,
      type: null,
      discount: null,
      start_date: null,
      category: null,
      dfs: null,
      age_groups: null,
    });

    var valid = true;

    if (!coupon.name || coupon.name.trim().length === 0) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          name: "name cannot be empty",
        };
      });
    }

    if (!coupon.code || coupon.code.trim().length === 0) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          code: "code cannot be empty",
        };
      });
    }

    if (coupon.code && coupon.code.trim().length > 6) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          code: "code cannot be more then 6 character",
        };
      });
    }

    if (!coupon.type || coupon.type.trim().length === 0) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          type: "type cannot be empty",
        };
      });
    }

    if (!coupon.discount) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          discount: "discount cannot be empty",
        };
      });
    }

    if (
      coupon.start_date &&
      coupon.end_date &&
      coupon.end_date < coupon.start_date
    ) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          start_date: "start date cannot be greater than end date",
        };
      });
    }

    if (!coupon.category) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          category: "category cannot be empty",
        };
      });
    }

    if (
      coupon.category === CouponCategory.DFS &&
      (!coupon.dfs || (coupon.dfs && coupon.dfs.trim().length === 0))
    ) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          dfs: "DFS cannot be empty",
        };
      });
    }

    if (coupon.category === CouponCategory.DFS) {
      if (coupon.dfs) {
        let newdfs = null;
        let dfs = coupon.dfs;
        const len = coupon.dfs.length;
        if (coupon.dfs[len - 1] === ",") {
          dfs = coupon.dfs.substring(0, len - 1);
        }

        newdfs = dfs.split(",").map(Number);

        for (let days of newdfs) {
          if (!days || days < 0) {
            valid = false;
            setError((preValue: any) => {
              return {
                ...preValue,
                dfs: "DFS format is not correct",
              };
            });
            break;
          }
        }
      }
    }

    if (
      coupon.category === CouponCategory.AGE_GROUP &&
      (!coupon.age_groups ||
        (coupon.age_groups && coupon.age_groups.length === 0))
    ) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          age_groups: "At least 1 age group should be present",
        };
      });
    }

    if (!valid) {
      return;
    }
    submitCoupon();
  };

  const generateCouponCode = (event: any) => {
    event.preventDefault();
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let couponCode = "";
    for (var i = 0; i < 6; i++) {
      couponCode += chars[Math.floor(Math.random() * chars.length)];
    }
    setCoupon((prev) => {
      return {
        ...prev,
        code: couponCode,
      };
    });
  };

  const submitCoupon = async () => {
    try {
      const url = `${baseURL}/coupon`;

      let newdfs = null;
      if (coupon.category === CouponCategory.DFS) {
        if (coupon.dfs) {
          let dfs = coupon.dfs;
          const len = coupon.dfs.length;
          if (coupon.dfs[len - 1] === ",") {
            dfs = coupon.dfs.substring(0, len - 1);
          }

          newdfs = dfs.split(",").map(Number);
        }
      }

      const body = {
        name: coupon.name,
        code: coupon.code,
        type: coupon.type,
        discount: coupon.discount,
        start_date:
          coupon.start_date && coupon.start_date.toString().trim().length !== 0
            ? coupon.start_date
            : null,
        end_date:
          coupon.end_date && coupon.end_date.toString().trim().length !== 0
            ? coupon.end_date
            : null,
        category: coupon.category,
        age_groups: coupon.age_groups,
        dfs: newdfs,
      };
      const response = await axios.post(url, body);

      const data = response.data;

      if (data) {
        if (data.msg) {
          toast.success(data?.msg);
        }
        navigate(`/coupon`, { replace: true });
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError?.response) {
        console.log("Error in submit coupon:", axiosError?.response?.data);
        const data: any = axiosError?.response?.data;
        if (data.msg) {
          toast.error(data.msg);
        }
      }
    }
  };
  const inputEvent = (event: any) => {
    const { name, value } = event.target;
    setCoupon((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  return (
    <form
      className="w-full max-w-sm container mt-20 mb-10 mx-auto px-4"
      onSubmit={validateCoupon}
    >
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
          onChange={inputEvent}
          type="text"
          placeholder="Enter name"
        />
        {error.name && (
          <div className=" text-red-900 text-xs mt-2">{error.name}</div>
        )}
      </div>
      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="code"
        >
          Code
        </label>
        <div className="flex flex-row">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:text-gray-600 focus:shadow-outline"
            name="code"
            onChange={inputEvent}
            value={coupon.code ? coupon.code : ""}
            type="text"
            placeholder="Generate code"
          />
          <button
            onClick={generateCouponCode}
            className="bg-red-600 text-white px-4 py-2"
          >
            Generate
          </button>
        </div>
        {error.code && (
          <div className=" text-red-900 text-xs mt-2">{error.code}</div>
        )}
      </div>
      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="type"
        >
          Type
        </label>
        <div className="flex flex-row">
          {Object.keys(CouponType).map((type, index) => {
            if (isNaN(Number(type))) {
              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCoupon((prev) => {
                      return {
                        ...prev,
                        type: type as keyof typeof CouponType,
                      };
                    });
                  }}
                  className={`shadow-md px-4 py-2 ml-4 ${
                    type === coupon.type
                      ? "bg-blue-400 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {type}
                </button>
              );
            }
            return <></>;
          })}
        </div>
        {error.type && (
          <div className=" text-red-900 text-xs mt-2">{error.type}</div>
        )}
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
          onChange={inputEvent}
          type="text"
          placeholder="Enter discount"
        />
        {error.discount && (
          <div className=" text-red-900 text-xs mt-2">{error.discount}</div>
        )}
      </div>

      <div className="w-full mb-5">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="start_date"
        >
          Start Date (Optional)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:text-gray-600"
          name="start_date"
          value={coupon.start_date ? coupon.start_date.toString() : ""}
          onChange={inputEvent}
          type="date"
        />
        {error.start_date && (
          <div className=" text-red-900 text-xs mt-2">{error.start_date}</div>
        )}
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
          value={coupon.end_date ? coupon.end_date.toString() : ""}
          onChange={inputEvent}
          type="date"
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
          {Object.keys(CouponCategory).map((cat, index) => {
            if (isNaN(Number(cat))) {
              return (
                <div className="flex flex-row" key={index}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCoupon((prev) => {
                        return {
                          ...prev,
                          category: cat as keyof typeof CouponCategory,
                        };
                      });
                    }}
                    className={`shadow-md px-4 py-2 ml-4 ${
                      cat === coupon.category
                        ? "bg-blue-400 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {cat}
                  </button>
                </div>
              );
            }
            return <></>;
          })}
        </div>
        {error.category && (
          <div className=" text-red-900 text-xs mt-2">{error.category}</div>
        )}
      </div>

      {coupon.category && coupon.category === CouponCategory.AGE_GROUP && (
        <div className="w-full mb-5">
          <label
            htmlFor="addgroup"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Age Group
          </label>
          <div className="flex flex-row">
            {coupon.age_groups &&
              coupon.age_groups.map((age_group: AgeGroup, index) => {
                return (
                  <div key={index} className="flex flex-row">
                    <div className="bg-white shadow-md px-4 py-2 ml-4">
                      {age_group.start_age} - {age_group.end_age}
                    </div>
                    <button
                      onClick={(event: any) => {
                        event.preventDefault();
                        coupon.age_groups.splice(index, 1);
                        setCoupon((prev) => {
                          return {
                            ...prev,
                            age_groups: coupon.age_groups,
                          };
                        });
                      }}
                      className="w-10 h-10 bg-red-600 rounded-sm items-center justify-center flex flex-col"
                    >
                      <Delete size={30} color={"#FFFFFF"} />
                    </button>
                  </div>
                );
              })}
          </div>
          <div className="w-full flex flex-row justify-center mt-2">
            <NewAgeGroup age_groups={coupon.age_groups} setCoupon={setCoupon} />
          </div>
          {error.age_groups && (
            <div className=" text-red-900 text-xs mt-2">{error.age_groups}</div>
          )}
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
            value={coupon.dfs ? coupon.dfs : ""}
            onChange={inputEvent}
            type="text"
            placeholder="1,2,3,"
          />
          {error.dfs && (
            <div className=" text-red-900 text-xs mt-2">{error.dfs}</div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button className="mt-5 bg-green-400 w-full hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create Coupon
        </button>
      </div>
      <div className="text-center mt-4 text-gray-500">
        <Link to="/">Cancel</Link>
      </div>
    </form>
  );
};

export default CreateCoupon;
