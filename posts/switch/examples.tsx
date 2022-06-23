import { useState } from "react";
import { Switch } from "@atomic_ui_react/mod.ts";

export const BasicExample = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Switch
      isCheckedSet={[isChecked, setIsChecked]}
      className={`${isChecked ? "bg-dark-900" : "bg-dark-100"}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer ease-in-out focus:outline-none transition duration-300 focus:ring-2 focus:ring-white focus:ring-opacity-75`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${isChecked ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
      />
    </Switch>
  );
};
