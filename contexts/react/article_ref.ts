import { createContext, createRef, RefObject } from "react";

const Context = createContext<RefObject<Element>>(createRef());
export default Context;
