import { Script } from "src/components/ReaderV3/reader.types";

export const getCurrentScript = (scripts: Script[], activeScriptFilename: string): Script | undefined => 
    scripts.find(({filename}) => filename === activeScriptFilename)
