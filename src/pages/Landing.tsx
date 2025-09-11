import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import HeightWeightInput from "../components/PersonalInput";
import AlcoholSelector from "../components/AlcoholSelector";
import type { UserData } from "../types";

export default function Landing() {
  const [userData, setUserData] = useLocalStorage<UserData>("userData", {
    age: 0,
    weight: 0,
    gender: undefined,
    beers: 0,
    wines: 0,
    cocktails: 0,
    meal: false,
  });

  const isDataComplete = userData.age && userData.weight;

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
