import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import HeightWeightInput from "../components/HeightWeightInput";
import AlcoholSelector from "../components/AlcoholSelector";
import type { UserData } from "../types";

export default function Landing() {
  const [userData, setUserData] = useLocalStorage<UserData>("userData", {
    height: null,
    weight: null,
    beers: 0,
    wines: 0,
    cocktails: 0,
  });

  const isDataComplete = userData.height && userData.weight;

  return (
    <div className="p-4 flex flex-col items-center max-w-md mx-auto">
      {!isDataComplete ? (
        <HeightWeightInput userData={userData} setUserData={setUserData} />
      ) : (
        <>
          <AlcoholSelector userData={userData} setUserData={setUserData} />
          <Link
            to="/start"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded text-center"
          >
            Start Test
          </Link>
        </>
      )}
    </div>
  );
}
