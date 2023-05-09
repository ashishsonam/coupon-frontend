import React from "react";

interface PaginationProps {
  isPrevious: boolean;
  isNext: boolean;
  totalPages: number | null;
  currentPage: number;
  currentLimit: number;
  onNext: () => void;
  onPrevious: () => void;
  onClickIndex: (val: number) => void;
}

const Pagination = ({
  isPrevious,
  isNext,
  totalPages,
  currentPage,
  currentLimit,
  onNext,
  onPrevious,
  onClickIndex,
}: PaginationProps) => {
  return (
    <>
      <div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
        <div className="w-full  flex items-center justify-between border-t border-gray-200">
          {isPrevious && (
            <button
              onClick={onPrevious}
              className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
            >
              <svg
                width={14}
                height={8}
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.1665 4H12.8332"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.1665 4L4.49984 7.33333"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.1665 4.00002L4.49984 0.666687"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm ml-3 font-medium leading-none ">Previous</p>
            </button>
          )}

          <div className="flex">
            {totalPages &&
              [...new Array(totalPages < 5 ? totalPages : 5)].map(
                (item, index) => {
                  if (currentPage > 5) {
                    index = currentPage - 4 + index;
                  } else {
                    index = index + 1;
                  }
                  return (
                    <button
                      onClick={() => {
                        onClickIndex(index);
                      }}
                      key={index}
                      className={`text-sm font-medium leading-none cursor-pointer  hover:text-indigo-700 border-t hover:border-indigo-400 pt-3 mr-4 px-2 ${
                        currentPage === index
                          ? "text-indigo-700 border-indigo-400"
                          : "text-gray-600 border-transparent"
                      }`}
                    >
                      {index}
                    </button>
                  );
                }
              )}
          </div>
          {isNext && (
            <button
              onClick={onNext}
              className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
            >
              <p className="text-sm font-medium leading-none mr-3">Next</p>
              <svg
                width={14}
                height={8}
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.1665 4H12.8332"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 7.33333L12.8333 4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 0.666687L12.8333 4.00002"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Pagination;
