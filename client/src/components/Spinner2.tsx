import { CSSProperties } from "react";
import { BarLoader } from "react-spinners"

 const override: CSSProperties = {
   position: "absolute",
   margin: "0 auto",
   width: "100%"
  
};
export default function Spinner() {

  return (
    <BarLoader
      cssOverride={override}
    />
  )
}
