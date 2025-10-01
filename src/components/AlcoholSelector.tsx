import type { UserData } from "../types";
import Card from "./ui/Card";
import Button from "./ui/Button";

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
  const justAte = () => {
    setUserData({ ...userData, meal: true });
  };
  const didNotEat = () => {
    setUserData({ ...userData, meal: false });
  };

  return (
    <>
      <Card className="mt-4 p-6">
        <h2 className="text-lg font-semibold mb-4">How much did you drink?</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              <Button onClick={addBeer} size="sm" variant="primary">
                +
              </Button>
              <Button
                onClick={removeBeer}
                size="sm"
                disabled={!userData.beers || userData.beers < 1}
              >
                -
              </Button>
            </div>
            <span className="text-4xl my-3">🍺</span>
            <p className="mt-1 text-muted">{userData.beers}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              <Button onClick={addWine} size="sm" variant="primary">
                +
              </Button>
              <Button
                onClick={removeWine}
                size="sm"
                disabled={!userData.wines || userData.wines < 1}
              >
                -
              </Button>
            </div>
            <span className="text-4xl my-3">🍷</span>
            <p className="mt-1 text-muted">{userData.wines}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              <Button onClick={addCocktail} size="sm" variant="primary">
                +
              </Button>
              <Button
                onClick={removeCocktail}
                size="sm"
                disabled={!userData.cocktails || userData.cocktails < 1}
              >
                -
              </Button>
            </div>
            <span className="text-4xl my-3">🍸</span>
            <p className="mt-1 text-muted">{userData.cocktails}</p>
          </div>
        </div>
      </Card>
      <Card className="mt-4 p-6 w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">Did You Eat?</h2>
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={justAte}
            variant={userData.meal ? "primary" : "default"}
            className="w-20"
          >
            Yes
          </Button>
          <Button
            onClick={didNotEat}
            variant={!userData.meal ? "danger" : "default"}
            className="w-20"
          >
            No
          </Button>
        </div>
      </Card>
    </>
  );
}
