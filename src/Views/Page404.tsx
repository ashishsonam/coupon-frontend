import React from "react";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <>
      <div className="w-full flex min-h-[100vh] flex-col items-center justify-center pt-[120px] pb-[20px] bg-brown200">
        <h1>404 NOT FOUND!</h1>
        <Link to={"/"}>
          <button className="w-full lg:w-auto my-4 border rounded-md px-1 sm:px-16 py-5 bg-red-700 text-white hover:bg-brown800 focus:outline-none focus:ring-2 focus:ring-brown900 focus:ring-opacity-50">
            Go back to Homepage
          </button>
        </Link>
      </div>
    </>
  );
};

export default Page404;
