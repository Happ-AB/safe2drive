import type { UserData } from "../types";
import { SmallCTA } from "./styles";

interface Props {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export default function AlcoholSelector({ userData, setUserData }: Props) {
  const addBeer = () => {
    setUserData({ ...userData, beers: userData.beers + 1 });
  };
  const removeBeer = () => {
    setUserData({ ...userData, beers: userData.beers - 1 });
  };
  const addWine = () => {
    setUserData({ ...userData, wines: userData.wines + 1 });
  };
  const removeWine = () => {
    setUserData({ ...userData, wines: userData.wines - 1 });
  };
  const addCocktail = () => {
    setUserData({ ...userData, cocktails: userData.cocktails + 1 });
  };
  const removeCocktail = () => {
    setUserData({ ...userData, cocktails: userData.cocktails - 1 });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-4">Select Drinks Consumed</h2>
      <div className="flex justify-between">
        <div className="flex flex-col w-12">
          <button onClick={addBeer} className={SmallCTA}>
            +
          </button>
          <span className="text-3xl my-3 self-center">🍺</span>
          <button
            onClick={removeBeer}
            className={SmallCTA}
            disabled={!userData.beers || userData.beers < 1}
          >
            -
          </button>
          <p className="mt-4 text-center">{userData.beers}</p>
        </div>
        <div className="flex flex-col w-12">
          <button onClick={addWine} className={SmallCTA}>
            +
          </button>
          <span className="text-3xl my-3 self-center">🍷</span>
          <button
            onClick={removeWine}
            className={SmallCTA}
            disabled={!userData.wines || userData.wines < 1}
          >
            -
          </button>
          <p className="mt-4 text-center">{userData.wines}</p>
        </div>
        <div className="flex flex-col w-12">
          <button onClick={addCocktail} className={SmallCTA}>
            +
          </button>
          <span className="text-3xl my-3 self-center">🍸</span>
          <button
            onClick={removeCocktail}
            className={SmallCTA}
            disabled={!userData.cocktails || userData.cocktails < 1}
          >
            -
          </button>
          <p className="mt-4 text-center">{userData.cocktails}</p>
        </div>
      </div>
    </div>
  );
}
