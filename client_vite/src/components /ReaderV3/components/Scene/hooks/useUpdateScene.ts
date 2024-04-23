import { useMutation, useQueryClient } from "react-query"
import { updateScript } from "src/API/scriptApi"
import { Script } from "src/components/ReaderV3/reader.types"

export const useUpdateScript = (script: Script) => {
    const client = useQueryClient()
    return useMutation(() => updateScript(script), {
        onSuccess: () => {
            client.invalidateQueries("scripts")
        }
    })
}