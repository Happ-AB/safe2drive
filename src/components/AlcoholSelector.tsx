import type { UserData } from "../types";
import {
  BeakerIcon,
  WindowIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface Props {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export default function AlcoholSelector({ userData, setUserData }: Props) {
  const addDrink = (drink: string) => {
    setUserData({ ...userData, [drink]: userData.alcoholUnits + 1 });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-4">Select Drinks Consumed</h2>
      <div className="flex justify-around">
        <button
          onClick={() => addDrink("beer")}
          className="flex flex-col items-center"
        >
          <BeakerIcon className="h-12 w-12 text-blue-600" />
          <span className="text-sm">Beer</span>
        </button>
        <button
          onClick={() => addDrink("wine")}
          className="flex flex-col items-center"
        >
          <WindowIcon className="h-12 w-12 text-blue-600" />
          <span className="text-sm">Wine</span>
        </button>
        <button
          onClick={() => addDrink("cocktail")}
          className="flex flex-col items-center"
        >
          <MagnifyingGlassIcon className="h-12 w-12 text-blue-600" />
          <span className="text-sm">Cocktail</span>
        </button>
      </div>
      <p className="mt-4 text-center">Drinks: {userData.alcoholUnits}</p>
    </div>
  );
}
