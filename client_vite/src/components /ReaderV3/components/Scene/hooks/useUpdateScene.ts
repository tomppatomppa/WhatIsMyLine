import { useMutation, useQueryClient } from "react-query"
import { updateScript } from "../../../../../API/scriptApi"
import { Script } from "../../../reader.types"

export const useUpdateScript = (script: Script) => {
    const client = useQueryClient()
    return useMutation(() => updateScript(script), {
        onSuccess: () => {
            client.invalidateQueries("scripts")
        }
    })
}