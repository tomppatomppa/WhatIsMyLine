import { useState } from "react";
import { PanelButton } from "../../../common/buttons/PanelButton";
import { useFormikContext } from "formik";
import { Scene } from "../../reader.types";

export const AutoScrollPanel = () => {
  const { values } = useFormikContext<Scene>()

  const handleSetCurrentScrollTarget = (currentScrollTarget: string) => {
    const elementToScrollTo = document.getElementById(currentScrollTarget);
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };
  const [scrollSpeed, setScrollSpeed] = useState(50);

  return (
    <>
      <label
        htmlFor="default-range"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Default range
      </label>
      <input
        id="default-range"
        type="range"
        value={scrollSpeed}
        onChange={(e) => setScrollSpeed(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
       <select onChange={(e) => handleSetCurrentScrollTarget(e.target.value)}>
        {values.data.map((line) => (
          <option key={line.id}>{line.id}</option>
        ))}
      </select>

      <PanelButton onClick={() => console.log("scroll")}>Start</PanelButton>
    </>
  );
};
