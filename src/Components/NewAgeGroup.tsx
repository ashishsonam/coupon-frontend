import { Dispatch, SetStateAction, useState } from "react";
import Delete from "../Assets/Icons/Delete";
import Plus from "../Assets/Icons/Plus";
import Tick from "../Assets/Icons/Tick";
import { AgeGroup, Coupon } from "../Views/CreateCoupon";

interface Props {
  age_groups: Array<AgeGroup>;
  setCoupon: Dispatch<SetStateAction<Coupon>>;
}
const NewAgeGroup = ({ age_groups, setCoupon }: Props) => {
  const [newAgeGroup, setNewAgeGroup] = useState<AgeGroup>({
    start_age: null,
    end_age: null,
  });

  const [error, setError] = useState({
    start_age: null,
    end_age: null,
  });

  const inputEvent = (event: any) => {
    const { name, value } = event.target;
    setNewAgeGroup((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const onAdd = () => {
    setIsAdding(true);
    setNewAgeGroup({
      start_age: null,
      end_age: null,
    });
    setError({
      start_age: null,
      end_age: null,
    });
  };

  const onDelete = () => {
    setIsAdding(false);
    setNewAgeGroup({
      start_age: null,
      end_age: null,
    });
    setError({
      start_age: null,
      end_age: null,
    });
  };

  const onSave = (event: any) => {
    event.preventDefault();

    setError({
      start_age: null,
      end_age: null,
    });

    var valid = true;

    if (!newAgeGroup.start_age) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          start_age: "Start age cannot be empty",
        };
      });
    }

    if (newAgeGroup.start_age && newAgeGroup.start_age < 0) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          start_age: "Start age cannot be negative",
        };
      });
    }

    if (!newAgeGroup.end_age) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          end_age: "End age cannot be empty",
        };
      });
    }

    if (newAgeGroup.end_age && newAgeGroup.end_age < 0) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          end_age: "End age cannot be negative",
        };
      });
    }

    if (
      newAgeGroup.end_age &&
      newAgeGroup.start_age &&
      parseInt(newAgeGroup.end_age.toString()) <
        parseInt(newAgeGroup.start_age.toString())
    ) {
      valid = false;
      setError((preValue: any) => {
        return {
          ...preValue,
          end_age: "End age cannot be smaller than start age",
        };
      });
    }

    if (valid) {
      age_groups.push(newAgeGroup);

      setCoupon((prev) => {
        return {
          ...prev,
          age_groups: age_groups,
        };
      });
      setIsAdding(false);
      setNewAgeGroup({
        start_age: null,
        end_age: null,
      });
      setError({
        start_age: null,
        end_age: null,
      });
    }
  };

  return (
    <>
      <div className="w-full flex flex-row items-center">
        {isAdding ? (
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="start_age"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              >
                Start Age
              </label>
              <input
                type="number"
                min={0}
                pattern="[0-9]*"
                name="start_age"
                value={newAgeGroup.start_age ? newAgeGroup.start_age : ""}
                onChange={inputEvent}
                id="start_age"
                autoComplete="start_age"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:text-gray-600"
              />
              {error.start_age && (
                <div className="absolute text-red-900 text-xs mt-2 bottom-[-36px]">
                  {error.start_age}
                </div>
              )}
            </div>
            <div className="relative w-full flex flex-col">
              <label
                htmlFor="end_age"
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              >
                end_age
              </label>
              <input
                type="number"
                min={0}
                pattern="[0-9]*"
                name="end_age"
                value={newAgeGroup.end_age ? newAgeGroup.end_age : ""}
                onChange={inputEvent}
                id="end_age"
                autoComplete="end_age"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:text-gray-600"
              />
              {error.end_age && (
                <div className="absolute text-red-900 text-xs mt-2 bottom-[-36px]">
                  {error.end_age}
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2 items-end mt-2">
              <button
                onClick={onSave}
                className="w-10 h-10 bg-green-600 rounded-sm items-center justify-center flex flex-col"
              >
                <Tick size={30} color={"#FFFFFF"} />
              </button>
              <button
                onClick={onDelete}
                className="w-10 h-10 bg-red-600 rounded-sm items-center justify-center flex flex-col"
              >
                <Delete size={30} color={"#FFFFFF"} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="w-10 h-10 bg-green-500 rounded-sm items-center justify-center flex flex-col"
          >
            <Plus size={30} color={"#FFFFFF"} />
          </button>
        )}
      </div>
    </>
  );
};

export default NewAgeGroup;
